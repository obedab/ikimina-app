import { Pool, QueryArrayConfig } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

/**
 * Test database connection on startup
 */
const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    console.log('✅ PostgreSQL connected');
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

const runQuery = async (query: QueryArrayConfig<string>, params: string[]) => {
  return pool.query(query, params);
};
export { pool, connectDB, runQuery };
