import { supabase } from '../client';
import type { SlateProject, SlateProjectInsert, SlateProjectUpdate } from '../types';

export async function createProject(project: SlateProjectInsert): Promise<SlateProject> {
  const { data, error } = await supabase
    .from('slate_projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProject(projectId: string): Promise<SlateProject | null> {
  const { data, error } = await supabase
    .from('slate_projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listProjects(userId: string): Promise<SlateProject[]> {
  const { data, error } = await supabase
    .from('slate_projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateProject(
  projectId: string,
  updates: SlateProjectUpdate
): Promise<SlateProject> {
  const { data, error } = await supabase
    .from('slate_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(projectId: string): Promise<void> {
  const { error } = await supabase
    .from('slate_projects')
    .delete()
    .eq('id', projectId);

  if (error) throw error;
}
