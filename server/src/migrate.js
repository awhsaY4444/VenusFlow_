import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  console.log("🚀 Starting database upgrade...");

  try {
    const migrationPath = path.join(__dirname, "migrations", "01_upgrade_production.sql");
    const sql = await fs.readFile(migrationPath, "utf-8");

    // Execute the migration script
    await pool.query(sql);

    console.log("✅ Database upgraded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed!");
    console.error(error);
    process.exit(1);
  }
}

runMigration();
