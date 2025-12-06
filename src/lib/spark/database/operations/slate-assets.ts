import { query } from '../client';

export interface SlateAsset {
  id: string;
  project_id: string;
  name: string;
  type: string;
  metadata: Record<string, any>;
  file_path?: string | null;
  registry_path?: string | null;
  guid?: string | null;
  file_id?: number | null;
  size: number;
  mime_type?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SlateAssetInsert {
  project_id: string;
  name: string;
  type: string;
  metadata?: Record<string, any>;
  file_path?: string | null;
  registry_path?: string | null;
  guid?: string | null;
  file_id?: number | null;
  size?: number;
  mime_type?: string | null;
}

export interface SlateAssetUpdate {
  name?: string;
  type?: string;
  metadata?: Record<string, any>;
  file_path?: string | null;
  registry_path?: string | null;
}

export interface SlateAssetComponent {
  id: string;
  asset_id: string;
  component_type: string;
  component_name?: string | null;
  properties: Record<string, any>;
  editable: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SlateAssetComponentInsert {
  asset_id: string;
  component_type: string;
  component_name?: string | null;
  properties?: Record<string, any>;
  editable?: boolean;
  order_index?: number;
}

export async function createAsset(asset: SlateAssetInsert): Promise<SlateAsset> {
  const result = await query<SlateAsset>(
    `INSERT INTO slate_assets (project_id, name, type, metadata, file_path, registry_path, guid, file_id, size, mime_type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      asset.project_id,
      asset.name,
      asset.type,
      JSON.stringify(asset.metadata || {}),
      asset.file_path || null,
      asset.registry_path || null,
      asset.guid || null,
      asset.file_id || null,
      asset.size || 0,
      asset.mime_type || null,
    ]
  );

  return result.rows[0];
}

export async function getAsset(assetId: string): Promise<SlateAsset | null> {
  const result = await query<SlateAsset>(
    `SELECT * FROM slate_assets WHERE id = $1 AND deleted_at IS NULL`,
    [assetId]
  );

  return result.rows[0] || null;
}

export async function listAssets(projectId: string): Promise<SlateAsset[]> {
  const result = await query<SlateAsset>(
    `SELECT * FROM slate_assets
     WHERE project_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
}

export async function updateAsset(
  assetId: string,
  updates: SlateAssetUpdate
): Promise<SlateAsset> {
  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    updateFields.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.type !== undefined) {
    updateFields.push(`type = $${paramIndex++}`);
    values.push(updates.type);
  }
  if (updates.metadata !== undefined) {
    updateFields.push(`metadata = $${paramIndex++}`);
    values.push(JSON.stringify(updates.metadata));
  }
  if (updates.file_path !== undefined) {
    updateFields.push(`file_path = $${paramIndex++}`);
    values.push(updates.file_path);
  }
  if (updates.registry_path !== undefined) {
    updateFields.push(`registry_path = $${paramIndex++}`);
    values.push(updates.registry_path);
  }

  if (updateFields.length === 0) {
    const asset = await getAsset(assetId);
    if (!asset) throw new Error('Asset not found');
    return asset;
  }

  values.push(assetId);
  const result = await query<SlateAsset>(
    `UPDATE slate_assets
     SET ${updateFields.join(', ')}
     WHERE id = $${paramIndex} AND deleted_at IS NULL
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new Error('Asset not found');
  }

  return result.rows[0];
}

export async function deleteAsset(assetId: string): Promise<void> {
  await query(
    `UPDATE slate_assets SET deleted_at = NOW() WHERE id = $1`,
    [assetId]
  );
}

export async function createAssetComponent(
  component: SlateAssetComponentInsert
): Promise<SlateAssetComponent> {
  const result = await query<SlateAssetComponent>(
    `INSERT INTO slate_asset_components (asset_id, component_type, component_name, properties, editable, order_index)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      component.asset_id,
      component.component_type,
      component.component_name || null,
      JSON.stringify(component.properties || {}),
      component.editable ?? true,
      component.order_index || 0,
    ]
  );

  return result.rows[0];
}

export async function listAssetComponents(
  assetId: string
): Promise<SlateAssetComponent[]> {
  const result = await query<SlateAssetComponent>(
    `SELECT * FROM slate_asset_components
     WHERE asset_id = $1
     ORDER BY order_index ASC`,
    [assetId]
  );

  return result.rows;
}

export async function updateAssetComponent(
  componentId: string,
  properties: any
): Promise<SlateAssetComponent> {
  const result = await query<SlateAssetComponent>(
    `UPDATE slate_asset_components
     SET properties = $1
     WHERE id = $2
     RETURNING *`,
    [JSON.stringify(properties), componentId]
  );

  if (result.rows.length === 0) {
    throw new Error('Component not found');
  }

  return result.rows[0];
}

export async function deleteAssetComponent(componentId: string): Promise<void> {
  await query(
    `DELETE FROM slate_asset_components WHERE id = $1`,
    [componentId]
  );
}

