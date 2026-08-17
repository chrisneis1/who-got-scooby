import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listGuestsForAdmin } from "@/lib/guest-session";
import {
  CHARACTER_DM_PAIRS,
  listMessages,
  adminDmChannelKey,
  resolveSenderCharacterNames,
} from "@/lib/messages";
import {
  adminReplyDMAction,
  fetchAdminPairThreadAction,
  fetchAdminGuestThreadAction,
} from "@/lib/message-actions";
import ChatThread, { DisplayMessage } from "@/components/ChatThread";

export default async function AdminMessagesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const guests = await listGuestsForAdmin();

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <Link href="/admin" className="text-sm underline text-mystery-brown/70">
              ← Back to dashboard
            </Link>
            <h1 className="font-display text-4xl text-mystery-purple mt-1">All Messages</h1>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-2xl text-mystery-orange-dark">
            Relationship Web DMs
          </h2>
          <p className="text-xs text-mystery-brown/60">
            Read-only — these are between the two players, not you.
          </p>
          {CHARACTER_DM_PAIRS.map((pair) => (
            <PairThread key={pair.id} pairId={pair.id} pairLabel={pair.label} />
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl text-mystery-orange-dark">Ask the GM</h2>
          <p className="text-xs text-mystery-brown/60">
            One private thread per guest — you can reply here.
          </p>
          {guests.length === 0 ? (
            <p className="mystery-card px-6 py-6 text-center text-sm text-mystery-brown/60">
              No guests yet.
            </p>
          ) : (
            guests.map((g) => <GuestThread key={g.id} guestId={g.id} guestName={g.name} />)
          )}
        </section>

        <section>
          <h2 className="font-display text-2xl text-mystery-orange-dark mb-2">Public Board</h2>
          <Link href="/basecamp" className="mystery-btn mystery-btn-secondary text-sm">
            View on Basecamp
          </Link>
        </section>
      </div>
    </main>
  );
}

async function PairThread({ pairId, pairLabel }: { pairId: string; pairLabel: string }) {
  const raw = await listMessages("character_dm", pairId);
  const senderIds = [...new Set(raw.map((m) => m.sender_guest_id).filter((id): id is number => id !== null))];
  const names = await resolveSenderCharacterNames(senderIds);
  const messages: DisplayMessage[] = raw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: false,
    senderLabel: m.sender_guest_id ? (names.get(m.sender_guest_id) ?? "Unknown") : "Host",
  }));

  return (
    <details className="mystery-card px-5 py-4 group">
      <summary className="cursor-pointer font-display text-lg text-mystery-brown flex items-center justify-between">
        <span>{pairLabel}</span>
        <span className="text-xs font-sans text-mystery-brown/50">{messages.length} message(s)</span>
      </summary>
      <div className="mt-3">
        <ChatThread
          messages={messages}
          fetchAction={fetchAdminPairThreadAction.bind(null, pairId)}
          readOnly
          emptyLabel="Nothing sent yet."
        />
      </div>
    </details>
  );
}

async function GuestThread({ guestId, guestName }: { guestId: number; guestName: string }) {
  const raw = await listMessages("admin_dm", adminDmChannelKey(guestId));
  const messages: DisplayMessage[] = raw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: m.sender_guest_id === null, // "mine" from the admin's viewpoint
    senderLabel: guestName,
  }));

  return (
    <details className="mystery-card px-5 py-4">
      <summary className="cursor-pointer font-display text-lg text-mystery-brown flex items-center justify-between">
        <span>{guestName}</span>
        <span className="text-xs font-sans text-mystery-brown/50">{messages.length} message(s)</span>
      </summary>
      <div className="mt-3">
        <ChatThread
          messages={messages}
          sendAction={adminReplyDMAction.bind(null, guestId)}
          fetchAction={fetchAdminGuestThreadAction.bind(null, guestId)}
          placeholder={`Reply to ${guestName}...`}
          emptyLabel="No questions yet."
        />
      </div>
    </details>
  );
}
