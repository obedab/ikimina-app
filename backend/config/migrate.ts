import { runQuery, pool } from './db';
import fs from 'fs';
import path from 'path';

interface Migration {
  up(): Promise<void>;
  down(): Promise<void>;
}

interface MigrationSchema {
  id: number;
  name: string;
  executed_at: string;
}

async function createMigrationTable() {
  await runQuery(`
      CREATE TABLE IF NOT EXISTS migrations(
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
        )
      `);
}

async function getMigrated(): Promise<string[]> {
  const result = await runQuery(`
      SELECT * from migrations
      `);
  return result.rows.map((r: MigrationSchema) => r.name);
}

function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.ts'))
    .sort();
  return { migrationsDir, files };
}

async function runUp() {
  const migratedFiles = await getMigrated();
  const { files } = getMigrationFiles();

  for (const file of files) {
    const currentFile = migratedFiles.find((f) => f === file);
    if (currentFile) {
      continue;
    }
    const migration = (await import(`../migrations/${file}`)) as Migration;

    console.log('Running:', file);
    await migration.up();

    await runQuery('INSERT INTO migrations(name) VALUES($1)', [file]);
  }
}

async function runDown() {
  const migratedFiles = await getMigrated();
  const { files } = getMigrationFiles();

  const reversed = [...files].reverse();

  for (const file of reversed) {
    if (!migratedFiles.includes(file)) continue;

    try {
      const migration = (await import(`../migrations/${file}`)) as Migration;

      console.log('Rollback:', file);

      await migration.down();

      await runQuery('DELETE FROM migrations WHERE name = $1', [file]);
    } catch (error) {
      console.error(`error to ${file}:`, error);
      throw error;
    }
  }
}

async function runMigrations(direction: 'up' | 'down') {
  const client = await pool.connect();
  try {
    await createMigrationTable();
    await runQuery('BEGIN');

    if (direction === 'up') {
      await runUp();
    } else {
      await runDown();
    }
    await runQuery('COMMIT');
  } catch (error) {
    await runQuery('ROLLBACK');
    console.error('Migration error:', error);
  } finally {
    client.release();
  }
}
const direction = process.argv[2] as 'up' | 'down';
if (!direction || !['up', 'down'].includes(direction)) {
  console.log('Usage: yarn migrate up | down');
  process.exit(1);
}
void runMigrations(direction);
