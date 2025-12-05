import { db } from '../client';

export interface SparkPreferences {
  id: string;
  user_id: string;
  ai_provider: 'claude' | 'openai';
  claude_model: string;
  openai_model: string;
  created_at: Date;
  updated_at: Date;
}

export interface GenerationHistory {
  id: string;
  user_id: string;
  provider: 'claude' | 'openai';
  model: string;
  prompt: string;
  generated_code: string | null;
  script_name: string | null;
  success: boolean;
  error_message: string | null;
  tokens_used: number;
  generation_time_ms: number;
  created_at: Date;
}

export interface GenerationStats {
  total_generations: number;
  successful_generations: number;
  failed_generations: number;
  claude_generations: number;
  openai_generations: number;
  total_tokens_used: number;
  avg_generation_time_ms: number;
}

/**
 * Get user SPARK preferences (creates default if not exists)
 */
export async function getUserPreferences(userId: string): Promise<SparkPreferences | null> {
  try {
    const result = await db.query<SparkPreferences>(
      'SELECT * FROM get_or_create_spark_preferences($1)',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
}

/**
 * Update user SPARK preferences
 */
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<Omit<SparkPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<SparkPreferences | null> {
  try {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (preferences.ai_provider !== undefined) {
      fields.push(`ai_provider = $${paramIndex++}`);
      values.push(preferences.ai_provider);
    }
    if (preferences.claude_model !== undefined) {
      fields.push(`claude_model = $${paramIndex++}`);
      values.push(preferences.claude_model);
    }
    if (preferences.openai_model !== undefined) {
      fields.push(`openai_model = $${paramIndex++}`);
      values.push(preferences.openai_model);
    }

    if (fields.length === 0) {
      return getUserPreferences(userId);
    }

    values.push(userId);

    const query = `
      UPDATE spark_user_preferences
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE user_id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query<SparkPreferences>(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
}

/**
 * Log a generation request to history
 */
export async function logGeneration(data: {
  userId: string;
  provider: 'claude' | 'openai';
  model: string;
  prompt: string;
  generatedCode?: string;
  scriptName?: string;
  success: boolean;
  errorMessage?: string;
  tokensUsed?: number;
  generationTimeMs?: number;
}): Promise<GenerationHistory | null> {
  try {
    const query = `
      INSERT INTO spark_generation_history (
        user_id, provider, model, prompt, generated_code, script_name,
        success, error_message, tokens_used, generation_time_ms
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const values = [
      data.userId,
      data.provider,
      data.model,
      data.prompt,
      data.generatedCode || null,
      data.scriptName || null,
      data.success,
      data.errorMessage || null,
      data.tokensUsed || 0,
      data.generationTimeMs || 0,
    ];

    const result = await db.query<GenerationHistory>(query, values);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error logging generation:', error);
    throw error;
  }
}

/**
 * Get user generation history
 */
export async function getGenerationHistory(
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<GenerationHistory[]> {
  try {
    const query = `
      SELECT * FROM spark_generation_history
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await db.query<GenerationHistory>(query, [userId, limit, offset]);
    return result.rows;
  } catch (error) {
    console.error('Error getting generation history:', error);
    throw error;
  }
}

/**
 * Get user generation statistics
 */
export async function getGenerationStats(
  userId: string,
  daysBack: number = 30
): Promise<GenerationStats | null> {
  try {
    const query = 'SELECT * FROM get_user_generation_stats($1, $2)';
    const result = await db.query<GenerationStats>(query, [userId, daysBack]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting generation stats:', error);
    throw error;
  }
}

/**
 * Delete old generation history
 */
export async function cleanupOldHistory(daysOld: number = 90): Promise<number> {
  try {
    const result = await db.query<{ cleanup_old_generation_history: number }>(
      'SELECT cleanup_old_generation_history($1)',
      [daysOld]
    );
    return result.rows[0]?.cleanup_old_generation_history || 0;
  } catch (error) {
    console.error('Error cleaning up old history:', error);
    throw error;
  }
}
