import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ikiminadb',
  password: 'obed2002',
  port: 5432,
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

export { pool, connectDB };
