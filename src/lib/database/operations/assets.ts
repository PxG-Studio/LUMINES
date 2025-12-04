import { supabase } from '../client';
import type {
  SlateAsset,
  SlateAssetInsert,
  SlateAssetUpdate,
  SlateAssetComponent,
  SlateAssetComponentInsert,
  SlateAssetDependency,
  SlateAssetDependencyInsert,
} from '../types';

export async function createAsset(asset: SlateAssetInsert): Promise<SlateAsset> {
  const { data, error } = await supabase
    .from('slate_assets')
    .insert(asset)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAsset(assetId: string): Promise<SlateAsset | null> {
  const { data, error } = await supabase
    .from('slate_assets')
    .select('*')
    .eq('id', assetId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listAssets(projectId: string): Promise<SlateAsset[]> {
  const { data, error } = await supabase
    .from('slate_assets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateAsset(
  assetId: string,
  updates: SlateAssetUpdate
): Promise<SlateAsset> {
  const { data, error } = await supabase
    .from('slate_assets')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', assetId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAsset(assetId: string): Promise<void> {
  const { error } = await supabase
    .from('slate_assets')
    .delete()
    .eq('id', assetId);

  if (error) throw error;
}

export async function createAssetComponent(
  component: SlateAssetComponentInsert
): Promise<SlateAssetComponent> {
  const { data, error } = await supabase
    .from('slate_asset_components')
    .insert(component)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listAssetComponents(
  assetId: string
): Promise<SlateAssetComponent[]> {
  const { data, error } = await supabase
    .from('slate_asset_components')
    .select('*')
    .eq('asset_id', assetId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateAssetComponent(
  componentId: string,
  properties: any
): Promise<SlateAssetComponent> {
  const { data, error } = await supabase
    .from('slate_asset_components')
    .update({ properties })
    .eq('id', componentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAssetComponent(componentId: string): Promise<void> {
  const { error } = await supabase
    .from('slate_asset_components')
    .delete()
    .eq('id', componentId);

  if (error) throw error;
}

export async function createAssetDependency(
  dependency: SlateAssetDependencyInsert
): Promise<SlateAssetDependency> {
  const { data, error } = await supabase
    .from('slate_asset_dependencies')
    .insert(dependency)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listAssetDependencies(
  assetId: string
): Promise<SlateAssetDependency[]> {
  const { data, error } = await supabase
    .from('slate_asset_dependencies')
    .select('*')
    .eq('asset_id', assetId);

  if (error) throw error;
  return data || [];
}

export async function deleteAssetDependency(dependencyId: string): Promise<void> {
  const { error } = await supabase
    .from('slate_asset_dependencies')
    .delete()
    .eq('id', dependencyId);

  if (error) throw error;
}

export interface AssetWithComponents extends SlateAsset {
  components: SlateAssetComponent[];
  dependencies: SlateAssetDependency[];
}

export async function getAssetWithComponents(
  assetId: string
): Promise<AssetWithComponents | null> {
  const asset = await getAsset(assetId);
  if (!asset) return null;

  const [components, dependencies] = await Promise.all([
    listAssetComponents(assetId),
    listAssetDependencies(assetId),
  ]);

  return {
    ...asset,
    components,
    dependencies,
  };
}
