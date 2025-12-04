import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../database/client';

export function useSupabaseRealtimeSync(userId: string, projectId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channels: ReturnType<typeof supabase.channel>[] = [];

    const projectsChannel = supabase
      .channel('slate_projects_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'slate_projects',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['projects', userId] });

          if (payload.eventType === 'UPDATE' && payload.new.id) {
            queryClient.invalidateQueries({ queryKey: ['project', payload.new.id] });
          }
        }
      )
      .subscribe();

    channels.push(projectsChannel);

    if (projectId) {
      const filesChannel = supabase
        .channel('slate_files_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'slate_files',
            filter: `project_id=eq.${projectId}`,
          },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: ['files', projectId] });

            if (payload.eventType === 'UPDATE' && payload.new.id) {
              queryClient.invalidateQueries({ queryKey: ['file', payload.new.id] });
            }
          }
        )
        .subscribe();

      channels.push(filesChannel);

      const assetsChannel = supabase
        .channel('slate_assets_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'slate_assets',
            filter: `project_id=eq.${projectId}`,
          },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: ['assets', projectId] });

            if (payload.eventType === 'UPDATE' && payload.new.id) {
              queryClient.invalidateQueries({ queryKey: ['asset', payload.new.id] });
            }
          }
        )
        .subscribe();

      channels.push(assetsChannel);

      const componentsChannel = supabase
        .channel('slate_asset_components_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'slate_asset_components',
          },
          (payload) => {
            if (payload.new?.asset_id) {
              queryClient.invalidateQueries({ queryKey: ['asset', payload.new.asset_id] });
            }
            if (payload.old?.asset_id) {
              queryClient.invalidateQueries({ queryKey: ['asset', payload.old.asset_id] });
            }
          }
        )
        .subscribe();

      channels.push(componentsChannel);
    }

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [queryClient, userId, projectId]);
}
