import { runQuery } from '../config/db';

export async function up() {
  await runQuery(`
    CREATE TABLE contributions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount DECIMAL(12,2) NOT NULL,
      currency VARCHAR(3) NOT NULL DEFAULT 'RWF',
      description TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function down() {
  await runQuery(`DROP TABLE IF EXISTS contributions`);
}
