const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  try {
    const response = await fetch(`${API_BASE}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, params, useReplica: false }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Query failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryReplica<T = any>(
  text: string,
  params?: any[]
): Promise<{ rows: T[]; rowCount: number }> {
  try {
    const response = await fetch(`${API_BASE}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, params, useReplica: true }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Query failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Replica query error, falling back to primary:', error);
    return query<T>(text, params);
  }
}

export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  throw new Error('Transaction callback pattern not supported with API client. Use transactionQueries instead.');
}

export async function transactionQueries(
  queries: Array<{ text: string; params?: any[] }>
): Promise<Array<{ rows: any[]; rowCount: number }>> {
  try {
    const response = await fetch(`${API_BASE}/api/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ queries }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Transaction failed');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

export async function closeConnections(): Promise<void> {
  // No-op for API client
}
