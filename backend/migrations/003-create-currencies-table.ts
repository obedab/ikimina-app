import { runQuery } from '../config/db';

export async function up() {
  await runQuery(`
    CREATE TABLE currencies (
      id SERIAL PRIMARY KEY,
      code VARCHAR(10) UNIQUE NOT NULL,
      name VARCHAR(50) NOT NULL,
      symbol VARCHAR(10),
      is_base BOOLEAN DEFAULT FALSE,
      exchange_rate numeric(12,3) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX one_base_currency
    ON currencies (is_base)
    WHERE is_base = true;
  `);
}

export async function down() {
  await runQuery(`DROP TABLE IF EXISTS currencies`);
}
