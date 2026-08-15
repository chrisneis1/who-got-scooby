import { createClient } from "@libsql/client";
import path from "path";
import { initSchema, runMigrations } from "./db";

/**
 * One-time copy of the local SQLite database (guests, characters, event —
 * including any real signups and the current killer/GM setup) into a fresh
 * Turso database. Run this once, after creating the Turso database and
 * before pointing the deployed app at it.
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the environment, e.g.:
 *   $env:TURSO_DATABASE_URL="libsql://..."; $env:TURSO_AUTH_TOKEN="..."; npm run db:migrate-to-turso
 */
async function migrate() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!tursoUrl || !authToken) {
    throw new Error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the environment before running this.");
  }

  const localPath = process.env.DATABASE_PATH || path.join(process.cwd(), "mystery.db");
  const local = createClient({ url: `file:${localPath}` });
  const remote = createClient({ url: tursoUrl, authToken });

  await initSchema(remote);
  await runMigrations(remote);

  for (const table of ["characters", "guests", "event"] as const) {
    const rs = await local.execute(`SELECT * FROM ${table}`);
    if (rs.rows.length === 0) {
      console.log(`${table}: nothing to copy.`);
      continue;
    }
    const columns = rs.columns;
    const placeholders = columns.map(() => "?").join(", ");
    const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`;
    for (const row of rs.rows) {
      const values = columns.map((_, i) => row[i]);
      await remote.execute({ sql, args: values });
    }
    console.log(`${table}: copied ${rs.rows.length} row(s).`);
  }

  console.log("Done. The Turso database now matches your local data.");
}

migrate();
