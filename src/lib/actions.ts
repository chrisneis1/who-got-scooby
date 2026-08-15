"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, withTransaction, firstRowToPlain, Gender } from "./db";
import {
  createGuest,
  findGuestByEmail,
  reissueSessionToken,
  getCurrentGuest,
  resetGuestQuiz,
  GUEST_COOKIE,
} from "./guest-session";
import {
  verifyAdminPassword,
  getAdminTokenValue,
  ADMIN_COOKIE,
  isAdminAuthenticated,
} from "./admin-auth";
import { assignCharacterToGuest } from "./assignment";
import { addVector, zeroVector, TraitVector } from "./traits";
import { QUIZ_QUESTIONS } from "./quiz-data";
import {
  isCharacterKiller,
  updateCharacterFields,
  CharacterEditableFields,
} from "./characters";
import { setKillerConfirmed, updateEvent, EventEditableFields } from "./event";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 90, // 90 days
};

export async function signupAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const rawGender = String(formData.get("gender_preference") || "any");
  const genderPreference: Gender =
    rawGender === "male" || rawGender === "female" ? rawGender : "any";

  if (!name || !email) {
    redirect("/signup?error=" + encodeURIComponent("Name and email are required."));
  }

  const existing = await findGuestByEmail(email);
  if (existing) {
    redirect("/login?error=" + encodeURIComponent("That email is already signed up — log back in instead."));
  }

  const guest = await createGuest(name, email, genderPreference);
  const store = await cookies();
  store.set(GUEST_COOKIE, guest.session_token, COOKIE_OPTIONS);

  redirect("/quiz");
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email) {
    redirect("/login?error=" + encodeURIComponent("Enter the email you signed up with."));
  }

  const guest = await findGuestByEmail(email);
  if (!guest) {
    redirect("/login?error=" + encodeURIComponent("No signup found for that email."));
  }

  const token = await reissueSessionToken(guest.id);
  const store = await cookies();
  store.set(GUEST_COOKIE, token, COOKIE_OPTIONS);

  redirect(guest.assigned_character_id ? "/me" : "/quiz");
}

export async function guestLogoutAction() {
  const store = await cookies();
  store.delete(GUEST_COOKIE);
  redirect("/");
}

export async function submitQuizAction(
  answers: Record<number, string>
): Promise<{ ok: true; characterId: number } | { ok: false; error: string }> {
  const guest = await getCurrentGuest();
  if (!guest) return { ok: false, error: "Not logged in." };
  if (guest.assigned_character_id) {
    return { ok: false, error: "You've already taken the quiz." };
  }

  let vector: TraitVector = zeroVector();
  for (const question of QUIZ_QUESTIONS) {
    const chosenKey = answers[question.id];
    const option = question.options.find((o) => o.key === chosenKey);
    if (!option) {
      return { ok: false, error: `Missing answer for question ${question.id}.` };
    }
    vector = addVector(vector, option.weights);
  }

  const db = await getDb();
  await db.execute({
    sql: `UPDATE guests SET quiz_answers = ?, trait_bravery = ?, trait_logic = ?, trait_charm = ?,
          trait_loyalty = ?, trait_comfort = ?, trait_curiosity = ? WHERE id = ?`,
    args: [
      JSON.stringify(answers),
      vector.bravery,
      vector.logic,
      vector.charm,
      vector.loyalty,
      vector.comfort,
      vector.curiosity,
      guest.id,
    ],
  });

  try {
    const character = await assignCharacterToGuest(guest.id, vector, guest.gender_preference);
    return { ok: true, characterId: character.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Assignment failed." };
  }
}

export async function confirmKillerAction(): Promise<{ ok: boolean; error?: string }> {
  const guest = await getCurrentGuest();
  if (!guest || !guest.assigned_character_id) {
    return { ok: false, error: "No character assigned to this session." };
  }
  if (!(await isCharacterKiller(guest.assigned_character_id))) {
    return { ok: false, error: "This action isn't available for your character." };
  }
  await setKillerConfirmed(true);
  return { ok: true };
}

export async function adminLoginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!verifyAdminPassword(password)) {
    redirect("/admin/login?error=" + encodeURIComponent("Incorrect password."));
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, getAdminTokenValue(), COOKIE_OPTIONS);
  redirect("/admin");
}

export async function adminLogoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Not authenticated as admin.");
  }
}

export async function adminReassignAction(guestAId: number, guestBId: number) {
  await requireAdmin();
  const db = await getDb();
  const [rsA, rsB] = await Promise.all([
    db.execute({ sql: `SELECT * FROM guests WHERE id = ?`, args: [guestAId] }),
    db.execute({ sql: `SELECT * FROM guests WHERE id = ?`, args: [guestBId] }),
  ]);
  const guestA = firstRowToPlain<{ assigned_character_id: number | null }>(rsA);
  const guestB = firstRowToPlain<{ assigned_character_id: number | null }>(rsB);
  if (!guestA || !guestB) return;

  await withTransaction(async (tx) => {
    await tx.execute({
      sql: `UPDATE guests SET assigned_character_id = ? WHERE id = ?`,
      args: [guestB!.assigned_character_id, guestAId],
    });
    await tx.execute({
      sql: `UPDATE guests SET assigned_character_id = ? WHERE id = ?`,
      args: [guestA!.assigned_character_id, guestBId],
    });
  });
}

export async function adminResetQuizAction(guestId: number) {
  await requireAdmin();
  await resetGuestQuiz(guestId);
}

const MAX_PORTRAIT_BYTES = 4 * 1024 * 1024; // 4MB — plenty for a portrait, keeps the DB reasonable

export async function adminUpdateCharacterAction(id: number, formData: FormData) {
  await requireAdmin();
  // Belt-and-suspenders: only ever read these named fields out of the form,
  // even though updateCharacterFields already ignores unknown keys and
  // is_killer/real_motive are never part of CharacterEditableFields.
  const safeFields: CharacterEditableFields = {
    bio: String(formData.get("bio") ?? ""),
    relationship_to_scooby: String(formData.get("relationship_to_scooby") ?? ""),
  };
  // Alibi/Secret are omitted from the form entirely for the GM (not a
  // suspect), so only touch these columns when the fields were actually
  // present — otherwise saving the GM's bio would silently blank them out.
  if (formData.has("alibi")) safeFields.alibi = String(formData.get("alibi") ?? "");
  if (formData.has("secret")) safeFields.secret = String(formData.get("secret") ?? "");

  // A newly uploaded file always wins over the URL field. Storing the image
  // as a data URI (rather than a file on disk) keeps this working the same
  // way on serverless hosts, whose filesystem doesn't persist between
  // requests — the image just lives in the database row like any other text.
  const uploaded = formData.get("portrait_file");
  if (uploaded instanceof File && uploaded.size > 0) {
    if (uploaded.size > MAX_PORTRAIT_BYTES) {
      redirect(
        `/admin/characters/${id}?error=` +
          encodeURIComponent("That image is too large — please use one under 4MB.")
      );
    }
    const bytes = Buffer.from(await uploaded.arrayBuffer());
    const mime = uploaded.type || "image/jpeg";
    safeFields.portrait_image = `data:${mime};base64,${bytes.toString("base64")}`;
  } else {
    safeFields.portrait_image = String(formData.get("portrait_image") ?? "");
  }

  await updateCharacterFields(id, safeFields);
  redirect("/admin?saved=1");
}

export async function adminUpdateEventAction(formData: FormData) {
  await requireAdmin();
  const fields: EventEditableFields = {
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    location: String(formData.get("location") ?? ""),
    premise_blurb: String(formData.get("premise_blurb") ?? ""),
  };
  await updateEvent(fields);
  redirect("/admin?saved=1");
}
