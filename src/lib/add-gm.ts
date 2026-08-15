import { getDb, firstRowToPlain } from "./db";

/**
 * One-off insert for the Game Master row (Vincent Van Ghoul). Safe to re-run —
 * uses INSERT OR IGNORE keyed on the unique `name` column, and only touches
 * is_gm-eligible fields (bio, relationship_to_scooby). Never sets alibi,
 * secret, or real_motive — he isn't a suspect, so those don't apply.
 */
async function addGM() {
  const db = await getDb();

  await db.execute(
    `INSERT OR IGNORE INTO characters (name, is_gm, taken, gender)
     VALUES ('Vincent Van Ghoul', 1, 1, 'male')`
  );

  await db.execute({
    sql: `UPDATE characters
          SET bio = ?, relationship_to_scooby = ?, alibi = '', secret = ''
          WHERE name = 'Vincent Van Ghoul'`,
    args: [
      "The property's on-call caretaker — or something like it. Vincent showed up within the hour once the group called it in, produces credentials nobody's checked too closely, and seems to know an unsettling amount about crime scenes for a guy who fixes hot tubs. He's running point on tonight's investigation, for reasons nobody's questioned yet.",
      "Says he knew Scooby \"from around.\" Wouldn't elaborate. Scooby never mentioned him.",
    ],
  });

  const rs = await db.execute(`SELECT id, name, is_gm FROM characters WHERE name = 'Vincent Van Ghoul'`);
  const row = firstRowToPlain(rs);
  console.log("GM row:", JSON.stringify(row));
  console.log("Done.");
}

addGM();
