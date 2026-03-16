import { pool } from "./db";
import fs from "fs";
import path from "path";
import { PoolClient } from "pg";

interface Migration {
  up(client: PoolClient): Promise<void>;
  down(client: PoolClient): Promise<void>;
}

async  function runMigrations(direction: "up" | "down") {
  const  client =  await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations(
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
        )
      `)

      const migrationsDir = path.join(__dirname,"../migrations");
      const files = fs.readdirSync(migrationsDir).sort();

      for (const file of files) {
        const migrationName = file.replace(".ts", "");

        const result = await client.query(
          "SELECT *FROM migrations WHERE name = $1",
          [migrationName]
        );
        if (direction === "up") {
          if (result.rowCount === 0) {
            const migration = await import(`../migrations/${file}`) as Migration;

            console.log("Running:", migrationName);
            await migration.up(client);

            await client.query(
              "INSERT INTO migrations(name) VALUES($1)",
              [migrationName]
            );
          }
        }
        if (direction === "down"){
          if ( (result.rowCount ?? 0)=== 0){
            const migration = await import(`../migrations/${file}`) as Migration;
            console.log("Rollback:", migrationName);

            await migration.down(client);

            await client.query(
              "DELETE FROM migrations WHERE name=$1",
              [migrationName]
            );
          }
        }
      }
    
    } catch (error) {
      console.error("Migration error:", error);
    } finally {
      client.release();
    }
}

const direction = process.argv[2] as "up" |"down";

void runMigrations(direction);
