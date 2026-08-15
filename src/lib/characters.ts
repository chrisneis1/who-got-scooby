import { getDb, rowsToPlain, firstRowToPlain, Character } from "./db";

/**
 * Public-safe character shape for Basecamp — no alibi, no secret, no killer fields.
 */
export type PublicCharacter = {
  id: number;
  name: string;
  portrait_image: string;
  bio: string;
  relationship_to_scooby: string;
  is_gm: number;
};

/**
 * Host-facing character shape. The host doubles as the in-person Game
 * Master, who has to know who the killer is to run the investigation — so
 * unlike PublicCharacter/PrivateCharacter (guest-facing, see below),
 * is_killer IS included here on purpose. real_motive is still left out; it's
 * not needed for the dashboard and there's no editor UI for it.
 *
 * IMPORTANT: this type and ADMIN_SAFE_COLUMNS must only ever be used from
 * routes gated by isAdminAuthenticated(). Never let a guest-facing page
 * import AdminCharacter directly — use PrivateCharacter (which explicitly
 * omits is_killer) for the guest's own character page instead.
 */
export type AdminCharacter = {
  id: number;
  name: string;
  trait_bravery: number;
  trait_logic: number;
  trait_charm: number;
  trait_loyalty: number;
  trait_comfort: number;
  trait_curiosity: number;
  portrait_image: string;
  bio: string;
  relationship_to_scooby: string;
  alibi: string;
  secret: string;
  is_gm: number;
  is_killer: number;
  taken: number;
};

/**
 * Guest-facing view of their own character. Deliberately omits is_killer at
 * the type level (not just at runtime) so it's a compile error to leak it
 * into a guest-facing page — guests only ever get the plain
 * show_confirmation_checkbox boolean, never the raw flag.
 */
export type PrivateCharacter = Omit<AdminCharacter, "is_killer"> & {
  show_confirmation_checkbox: boolean;
};

const ADMIN_SAFE_COLUMNS = `
  id, name,
  trait_bravery, trait_logic, trait_charm, trait_loyalty, trait_comfort, trait_curiosity,
  portrait_image, bio, relationship_to_scooby, alibi, secret, is_gm, is_killer, taken
`;

export async function listPublicCharacters(): Promise<PublicCharacter[]> {
  const db = await getDb();
  const rs = await db.execute(
    `SELECT id, name, portrait_image, bio, relationship_to_scooby, is_gm
     FROM characters WHERE taken = 1 OR is_gm = 1 ORDER BY is_gm ASC, name ASC`
  );
  return rowsToPlain<PublicCharacter>(rs);
}

/** Excludes the GM row — he's never assignable, so he shouldn't count toward "still unclaimed". */
export async function countUnclaimedCharacters(): Promise<number> {
  const db = await getDb();
  const rs = await db.execute(`SELECT COUNT(*) as c FROM characters WHERE taken = 0 AND is_gm = 0`);
  return Number(firstRowToPlain<{ c: number }>(rs)?.c ?? 0);
}

export async function listAdminCharacters(): Promise<AdminCharacter[]> {
  const db = await getDb();
  const rs = await db.execute(`SELECT ${ADMIN_SAFE_COLUMNS} FROM characters ORDER BY name ASC`);
  return rowsToPlain<AdminCharacter>(rs);
}

export async function getAdminCharacter(id: number): Promise<AdminCharacter | undefined> {
  const db = await getDb();
  const rs = await db.execute({
    sql: `SELECT ${ADMIN_SAFE_COLUMNS} FROM characters WHERE id = ?`,
    args: [id],
  });
  return firstRowToPlain<AdminCharacter>(rs);
}

export type CharacterEditableFields = {
  bio?: string;
  relationship_to_scooby?: string;
  alibi?: string;
  secret?: string;
  portrait_image?: string;
};

const EDITABLE_KEYS: (keyof CharacterEditableFields)[] = [
  "bio",
  "relationship_to_scooby",
  "alibi",
  "secret",
  "portrait_image",
];

/**
 * Updates only the explicitly allowed editable fields. is_killer and
 * real_motive are never accepted here, regardless of what a caller sends.
 */
export async function updateCharacterFields(id: number, fields: CharacterEditableFields) {
  const db = await getDb();
  const sets: string[] = [];
  const values: (string | number)[] = [];
  for (const key of EDITABLE_KEYS) {
    const value = fields[key];
    if (value !== undefined) {
      sets.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (sets.length === 0) return;
  values.push(id);
  await db.execute({ sql: `UPDATE characters SET ${sets.join(", ")} WHERE id = ?`, args: values });
}

/**
 * Private view for the guest assigned to this character. Returns everything
 * a guest is allowed to see about their own character, plus a plain boolean
 * telling the frontend whether to render the killer-confirmation checkbox.
 * The raw is_killer value is read here (server-side only) and destructured
 * out before returning — PrivateCharacter's type doesn't even have room for
 * it, so leaking it would be a type error, not just a runtime mistake.
 */
export async function getPrivateCharacterForGuest(id: number): Promise<PrivateCharacter | undefined> {
  const db = await getDb();
  const rs = await db.execute({
    sql: `SELECT ${ADMIN_SAFE_COLUMNS} FROM characters WHERE id = ?`,
    args: [id],
  });
  const row = firstRowToPlain<AdminCharacter>(rs);
  if (!row) return undefined;
  const { is_killer, ...rest } = row;
  return { ...rest, show_confirmation_checkbox: is_killer === 1 };
}

/** Server-internal only — used by the killer-confirm route. Never expose the return value directly. */
export async function isCharacterKiller(id: number): Promise<boolean> {
  const db = await getDb();
  const rs = await db.execute({ sql: `SELECT is_killer FROM characters WHERE id = ?`, args: [id] });
  const row = firstRowToPlain<{ is_killer: number }>(rs);
  return row?.is_killer === 1;
}

export async function getCharacterRaw(id: number): Promise<Character | undefined> {
  const db = await getDb();
  const rs = await db.execute({ sql: `SELECT * FROM characters WHERE id = ?`, args: [id] });
  return firstRowToPlain<Character>(rs);
}

export async function markCharacterTaken(id: number, taken: boolean) {
  const db = await getDb();
  await db.execute({ sql: `UPDATE characters SET taken = ? WHERE id = ?`, args: [taken ? 1 : 0, id] });
}
