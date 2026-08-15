import { getDb, withTransaction, firstRowToPlain } from "./db";
import { ROSTER_CONTENT } from "./roster-content";

/**
 * Applies the party-specific roster content, trims the roster to the
 * playable characters, and sets the event details.
 *
 * Safe to re-run: it overwrites content in place and never touches
 * is_killer, so re-running will not reshuffle who the killer is.
 */
async function seedContent() {
  const db = await getDb();

  await withTransaction(async (tx) => {
    // --- Trim the roster to the characters we're actually playing ---
    // GM rows (is_gm = 1, e.g. Vincent Van Ghoul) are never in ROSTER_CONTENT
    // by design — they're not a suspect — so they must be skipped here too,
    // or this trim step deletes the GM on every re-run.
    const keepNames = new Set(ROSTER_CONTENT.map((c) => c.name));
    const existingRs = await tx.execute(`SELECT id, name, is_gm FROM characters`);
    const existing = existingRs.rows.map((r) => ({
      id: Number(r.id),
      name: String(r.name),
      is_gm: Number(r.is_gm),
    }));

    for (const row of existing) {
      if (row.is_gm === 1) continue;
      if (keepNames.has(row.name)) continue;
      const assignedRs = await tx.execute({
        sql: `SELECT COUNT(*) as c FROM guests WHERE assigned_character_id = ?`,
        args: [row.id],
      });
      const assigned = firstRowToPlain<{ c: number }>(assignedRs) as { c: number };
      if (assigned.c > 0) {
        console.log(`Skipping removal of "${row.name}" — still assigned to a guest.`);
        continue;
      }
      await tx.execute({ sql: `DELETE FROM characters WHERE id = ?`, args: [row.id] });
      console.log(`Removed "${row.name}" from the roster.`);
    }

    // --- Apply content ---
    let updated = 0;
    for (const c of ROSTER_CONTENT) {
      const result = await tx.execute({
        sql: `UPDATE characters
              SET bio = ?, relationship_to_scooby = ?, alibi = ?, secret = ?,
                  real_motive = ?, gender = ?
              WHERE name = ?`,
        args: [c.bio, c.relationship_to_scooby, c.alibi, c.secret, c.real_motive, c.gender, c.name],
      });
      if (result.rowsAffected > 0) updated++;
      else console.log(`WARNING: no character row found named "${c.name}"`);
    }
    console.log(`Content written for ${updated} of ${ROSTER_CONTENT.length} characters.`);

    // --- Event details ---
    await tx.execute({
      sql: `UPDATE event SET date = ?, time = ?, location = ?, premise_blurb = ? WHERE id = 1`,
      args: [
        "Friday, September 4, 2026",
        "Dinner — 6:00 PM",
        "Tahoe Mountain Retreat · 436 Barrett Dr, Stateline, NV",
        "Ten friends drove up to a cabin in Tahoe for a long weekend. Thursday was the beach and the casinos. Friday was the hike. Friday evening, somewhere between the showers and the garlic bread, Scooby-Doo was killed inside this house. Nobody left. Nobody came in. Every single person here has a story about where they were — and one of those stories is a lie.",
      ],
    });
    console.log("Event details updated.");
  });

  const totalRs = await db.execute(`SELECT COUNT(*) as c FROM characters`);
  const total = firstRowToPlain<{ c: number }>(totalRs) as { c: number };
  console.log(`Roster now has ${total.c} characters.`);
  console.log("Done.");
}

seedContent();
