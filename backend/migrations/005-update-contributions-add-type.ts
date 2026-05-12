import { runQuery } from '../config/db';

export async function up() {
  await runQuery(`
    ALTER TABLE contributions
    ADD COLUMN type VARCHAR(50);
  `);
}

export async function down() {
  await runQuery(`
    ALTER TABLE contributions
    DROP COLUMN type;
  `);
}
