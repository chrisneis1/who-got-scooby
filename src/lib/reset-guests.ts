import { getDb, withTransaction, firstRowToPlain } from "./db";

/**
 * Full reset before a real event: clears every guest signup (including any
 * that were used for testing) and every message, frees all characters back
 * to unclaimed, and resets killer_confirmed to No.
 *
 * Deliberately does NOT touch character content (bio/alibi/secret/motive/
 * portraits) or is_killer — the roster content and killer selection are
 * final, documented decisions, not test data.
 */
async function resetGuests() {
  const db = await getDb();

  await withTransaction(async (tx) => {
    // Messages reference guests via a foreign key, so they have to go first.
    await tx.execute(`DELETE FROM messages`);
    await tx.execute(`DELETE FROM guests`);
    await tx.execute(`UPDATE characters SET taken = 0`);
    await tx.execute(`UPDATE event SET killer_confirmed = 0 WHERE id = 1`);
  });

  const guestsRs = await db.execute(`SELECT COUNT(*) c FROM guests`);
  const messagesRs = await db.execute(`SELECT COUNT(*) c FROM messages`);
  const claimedRs = await db.execute(`SELECT COUNT(*) c FROM characters WHERE taken = 1`);
  const killerRs = await db.execute(`SELECT name FROM characters WHERE is_killer = 1`);

  const guests = firstRowToPlain<{ c: number }>(guestsRs) as { c: number };
  const messages = firstRowToPlain<{ c: number }>(messagesRs) as { c: number };
  const claimed = firstRowToPlain<{ c: number }>(claimedRs) as { c: number };
  const killer = firstRowToPlain<{ name: string }>(killerRs);

  console.log(`Guests remaining: ${guests.c}`);
  console.log(`Messages remaining: ${messages.c}`);
  console.log(`Characters still claimed: ${claimed.c}`);
  console.log(`Killer is still set: ${killer ? "yes" : "no"} (identity intentionally not logged)`);
  console.log("Ready for go-live.");
}

resetGuests();
