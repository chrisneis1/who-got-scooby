import { getDb, withTransaction, firstRowToPlain } from "./db";

type SeedCharacter = {
  name: string;
  bravery: number;
  logic: number;
  charm: number;
  loyalty: number;
  comfort: number;
  curiosity: number;
};

const ROSTER: SeedCharacter[] = [
  { name: "Fred Jones", bravery: 4, logic: 3, charm: 4, loyalty: 4, comfort: 2, curiosity: 3 },
  { name: "Daphne Blake", bravery: 4, logic: 3, charm: 5, loyalty: 4, comfort: 2, curiosity: 4 },
  { name: "Velma Dinkley", bravery: 2, logic: 5, charm: 3, loyalty: 4, comfort: 2, curiosity: 5 },
  { name: "Shaggy Rogers", bravery: 1, logic: 2, charm: 3, loyalty: 5, comfort: 5, curiosity: 2 },
  { name: "Scrappy-Doo", bravery: 5, logic: 3, charm: 3, loyalty: 5, comfort: 1, curiosity: 3 },
  { name: "Emile Mondavarious", bravery: 2, logic: 3, charm: 5, loyalty: 3, comfort: 4, curiosity: 3 },
  { name: "The Creeper", bravery: 3, logic: 2, charm: 1, loyalty: 2, comfort: 3, curiosity: 1 },
  { name: "Sheriff Bronson Stone", bravery: 3, logic: 3, charm: 2, loyalty: 4, comfort: 3, curiosity: 2 },
  { name: 'Marcie Fleach ("Hot Dog Water")', bravery: 3, logic: 4, charm: 2, loyalty: 4, comfort: 2, curiosity: 4 },
  { name: "Angel Dynamite (Cassidy Williams)", bravery: 4, logic: 3, charm: 5, loyalty: 3, comfort: 3, curiosity: 4 },
];

async function seed() {
  const db = await getDb();

  await withTransaction(async (tx) => {
    for (const c of ROSTER) {
      await tx.execute({
        sql: `INSERT OR IGNORE INTO characters
              (name, trait_bravery, trait_logic, trait_charm, trait_loyalty, trait_comfort, trait_curiosity)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [c.name, c.bravery, c.logic, c.charm, c.loyalty, c.comfort, c.curiosity],
      });
    }
  });

  const countRs = await db.execute(`SELECT COUNT(*) as count FROM characters`);
  const { count } = firstRowToPlain<{ count: number }>(countRs) as { count: number };
  console.log(`Characters in DB: ${count}`);

  const killerRs = await db.execute(`SELECT COUNT(*) as c FROM characters WHERE is_killer = 1`);
  const killerAlready = firstRowToPlain<{ c: number }>(killerRs) as { c: number };

  if (killerAlready.c === 0) {
    const idsRs = await db.execute(`SELECT id FROM characters WHERE is_gm = 0`);
    const ids = idsRs.rows.map((r) => Number(r.id));
    if (ids.length > 0) {
      const chosen = ids[Math.floor(Math.random() * ids.length)];
      await db.execute({ sql: `UPDATE characters SET is_killer = 1 WHERE id = ?`, args: [chosen] });
      console.log(`Killer randomly selected. (Identity intentionally not logged.)`);
    }
  } else {
    console.log(`Killer already selected — skipping random selection.`);
  }

  console.log("Seed complete.");
}

seed();
