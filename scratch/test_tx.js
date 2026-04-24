import { withTransaction, pool } from "../server/src/db.js";

async function test() {
  try {
    await withTransaction(async (client) => {
      await client.query("INSERT INTO users (organization_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)", 
        ['42b8b7bd-381a-4138-b7f2-361093b7c939', 'Transaction Test', 'tx_test@example.com', 'hash', 'member']);
      
      console.log("Inserted user, now throwing error...");
      throw new Error("Simulated failure");
    });
  } catch (e) {
    console.log("Caught expected error:", e.message);
  }

  const r = await pool.query("SELECT * FROM users WHERE email = $1", ['tx_test@example.com']);
  if (r.rows.length > 0) {
    console.error("FAIL: User was NOT rolled back!");
  } else {
    console.log("SUCCESS: User was rolled back.");
  }
  
  await pool.end();
}

test();
