import { query, transaction } from '../database/client';
import { requireAuth, requireProjectAccess } from '../auth/middleware';
import { publish } from '../messaging/client';
import { getCached, setCached, invalidateCache } from '../cache/strategies';
import { CacheKeys, CacheTTL } from '../cache/keys';

export interface AssetMetadata {
  width?: number;
  height?: number;
  format?: string;
  size: number;
  mimeType: string;
  checksum?: string;
}

export interface ProcessedAsset {
  id: string;
  project_id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  metadata: AssetMetadata;
  url?: string;
  thumbnail_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AssetUploadOptions {
  projectId: string;
  file: File;
  path?: string;
  generateThumbnail?: boolean;
  optimize?: boolean;
}

export class AssetProcessor {
  private static readonly MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  private static readonly SUPPORTED_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'video/mp4',
    'video/webm',
    'model/gltf+json',
    'model/gltf-binary',
    'application/octet-stream', // For .fbx, .obj, etc
  ];

  static async uploadAsset(options: AssetUploadOptions): Promise<ProcessedAsset> {
    await requireProjectAccess(options.projectId);
    const auth = await requireAuth();

    this.validateFile(options.file);

    const metadata = await this.extractMetadata(options.file);
    const processedData = await this.processFile(options.file, metadata);

    return transaction(async (client) => {
      const result = await client.query<ProcessedAsset>(
        `INSERT INTO slate_assets
         (project_id, name, path, type, size, metadata, url, thumbnail_url, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          options.projectId,
          options.file.name,
          options.path || `assets/${options.file.name}`,
          this.getAssetType(options.file.type),
          options.file.size,
          JSON.stringify(metadata),
          processedData.url,
          processedData.thumbnailUrl,
          auth.userId,
        ]
      );

      const asset = result.rows[0];

      await invalidateCache(CacheKeys.projectAssets(options.projectId));

      await publish('slate.asset.uploaded', {
        assetId: asset.id,
        projectId: options.projectId,
        name: asset.name,
        type: asset.type,
        userId: auth.userId,
        timestamp: new Date().toISOString(),
      });

      return asset;
    });
  }

  private static validateFile(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    }

    if (!this.SUPPORTED_TYPES.includes(file.type) && !file.name.match(/\.(fbx|obj|unity|prefab|mat|asset)$/i)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  }

  private static async extractMetadata(file: File): Promise<AssetMetadata> {
    const metadata: AssetMetadata = {
      size: file.size,
      mimeType: file.type,
    };

    if (file.type.startsWith('image/')) {
      const dimensions = await this.getImageDimensions(file);
      metadata.width = dimensions.width;
      metadata.height = dimensions.height;
      metadata.format = file.type.split('/')[1];
    }

    metadata.checksum = await this.calculateChecksum(file);

    return metadata;
  }

  private static async getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }

  private static async calculateChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  private static async processFile(
    file: File,
    metadata: AssetMetadata
  ): Promise<{ url: string; thumbnailUrl?: string }> {
    const base64 = await this.fileToBase64(file);

    const url = `data:${file.type};base64,${base64}`;
    let thumbnailUrl: string | undefined;

    if (file.type.startsWith('image/')) {
      thumbnailUrl = await this.generateThumbnail(file);
    }

    return { url, thumbnailUrl };
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private static async generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for thumbnail'));
      };

      img.src = url;
    });
  }

  private static getAssetType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'texture';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.includes('gltf')) return 'model';
    return 'other';
  }

  static async getAssets(projectId: string): Promise<ProcessedAsset[]> {
    await requireProjectAccess(projectId);

    const cacheKey = CacheKeys.projectAssets(projectId);
    return getCached(
      cacheKey,
      async () => {
        const result = await query<ProcessedAsset>(
          `SELECT * FROM slate_assets
           WHERE project_id = $1 AND deleted_at IS NULL
           ORDER BY created_at DESC`,
          [projectId]
        );
        return result.rows;
      },
      CacheTTL.assets
    );
  }

  static async deleteAsset(assetId: string): Promise<boolean> {
    const auth = await requireAuth();

    const asset = await query<ProcessedAsset>(
      `SELECT project_id FROM slate_assets WHERE id = $1 AND deleted_at IS NULL`,
      [assetId]
    );

    if (asset.rows.length === 0) {
      return false;
    }

    await requireProjectAccess(asset.rows[0].project_id);

    const result = await query(
      `UPDATE slate_assets SET deleted_at = NOW() WHERE id = $1`,
      [assetId]
    );

    if (result.rowCount > 0) {
      await invalidateCache(CacheKeys.projectAssets(asset.rows[0].project_id));

      await publish('slate.asset.deleted', {
        assetId,
        projectId: asset.rows[0].project_id,
        userId: auth.userId,
        timestamp: new Date().toISOString(),
      });
    }

    return result.rowCount > 0;
  }
}
