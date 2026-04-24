import pg from "pg";
import { config } from "./config.js";
import { AsyncLocalStorage } from "node:async_hooks";

const { Pool } = pg;

const dbUrl = config.databaseUrl;
const isLocalhost = 
  dbUrl.includes("localhost") || 
  dbUrl.includes("127.0.0.1") || 
  dbUrl.includes("::1") ||
  process.env.DB_SSL === "false";

const useSsl = process.env.DB_SSL === "true" || (!isLocalhost && process.env.DB_SSL !== "false");

console.log(`Connecting to database at ${dbUrl.split('@').pop()} (SSL: ${useSsl ? 'Enabled' : 'Disabled'})`);

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: useSsl ? { rejectUnauthorized: false } : false,
});

export const tenantStorage = new AsyncLocalStorage();

/**
 * Returns the current tenant (organization_id) from context.
 */
export function getTenantId() {
  const store = tenantStorage.getStore();
  return store?.organizationId;
}

/**
 * Basic query wrapper
 */
export async function query(text, params = []) {
  const result = await pool.query(text, params);
  return result;
}

/**
 * tenantQuery automatically injects organization_id if available in context.
 * Can be used with pool or a specific client (for transactions).
 */
export async function tenantQuery(maybeClient, text, params) {
  let client = maybeClient;
  let queryText = text;
  let queryParams = params;

  // Handle optional client argument
  if (typeof maybeClient === "string") {
    queryParams = text || [];
    queryText = maybeClient;
    client = pool;
  }

  const orgId = getTenantId();
  
  if (!orgId) {
    return client.query(queryText, queryParams);
  }

  let safeText = queryText;
  const safeParams = [...queryParams];

  const upperText = queryText.trim().toUpperCase();
  if (upperText.startsWith("SELECT") && !upperText.includes("FROM ORGANIZATIONS")) {
    const whereIndex = upperText.indexOf("WHERE");
    const orderIndex = upperText.indexOf("ORDER BY");
    const limitIndex = upperText.indexOf("LIMIT");
    
    let insertIndex = queryText.length;
    if (orderIndex !== -1) insertIndex = orderIndex;
    if (limitIndex !== -1 && limitIndex < insertIndex) insertIndex = limitIndex;

    // Point 1: Better alias detection to avoid "ambiguous column" errors during JOINs
    const fromMatch = queryText.match(/FROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?/i);
    const tableAlias = fromMatch ? fromMatch[2] : null;
    const columnPrefix = tableAlias ? `${tableAlias}.` : "";


    const filter = ` ${columnPrefix}organization_id = $${safeParams.length + 1} `;
    
    if (whereIndex !== -1) {
      safeText = queryText.replace(/WHERE/i, `WHERE ${filter} AND `);
    } else {
      const before = queryText.substring(0, insertIndex);
      const after = queryText.substring(insertIndex);
      safeText = `${before} WHERE ${filter} ${after}`;
    }
    
    safeParams.push(orgId);

  }

  return client.query(safeText, safeParams);
}


export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

