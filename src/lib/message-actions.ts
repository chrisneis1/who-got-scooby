"use server";

import { getCurrentGuest } from "./guest-session";
import { isAdminAuthenticated } from "./admin-auth";
import {
  sendMessage,
  findPairById,
  getCharacterNameForGuest,
  adminDmChannelKey,
} from "./messages";

type SendResult = { ok: boolean; error?: string };

/** A guest sending into one of their character's DM channels (Relationship Web pairs). */
export async function sendCharacterDMAction(pairId: string, body: string): Promise<SendResult> {
  const guest = await getCurrentGuest();
  if (!guest || !guest.assigned_character_id) {
    return { ok: false, error: "Not logged in." };
  }

  const pair = findPairById(pairId);
  if (!pair) return { ok: false, error: "Unknown conversation." };

  const myCharacterName = await getCharacterNameForGuest(guest.assigned_character_id);
  if (!myCharacterName || !pair.characters.includes(myCharacterName)) {
    return { ok: false, error: "Your character isn't part of this conversation." };
  }

  return sendMessage("character_dm", pair.id, guest.id, body);
}

/** A guest asking the host/GM a private question. */
export async function sendAdminDMAction(body: string): Promise<SendResult> {
  const guest = await getCurrentGuest();
  if (!guest) return { ok: false, error: "Not logged in." };
  return sendMessage("admin_dm", adminDmChannelKey(guest.id), guest.id, body);
}

/** The host/GM replying to a specific guest's private question thread. */
export async function adminReplyDMAction(guestId: number, body: string): Promise<SendResult> {
  if (!(await isAdminAuthenticated())) return { ok: false, error: "Not authenticated." };
  return sendMessage("admin_dm", adminDmChannelKey(guestId), null, body);
}

/** A guest posting to the public Basecamp message board. */
export async function sendPublicMessageAction(body: string): Promise<SendResult> {
  const guest = await getCurrentGuest();
  if (!guest) return { ok: false, error: "Not logged in." };
  return sendMessage("public", "public", guest.id, body);
}
