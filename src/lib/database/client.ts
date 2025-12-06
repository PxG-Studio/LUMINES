import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.'
      );
    }

    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  const client = getSupabaseClient();
  const start = Date.now();

  try {
    const { data, error } = await client.rpc('execute_sql', {
      query: text,
      params: params || [],
    });

    if (error) throw error;

    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
    }

    return {
      rows: data as T[],
      rowCount: Array.isArray(data) ? data.length : 0,
    };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryReplica<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  return query<T>(text, params);
}

export async function transaction<T>(
  callback: (client: SupabaseClient) => Promise<T>
): Promise<T> {
  const client = getSupabaseClient();
  return callback(client);
}

export async function closeConnections(): Promise<void> {
  supabaseClient = null;
}

export { supabaseClient };
