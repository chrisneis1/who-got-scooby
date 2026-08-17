"use server";

import { getCurrentGuest } from "./guest-session";
import { isAdminAuthenticated } from "./admin-auth";
import {
  sendMessage,
  listMessages,
  findPairById,
  findPairForCharacterName,
  partnerCharacterName,
  getCharacterNameForGuest,
  resolveSenderCharacterNames,
  getGuestNamesByIds,
  adminDmChannelKey,
  DisplayMessage,
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

/**
 * Polling fetchers, used by ChatThread instead of a full page refresh —
 * Basecamp in particular embeds every character's portrait directly in the
 * page, so re-rendering the whole route on every poll tick was re-sending
 * that image data over and over. These return just the messages.
 */

export async function fetchPublicMessagesAction(): Promise<DisplayMessage[]> {
  const guest = await getCurrentGuest();
  const raw = await listMessages("public", "public");
  const senderIds = [...new Set(raw.map((m) => m.sender_guest_id).filter((id): id is number => id !== null))];
  const names = await resolveSenderCharacterNames(senderIds);
  return raw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: guest ? m.sender_guest_id === guest.id : false,
    senderLabel: m.sender_guest_id ? (names.get(m.sender_guest_id) ?? "Unknown") : "Host",
  }));
}

export async function fetchCharacterDMMessagesAction(pairId: string): Promise<DisplayMessage[]> {
  const guest = await getCurrentGuest();
  if (!guest || !guest.assigned_character_id) return [];
  const pair = findPairById(pairId);
  if (!pair) return [];
  const myCharacterName = await getCharacterNameForGuest(guest.assigned_character_id);
  if (!myCharacterName || !pair.characters.includes(myCharacterName)) return [];
  const partnerName = partnerCharacterName(pair, myCharacterName);
  const raw = await listMessages("character_dm", pair.id);
  return raw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: m.sender_guest_id === guest.id,
    senderLabel: partnerName,
  }));
}

/** A guest polling their own Ask-the-GM thread. */
export async function fetchAdminDMMessagesAction(): Promise<DisplayMessage[]> {
  const guest = await getCurrentGuest();
  if (!guest) return [];
  const raw = await listMessages("admin_dm", adminDmChannelKey(guest.id));
  return raw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: m.sender_guest_id === guest.id,
    senderLabel: "Host",
  }));
}

/** Admin polling a read-only Relationship Web pair thread. */
export async function fetchAdminPairThreadAction(pairId: string): Promise<DisplayMessage[]> {
  if (!(await isAdminAuthenticated())) return [];
  const raw = await listMessages("character_dm", pairId);
  const senderIds = [...new Set(raw.map((m) => m.sender_guest_id).filter((id): id is number => id !== null))];
  const names = await resolveSenderCharacterNames(senderIds);
  return raw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: false,
    senderLabel: m.sender_guest_id ? (names.get(m.sender_guest_id) ?? "Unknown") : "Host",
  }));
}

/** Admin polling one guest's Ask-the-GM thread. */
export async function fetchAdminGuestThreadAction(guestId: number): Promise<DisplayMessage[]> {
  if (!(await isAdminAuthenticated())) return [];
  const raw = await listMessages("admin_dm", adminDmChannelKey(guestId));
  const names = await getGuestNamesByIds([guestId]);
  const guestName = names.get(guestId) ?? "Guest";
  return raw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: m.sender_guest_id === null,
    senderLabel: guestName,
  }));
}
