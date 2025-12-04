import { useState, useEffect, useCallback } from 'react';
import type {
  SlateAsset,
  SlateAssetInsert,
  SlateAssetUpdate,
  SlateAssetComponentInsert,
} from '../lib/database/types';
import * as assetOps from '../lib/database/operations/assets';
import type { AssetWithComponents } from '../lib/database/operations/assets';

export function useAssets(projectId: string | null) {
  const [assets, setAssets] = useState<SlateAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAssets = useCallback(async () => {
    if (!projectId) {
      setAssets([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await assetOps.listAssets(projectId);
      setAssets(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const createAsset = useCallback(
    async (asset: SlateAssetInsert): Promise<SlateAsset> => {
      const newAsset = await assetOps.createAsset(asset);
      setAssets((prev) => [newAsset, ...prev]);
      return newAsset;
    },
    []
  );

  const updateAsset = useCallback(
    async (assetId: string, updates: SlateAssetUpdate): Promise<SlateAsset> => {
      const updated = await assetOps.updateAsset(assetId, updates);
      setAssets((prev) =>
        prev.map((a) => (a.id === assetId ? updated : a))
      );
      return updated;
    },
    []
  );

  const deleteAsset = useCallback(async (assetId: string): Promise<void> => {
    await assetOps.deleteAsset(assetId);
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  }, []);

  return {
    assets,
    loading,
    error,
    createAsset,
    updateAsset,
    deleteAsset,
    refresh: loadAssets,
  };
}

export function useAsset(assetId: string | null) {
  const [asset, setAsset] = useState<AssetWithComponents | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadAsset = useCallback(async () => {
    if (!assetId) {
      setAsset(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await assetOps.getAssetWithComponents(assetId);
      setAsset(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    loadAsset();
  }, [loadAsset]);

  const createComponent = useCallback(
    async (component: SlateAssetComponentInsert) => {
      if (!assetId) return;
      await assetOps.createAssetComponent(component);
      await loadAsset();
    },
    [assetId, loadAsset]
  );

  const updateComponent = useCallback(
    async (componentId: string, properties: any) => {
      await assetOps.updateAssetComponent(componentId, properties);
      await loadAsset();
    },
    [loadAsset]
  );

  const deleteComponent = useCallback(
    async (componentId: string) => {
      await assetOps.deleteAssetComponent(componentId);
      await loadAsset();
    },
    [loadAsset]
  );

  return {
    asset,
    loading,
    error,
    createComponent,
    updateComponent,
    deleteComponent,
    refresh: loadAsset,
  };
}
