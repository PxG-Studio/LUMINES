import { useState, useEffect, useCallback } from 'react';
import type {
  SlateAsset,
  SlateAssetInsert,
  SlateAssetUpdate,
  SlateAssetComponentInsert,
} from '../lib/database/types';
import { apiClient } from '../lib/api/client';
import type { AssetWithComponents } from '../lib/database/operations/assets';

export function useAssets(projectId: string | null) {
  const [assets, setAssets] = useState<SlateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssets = useCallback(async () => {
    if (!projectId) {
      setAssets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<SlateAsset[]>(`/assets?projectId=${projectId}`);
      setAssets(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const createAsset = async (asset: SlateAssetInsert): Promise<SlateAsset> => {
    const newAsset = await apiClient.post<SlateAsset>('/assets', asset);
    setAssets((prev) => [newAsset, ...prev]);
    return newAsset;
  };

  const updateAsset = async (assetId: string, updates: SlateAssetUpdate): Promise<SlateAsset> => {
    const updatedAsset = await apiClient.put<SlateAsset>(`/assets/${assetId}`, updates);
    setAssets((prev) => prev.map((a) => (a.id === assetId ? updatedAsset : a)));
    return updatedAsset;
  };

  const deleteAsset = async (assetId: string): Promise<void> => {
    await apiClient.delete(`/assets/${assetId}`);
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  return {
    assets,
    loading,
    error,
    createAsset,
    updateAsset,
    deleteAsset,
    refresh: fetchAssets,
  };
}

export function useAsset(assetId: string | null) {
  const [asset, setAsset] = useState<AssetWithComponents | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAsset = useCallback(async () => {
    if (!assetId) {
      setAsset(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<AssetWithComponents>(`/assets/${assetId}`);
      setAsset(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  const createComponent = async (component: SlateAssetComponentInsert) => {
    const newComponent = await apiClient.post(`/assets/${assetId}/components`, component);
    await fetchAsset();
    return newComponent;
  };

  const updateComponent = async (componentId: string, properties: any) => {
    const updatedComponent = await apiClient.put(`/assets/${assetId}/components/${componentId}`, { properties });
    await fetchAsset();
    return updatedComponent;
  };

  const deleteComponent = async (componentId: string) => {
    await apiClient.delete(`/assets/${assetId}/components/${componentId}`);
    await fetchAsset();
  };

  return {
    asset,
    loading,
    error,
    createComponent,
    updateComponent,
    deleteComponent,
    refresh: fetchAsset,
  };
}
