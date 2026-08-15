import { getDb, firstRowToPlain, EventInfo } from "./db";

export async function getEvent(): Promise<EventInfo> {
  const db = await getDb();
  const rs = await db.execute(`SELECT * FROM event WHERE id = 1`);
  return firstRowToPlain<EventInfo>(rs) as EventInfo;
}

export type EventEditableFields = {
  date?: string;
  time?: string;
  location?: string;
  premise_blurb?: string;
};

export async function updateEvent(fields: EventEditableFields) {
  const db = await getDb();
  const keys = (Object.keys(fields) as (keyof EventEditableFields)[]).filter(
    (k) => fields[k] !== undefined
  );
  if (keys.length === 0) return;
  const sets = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k] as string);
  await db.execute({ sql: `UPDATE event SET ${sets} WHERE id = 1`, args: values });
}

export async function setKillerConfirmed(value: boolean) {
  const db = await getDb();
  await db.execute({ sql: `UPDATE event SET killer_confirmed = ? WHERE id = 1`, args: [value ? 1 : 0] });
}
