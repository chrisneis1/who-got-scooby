import { getDb } from "./db";

/**
 * Generates a simple self-contained placeholder avatar (a colored circle
 * with initials, as an inline SVG data URI) for every character that
 * doesn't already have a portrait_image. No external image host involved —
 * the venue's wifi may be unreliable, and a data URI works offline exactly
 * like it would with a real uploaded photo. The host can replace any of
 * these anytime from the character editor.
 */

const PALETTE = [
  "#E8720C", // mystery orange
  "#2F6B4F", // mystery green
  "#6B4EA6", // mystery purple
  "#4A2F1C", // mystery brown
  "#C4472B", // rust red
  "#1B7A8C", // teal
  "#A5762F", // ochre
  "#8C4E9E", // plum
  "#3B7D3E", // forest
  "#B5560A", // burnt orange
  "#5B5F97", // slate blue
];

function initials(name: string): string {
  const letters = name
    .replace(/[()"]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean);
  return (letters[0] ?? "?") + (letters[1] ?? "");
}

function svgAvatarDataUri(name: string, color: string): string {
  const text = initials(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="100" fill="${color}"/>
    <text x="100" y="100" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, serif" font-size="80" font-weight="bold" fill="#ffffff">${text}</text>
  </svg>`;
  const base64 = Buffer.from(svg, "utf-8").toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

async function run() {
  const db = await getDb();
  const rs = await db.execute(
    `SELECT id, name FROM characters WHERE portrait_image IS NULL OR portrait_image = ''`
  );
  const rows = rs.rows.map((r) => ({ id: Number(r.id), name: String(r.name) }));

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const color = PALETTE[i % PALETTE.length];
    await db.execute({
      sql: `UPDATE characters SET portrait_image = ? WHERE id = ?`,
      args: [svgAvatarDataUri(row.name, color), row.id],
    });
    console.log(`Set placeholder photo for "${row.name}".`);
  }

  console.log(`Done. ${rows.length} character(s) given a placeholder photo.`);
}

run();
