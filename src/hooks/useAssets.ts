import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  SlateAsset,
  SlateAssetInsert,
  SlateAssetUpdate,
  SlateAssetComponentInsert,
} from '../lib/database/types';
import * as assetOps from '../lib/database/operations/assets';
import type { AssetWithComponents } from '../lib/database/operations/assets';

export function useAssets(projectId: string | null) {
  const queryClient = useQueryClient();

  const { data: assets = [], isLoading: loading, error } = useQuery({
    queryKey: ['assets', projectId],
    queryFn: () => assetOps.listAssets(projectId!),
    enabled: !!projectId,
  });

  const createAssetMutation = useMutation({
    mutationFn: (asset: SlateAssetInsert) => assetOps.createAsset(asset),
    onMutate: async (newAsset) => {
      await queryClient.cancelQueries({ queryKey: ['assets', projectId] });
      const previousAssets = queryClient.getQueryData<SlateAsset[]>(['assets', projectId]);

      queryClient.setQueryData<SlateAsset[]>(['assets', projectId], (old = []) => [
        { ...newAsset, id: 'temp-' + Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as SlateAsset,
        ...old,
      ]);

      return { previousAssets };
    },
    onError: (err, newAsset, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(['assets', projectId], context.previousAssets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', projectId] });
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: ({ assetId, updates }: { assetId: string; updates: SlateAssetUpdate }) =>
      assetOps.updateAsset(assetId, updates),
    onMutate: async ({ assetId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['assets', projectId] });
      const previousAssets = queryClient.getQueryData<SlateAsset[]>(['assets', projectId]);

      queryClient.setQueryData<SlateAsset[]>(['assets', projectId], (old = []) =>
        old.map((a) => (a.id === assetId ? { ...a, ...updates, updated_at: new Date().toISOString() } : a))
      );

      return { previousAssets };
    },
    onError: (err, variables, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(['assets', projectId], context.previousAssets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', projectId] });
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (assetId: string) => assetOps.deleteAsset(assetId),
    onMutate: async (assetId) => {
      await queryClient.cancelQueries({ queryKey: ['assets', projectId] });
      const previousAssets = queryClient.getQueryData<SlateAsset[]>(['assets', projectId]);

      queryClient.setQueryData<SlateAsset[]>(['assets', projectId], (old = []) =>
        old.filter((a) => a.id !== assetId)
      );

      return { previousAssets };
    },
    onError: (err, assetId, context) => {
      if (context?.previousAssets) {
        queryClient.setQueryData(['assets', projectId], context.previousAssets);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assets', projectId] });
    },
  });

  return {
    assets,
    loading,
    error: error as Error | null,
    createAsset: createAssetMutation.mutateAsync,
    updateAsset: (assetId: string, updates: SlateAssetUpdate) =>
      updateAssetMutation.mutateAsync({ assetId, updates }),
    deleteAsset: deleteAssetMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['assets', projectId] }),
  };
}

export function useAsset(assetId: string | null) {
  const queryClient = useQueryClient();

  const { data: asset = null, isLoading: loading, error } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: () => assetOps.getAssetWithComponents(assetId!),
    enabled: !!assetId,
  });

  const createComponentMutation = useMutation({
    mutationFn: (component: SlateAssetComponentInsert) => assetOps.createAssetComponent(component),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
    },
  });

  const updateComponentMutation = useMutation({
    mutationFn: ({ componentId, properties }: { componentId: string; properties: any }) =>
      assetOps.updateAssetComponent(componentId, properties),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
    },
  });

  const deleteComponentMutation = useMutation({
    mutationFn: (componentId: string) => assetOps.deleteAssetComponent(componentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', assetId] });
    },
  });

  return {
    asset,
    loading,
    error: error as Error | null,
    createComponent: createComponentMutation.mutateAsync,
    updateComponent: (componentId: string, properties: any) =>
      updateComponentMutation.mutateAsync({ componentId, properties }),
    deleteComponent: deleteComponentMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['asset', assetId] }),
  };
}
