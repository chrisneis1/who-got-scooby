import { createClient, type Client, type ResultSet, type Row, type Transaction } from "@libsql/client";
import path from "path";

let client: Client | null = null;
let initPromise: Promise<void> | null = null;

function createDbClient(): Client {
  // Production: point at a Turso database (free hosted libSQL) via env vars.
  // Local dev: a plain file on disk, same as before.
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  if (tursoUrl) {
    return createClient({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN });
  }
  const localPath = process.env.DATABASE_PATH || path.join(process.cwd(), "mystery.db");
  return createClient({ url: `file:${localPath}` });
}

/** Lazily creates the client and runs schema/migrations exactly once per process. */
export async function getDb(): Promise<Client> {
  if (!client) client = createDbClient();
  if (!initPromise) {
    const c = client;
    initPromise = (async () => {
      await initSchema(c);
      await runMigrations(c);
    })();
  }
  await initPromise;
  return client;
}

/**
 * Runs a block of work inside an interactive transaction. Commits on success,
 * rolls back (and rethrows) on any error.
 */
export async function withTransaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
  const db = await getDb();
  const tx = await db.transaction("write");
  try {
    const result = await fn(tx);
    await tx.commit();
    return result;
  } catch (err) {
    await tx.rollback();
    throw err;
  } finally {
    tx.close();
  }
}

/** Converts one libSQL Row (array-like + named access) into a plain object keyed by column name. */
function rowToPlain(rs: ResultSet, row: Row): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < rs.columns.length; i++) {
    obj[rs.columns[i]] = row[i];
  }
  return obj;
}

/** All rows from a ResultSet, as plain objects — safe to pass from a Server Component to a Client Component. */
export function rowsToPlain<T>(rs: ResultSet): T[] {
  return rs.rows.map((row) => rowToPlain(rs, row) as T);
}

/** First row from a ResultSet (or undefined), as a plain object. */
export function firstRowToPlain<T>(rs: ResultSet): T | undefined {
  if (rs.rows.length === 0) return undefined;
  return rowToPlain(rs, rs.rows[0]) as T;
}

/** Exported so scripts like migrate-to-turso.ts can prepare a fresh remote DB directly. */
export async function initSchema(db: Client) {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      trait_bravery INTEGER NOT NULL DEFAULT 3,
      trait_logic INTEGER NOT NULL DEFAULT 3,
      trait_charm INTEGER NOT NULL DEFAULT 3,
      trait_loyalty INTEGER NOT NULL DEFAULT 3,
      trait_comfort INTEGER NOT NULL DEFAULT 3,
      trait_curiosity INTEGER NOT NULL DEFAULT 3,
      portrait_image TEXT DEFAULT '',
      bio TEXT DEFAULT 'TODO: Write bio',
      personality TEXT DEFAULT '',
      life_outside_weekend TEXT DEFAULT '',
      relationship_to_scooby TEXT DEFAULT 'TODO: Write relationship',
      alibi TEXT DEFAULT 'TODO: Write alibi',
      secret TEXT DEFAULT 'TODO: Write secret',
      motive TEXT DEFAULT '',
      is_killer INTEGER NOT NULL DEFAULT 0,
      real_motive TEXT DEFAULT NULL,
      gender TEXT NOT NULL DEFAULT 'any',
      is_gm INTEGER NOT NULL DEFAULT 0,
      taken INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      quiz_answers TEXT DEFAULT NULL,
      trait_bravery INTEGER DEFAULT NULL,
      trait_logic INTEGER DEFAULT NULL,
      trait_charm INTEGER DEFAULT NULL,
      trait_loyalty INTEGER DEFAULT NULL,
      trait_comfort INTEGER DEFAULT NULL,
      trait_curiosity INTEGER DEFAULT NULL,
      assigned_character_id INTEGER DEFAULT NULL,
      gender_preference TEXT NOT NULL DEFAULT 'any',
      session_token TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (assigned_character_id) REFERENCES characters(id)
    );

    CREATE TABLE IF NOT EXISTS event (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      date TEXT DEFAULT 'TBD',
      time TEXT DEFAULT 'TBD',
      location TEXT DEFAULT 'TBD',
      premise_blurb TEXT DEFAULT 'Scooby-Doo is gone. The Mystery Inc. gang — and you — must figure out who did it. Every guest is a suspect. Every suspect has a secret. Only one of you is the killer.',
      killer_confirmed INTEGER NOT NULL DEFAULT 0
    );

    INSERT OR IGNORE INTO event (id) VALUES (1);

    -- channel_type: 'character_dm' | 'admin_dm' | 'public'.
    -- channel_key: character_dm -> a fixed pair id (see CHARACTER_DM_PAIRS in
    -- messages.ts); admin_dm -> 'guest-{id}'; public -> the literal 'public'.
    -- sender_guest_id NULL means the message was sent by the admin/GM.
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      channel_type TEXT NOT NULL,
      channel_key TEXT NOT NULL,
      sender_guest_id INTEGER DEFAULT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (sender_guest_id) REFERENCES guests(id)
    );

    CREATE INDEX IF NOT EXISTS idx_messages_channel
      ON messages (channel_type, channel_key, created_at);
  `);
}

/**
 * Adds columns introduced after the first release, for databases that were
 * created before them. Safe to run on every boot — each column is only added
 * if it isn't already present.
 */
export async function runMigrations(db: Client) {
  const addColumnIfMissing = async (table: string, column: string, definition: string) => {
    const rs = await db.execute(`PRAGMA table_info(${table})`);
    const exists = rs.rows.some((r) => r.name === column);
    if (!exists) {
      await db.execute(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  };

  // Character gender, used to keep quiz assignments gender-matched.
  await addColumnIfMissing("characters", "gender", "TEXT NOT NULL DEFAULT 'any'");
  // The guest's own selection at signup: 'male' | 'female' | 'any'.
  await addColumnIfMissing("guests", "gender_preference", "TEXT NOT NULL DEFAULT 'any'");
  // Game Master row (e.g. Vincent Van Ghoul) — visible on Basecamp with a bio,
  // but never assignable via the quiz, never a killer candidate, and not
  // counted in the "characters still unclaimed" teaser.
  await addColumnIfMissing("characters", "is_gm", "INTEGER NOT NULL DEFAULT 0");
  // Public, from the Player Packets: PERSONALITY and LIFE OUTSIDE THIS WEEKEND sections.
  await addColumnIfMissing("characters", "personality", "TEXT DEFAULT ''");
  await addColumnIfMissing("characters", "life_outside_weekend", "TEXT DEFAULT ''");
  // Private, guest-facing: the Round 5 "MOTIVE" script every character reads
  // aloud. Distinct from real_motive — that one is the killer's true reason,
  // never shown anywhere in the app, handed to them physically at the event.
  await addColumnIfMissing("characters", "motive", "TEXT DEFAULT ''");
}

export type Character = {
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
  personality: string;
  life_outside_weekend: string;
  relationship_to_scooby: string;
  alibi: string;
  secret: string;
  motive: string;
  is_killer: number;
  real_motive: string | null;
  gender: Gender;
  is_gm: number;
  taken: number;
};

/** 'any' means the character/guest isn't restricted to a gender-matched pairing. */
export type Gender = "male" | "female" | "any";

export type Guest = {
  id: number;
  name: string;
  email: string;
  quiz_answers: string | null;
  trait_bravery: number | null;
  trait_logic: number | null;
  trait_charm: number | null;
  trait_loyalty: number | null;
  trait_comfort: number | null;
  trait_curiosity: number | null;
  assigned_character_id: number | null;
  gender_preference: Gender;
  session_token: string;
  created_at: string;
};

export type EventInfo = {
  id: number;
  date: string;
  time: string;
  location: string;
  premise_blurb: string;
  killer_confirmed: number;
};
