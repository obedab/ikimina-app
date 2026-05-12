import { runQuery } from '../config/db';

export async function up() {
  await runQuery(`
    ALTER TABLE contributions
    ADD COLUMN original_amount DECIMAL(12,2),
    ADD COLUMN original_currency VARCHAR(10);
  `);
}

export async function down() {
  await runQuery(`
    ALTER TABLE contributions
    DROP COLUMN original_amount,
    DROP COLUMN original_currency;
  `);
}
