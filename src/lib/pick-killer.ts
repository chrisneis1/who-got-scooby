import { getDb, withTransaction, firstRowToPlain } from "./db";
import crypto from "crypto";

/**
 * Re-randomizes which character is the killer. NOT part of the normal setup
 * flow — the killer is now a fixed, deliberate choice (the GM needs to know
 * who it is to run the investigation, so it isn't hidden from the host the
 * way it's hidden from guests). Only run this if you actually want to
 * change who the killer is.
 *
 * Also clears the killer_confirmed flag, since the previous killer's
 * confirmation no longer applies.
 */
async function pickKiller() {
  const db = await getDb();

  await withTransaction(async (tx) => {
    const idsRs = await tx.execute(`SELECT id FROM characters WHERE is_gm = 0`);
    const ids = idsRs.rows.map((r) => Number(r.id));
    if (ids.length === 0) {
      throw new Error("No suspect characters in the roster — run `npm run db:seed` first.");
    }

    // crypto.randomInt is uniform and unpredictable, unlike Math.random().
    const chosen = ids[crypto.randomInt(ids.length)];

    await tx.execute(`UPDATE characters SET is_killer = 0`);
    await tx.execute({ sql: `UPDATE characters SET is_killer = 1 WHERE id = ?`, args: [chosen] });
    await tx.execute(`UPDATE event SET killer_confirmed = 0 WHERE id = 1`);
  });

  const rs = await db.execute(`SELECT name FROM characters WHERE is_killer = 1`);
  const row = firstRowToPlain<{ name: string }>(rs) as { name: string };
  console.log(`A new killer was selected at random: ${row.name}.`);
  console.log("killer_confirmed has been reset to No.");
}

pickKiller();
