import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest-session";
import {
  listMessages,
  findPairForCharacterName,
  partnerCharacterName,
  getCharacterNameForGuest,
  adminDmChannelKey,
} from "@/lib/messages";
import {
  sendCharacterDMAction,
  sendAdminDMAction,
  fetchCharacterDMMessagesAction,
  fetchAdminDMMessagesAction,
} from "@/lib/message-actions";
import GuestNav from "@/components/GuestNav";
import ChatThread, { DisplayMessage } from "@/components/ChatThread";

export default async function MessagesPage() {
  const guest = await getCurrentGuest();
  if (!guest) redirect("/signup");
  if (!guest.assigned_character_id) redirect("/quiz");

  const myCharacterName = await getCharacterNameForGuest(guest.assigned_character_id);
  const pair = myCharacterName ? findPairForCharacterName(myCharacterName) : undefined;
  const partnerName = pair && myCharacterName ? partnerCharacterName(pair, myCharacterName) : null;

  const characterMessages: DisplayMessage[] = pair
    ? (await listMessages("character_dm", pair.id)).map((m) => ({
        id: m.id,
        body: m.body,
        created_at: m.created_at,
        isMine: m.sender_guest_id === guest.id,
        senderLabel: partnerName ?? "",
      }))
    : [];

  const adminMessages: DisplayMessage[] = (
    await listMessages("admin_dm", adminDmChannelKey(guest.id))
  ).map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: m.sender_guest_id === guest.id,
    senderLabel: "Host",
  }));

  return (
    <main className="min-h-screen px-4 py-12">
      <GuestNav guestName={guest.name} />
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-1">
          <p className="text-sm uppercase tracking-widest text-mystery-green font-semibold">
            Messages
          </p>
          <h1 className="font-display text-5xl text-mystery-orange-dark">Private Lines</h1>
        </div>

        {pair && partnerName ? (
          <section className="mystery-card px-6 py-6 space-y-3">
            <h2 className="font-display text-2xl text-mystery-brown">
              DM with {partnerName}
            </h2>
            <p className="text-xs text-mystery-brown/60">
              Only the two of you can see this.
            </p>
            <ChatThread
              messages={characterMessages}
              sendAction={sendCharacterDMAction.bind(null, pair.id)}
              fetchAction={fetchCharacterDMMessagesAction.bind(null, pair.id)}
              placeholder={`Message ${partnerName}...`}
              emptyLabel={`Nothing yet — say hi to ${partnerName}.`}
            />
          </section>
        ) : (
          <section className="mystery-card px-6 py-6 text-center text-sm text-mystery-brown/60">
            Your character doesn&apos;t have a private connection for DMs.
          </section>
        )}

        <section className="mystery-card px-6 py-6 space-y-3">
          <h2 className="font-display text-2xl text-mystery-brown">Ask the GM</h2>
          <p className="text-xs text-mystery-brown/60">
            Private questions about the game — only you and the host can see this.
          </p>
          <ChatThread
            messages={adminMessages}
            sendAction={sendAdminDMAction}
            fetchAction={fetchAdminDMMessagesAction}
            placeholder="Ask a question..."
            emptyLabel="No questions yet."
          />
        </section>
      </div>
    </main>
  );
}
