import { withTransaction, rowsToPlain, Character, Gender } from "./db";
import { TraitVector, characterVector, euclideanDistance } from "./traits";

/**
 * Finds the closest untaken character to a guest's trait vector, marks it
 * taken, and assigns it to the guest. Runs inside a transaction so two
 * simultaneous quiz submissions can't both claim the same character.
 *
 * When the guest picked a gender at signup, the pool is narrowed to
 * characters of that gender. If every matching character is already taken,
 * it falls back to the full untaken pool rather than failing — a guest
 * always gets a character.
 */
export async function assignCharacterToGuest(
  guestId: number,
  guestVector: TraitVector,
  genderPreference: Gender = "any"
): Promise<Character> {
  return withTransaction(async (tx) => {
    const rs = await tx.execute(`SELECT * FROM characters WHERE taken = 0 AND is_gm = 0`);
    const allUntaken = rowsToPlain<Character>(rs);

    if (allUntaken.length === 0) {
      throw new Error("No untaken characters remain.");
    }

    const genderMatched =
      genderPreference === "any"
        ? allUntaken
        : allUntaken.filter((c) => c.gender === genderPreference || c.gender === "any");

    const untaken = genderMatched.length > 0 ? genderMatched : allUntaken;

    let best: Character | null = null;
    let bestDistance = Infinity;

    for (const char of untaken) {
      const dist = euclideanDistance(guestVector, characterVector(char));
      if (
        dist < bestDistance ||
        (dist === bestDistance && best !== null && char.id < best.id)
      ) {
        best = char;
        bestDistance = dist;
      }
    }

    if (!best) throw new Error("Assignment failed unexpectedly.");

    await tx.execute({ sql: `UPDATE characters SET taken = 1 WHERE id = ?`, args: [best.id] });
    await tx.execute({
      sql: `UPDATE guests SET assigned_character_id = ? WHERE id = ?`,
      args: [best.id, guestId],
    });

    return best;
  });
}
