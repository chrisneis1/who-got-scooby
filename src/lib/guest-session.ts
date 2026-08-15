import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { getDb, rowsToPlain, firstRowToPlain, withTransaction, Guest, Gender } from "./db";

export const GUEST_COOKIE = "guest_session";

export async function createGuest(
  name: string,
  email: string,
  genderPreference: Gender = "any"
): Promise<Guest> {
  const db = await getDb();
  const token = uuidv4();
  const info = await db.execute({
    sql: `INSERT INTO guests (name, email, session_token, gender_preference) VALUES (?, ?, ?, ?)`,
    args: [name, email, token, genderPreference],
  });
  const rs = await db.execute({
    sql: `SELECT * FROM guests WHERE id = ?`,
    args: [Number(info.lastInsertRowid)],
  });
  return firstRowToPlain<Guest>(rs) as Guest;
}

export async function findGuestByEmail(email: string): Promise<Guest | undefined> {
  const db = await getDb();
  const rs = await db.execute({
    sql: `SELECT * FROM guests WHERE email = ? COLLATE NOCASE`,
    args: [email],
  });
  return firstRowToPlain<Guest>(rs);
}

export async function reissueSessionToken(guestId: number): Promise<string> {
  const db = await getDb();
  const token = uuidv4();
  await db.execute({
    sql: `UPDATE guests SET session_token = ? WHERE id = ?`,
    args: [token, guestId],
  });
  return token;
}

export async function getGuestByToken(token: string): Promise<Guest | undefined> {
  const db = await getDb();
  const rs = await db.execute({ sql: `SELECT * FROM guests WHERE session_token = ?`, args: [token] });
  return firstRowToPlain<Guest>(rs);
}

/** Server component / route handler helper — reads the session cookie and looks up the guest. */
export async function getCurrentGuest(): Promise<Guest | undefined> {
  const store = await cookies();
  const token = store.get(GUEST_COOKIE)?.value;
  if (!token) return undefined;
  return getGuestByToken(token);
}

export type AdminGuestRow = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  assigned_character_id: number | null;
  assigned_character_name: string | null;
};

/** Admin-safe guest listing — never touches is_killer / real_motive. */
export async function listGuestsForAdmin(): Promise<AdminGuestRow[]> {
  const db = await getDb();
  const rs = await db.execute(
    `SELECT g.id, g.name, g.email, g.created_at, g.assigned_character_id,
            c.name as assigned_character_name
     FROM guests g
     LEFT JOIN characters c ON c.id = g.assigned_character_id
     ORDER BY g.created_at ASC`
  );
  return rowsToPlain<AdminGuestRow>(rs);
}

export async function resetGuestQuiz(guestId: number) {
  const db = await getDb();
  const rs = await db.execute({ sql: `SELECT * FROM guests WHERE id = ?`, args: [guestId] });
  const guest = firstRowToPlain<Guest>(rs);
  if (!guest) return;
  await withTransaction(async (tx) => {
    if (guest.assigned_character_id) {
      await tx.execute({
        sql: `UPDATE characters SET taken = 0 WHERE id = ?`,
        args: [guest.assigned_character_id],
      });
    }
    await tx.execute({
      sql: `UPDATE guests SET quiz_answers = NULL, trait_bravery = NULL, trait_logic = NULL,
            trait_charm = NULL, trait_loyalty = NULL, trait_comfort = NULL, trait_curiosity = NULL,
            assigned_character_id = NULL WHERE id = ?`,
      args: [guestId],
    });
  });
}
