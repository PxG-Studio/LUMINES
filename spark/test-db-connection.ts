import { query } from './lib/database/client';

async function testConnection() {
  try {
    const result = await query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful!');
    console.log('Current time:', result.rows[0].current_time);

    const tables = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('spark_user_preferences', 'spark_generation_history')
    `);
    console.log('✅ SPARK tables found:', tables.rows.map(r => r.table_name));

    const functions = await query(`
      SELECT routine_name
      FROM information_schema.routines
      WHERE routine_schema = 'public'
      AND routine_name IN ('get_or_create_spark_preferences', 'get_user_generation_stats')
    `);
    console.log('✅ SPARK functions found:', functions.rows.map(r => r.routine_name));

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
