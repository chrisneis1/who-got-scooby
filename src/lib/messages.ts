import { getDb, rowsToPlain } from "./db";

export type ChannelType = "character_dm" | "admin_dm" | "public";

export type CharacterDMPair = {
  id: string;
  characters: [string, string];
  label: string;
};

/**
 * The Relationship Web. Only these four pairs get a private DM channel —
 * Emile & Shaggy is texture-only per spec, so it's deliberately not here.
 * Character names must exactly match `characters.name` in the roster.
 */
export const CHARACTER_DM_PAIRS: CharacterDMPair[] = [
  {
    id: "angel-velma",
    characters: ["Angel Dynamite (Cassidy Williams)", "Velma Dinkley"],
    label: "Angel & Velma",
  },
  {
    id: "daphne-creeper",
    characters: ["Daphne Blake", "The Creeper"],
    label: "Daphne & The Creeper",
  },
  {
    id: "marcie-fred",
    characters: ['Marcie Fleach ("Hot Dog Water")', "Fred Jones"],
    label: "Marcie & Fred",
  },
  {
    id: "bronson-scrappy",
    characters: ["Sheriff Bronson Stone", "Scrappy-Doo"],
    label: "Bronson & Scrappy",
  },
];

export function findPairForCharacterName(name: string): CharacterDMPair | undefined {
  return CHARACTER_DM_PAIRS.find((p) => p.characters.includes(name));
}

export function findPairById(id: string): CharacterDMPair | undefined {
  return CHARACTER_DM_PAIRS.find((p) => p.id === id);
}

export function partnerCharacterName(pair: CharacterDMPair, myCharacterName: string): string {
  return pair.characters[0] === myCharacterName ? pair.characters[1] : pair.characters[0];
}

export function adminDmChannelKey(guestId: number): string {
  return `guest-${guestId}`;
}

const MAX_MESSAGE_LENGTH = 2000;

export type MessageRow = {
  id: number;
  channel_type: ChannelType;
  channel_key: string;
  sender_guest_id: number | null;
  body: string;
  created_at: string;
};

export async function sendMessage(
  channelType: ChannelType,
  channelKey: string,
  senderGuestId: number | null,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = body.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!trimmed) return { ok: false, error: "Message can't be empty." };
  const db = await getDb();
  await db.execute({
    sql: `INSERT INTO messages (channel_type, channel_key, sender_guest_id, body) VALUES (?, ?, ?, ?)`,
    args: [channelType, channelKey, senderGuestId, trimmed],
  });
  return { ok: true };
}

export async function listMessages(channelType: ChannelType, channelKey: string): Promise<MessageRow[]> {
  const db = await getDb();
  const rs = await db.execute({
    sql: `SELECT * FROM messages WHERE channel_type = ? AND channel_key = ? ORDER BY created_at ASC, id ASC`,
    args: [channelType, channelKey],
  });
  return rowsToPlain<MessageRow>(rs);
}

/** Character name currently assigned to a guest, or undefined if they don't have one (yet). */
export async function getCharacterNameForGuest(assignedCharacterId: number): Promise<string | undefined> {
  const db = await getDb();
  const rs = await db.execute({
    sql: `SELECT name FROM characters WHERE id = ?`,
    args: [assignedCharacterId],
  });
  const row = rowsToPlain<{ name: string }>(rs)[0];
  return row?.name;
}

/** Guest id -> real name, for resolving sender labels. Admin-facing use only. */
export async function getGuestNamesByIds(guestIds: number[]): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  if (guestIds.length === 0) return map;
  const db = await getDb();
  const placeholders = guestIds.map(() => "?").join(", ");
  const rs = await db.execute({
    sql: `SELECT id, name FROM guests WHERE id IN (${placeholders})`,
    args: guestIds,
  });
  for (const row of rowsToPlain<{ id: number; name: string }>(rs)) {
    map.set(row.id, row.name);
  }
  return map;
}

/** Guest id -> their current character's name, for the public board (in-character by design). */
export async function resolveSenderCharacterNames(guestIds: number[]): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  if (guestIds.length === 0) return map;
  const db = await getDb();
  const placeholders = guestIds.map(() => "?").join(", ");
  const rs = await db.execute({
    sql: `SELECT g.id as guest_id, c.name as character_name
          FROM guests g LEFT JOIN characters c ON c.id = g.assigned_character_id
          WHERE g.id IN (${placeholders})`,
    args: guestIds,
  });
  for (const row of rowsToPlain<{ guest_id: number; character_name: string | null }>(rs)) {
    map.set(row.guest_id, row.character_name ?? "Unknown");
  }
  return map;
}
