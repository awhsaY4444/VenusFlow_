import { app } from "./app.js";
import { config } from "./config.js";
import { pool, query } from "./db.js";
import { schemaSql } from "./schema.js";

async function waitForDatabase(retries = 15, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }

      console.log(`Database not ready yet (attempt ${attempt}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

async function bootstrap() {
  await waitForDatabase();
  await query(schemaSql);

  // Force reset all themes to 'light' to ensure the user's preferred default
  console.log("Strictly enforcing Light mode default for all users...");
  await query("UPDATE users SET theme = 'light' WHERE theme IS NULL OR theme != 'light'");

  app.listen(config.port, () => {
    console.log(`VenusFlow API running on port ${config.port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  pool.end().finally(() => process.exit(1));
});
