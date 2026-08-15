import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest-session";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listPublicCharacters, countUnclaimedCharacters } from "@/lib/characters";
import { listMessages, resolveSenderCharacterNames } from "@/lib/messages";
import { sendPublicMessageAction } from "@/lib/message-actions";
import AutoRefresh from "./AutoRefresh";
import GuestNav from "@/components/GuestNav";
import ChatThread, { DisplayMessage } from "@/components/ChatThread";

export default async function BasecampPage() {
  const guest = await getCurrentGuest();
  if (!guest && !(await isAdminAuthenticated())) redirect("/signup");

  const characters = await listPublicCharacters();
  const unclaimed = await countUnclaimedCharacters();
  const gm = characters.find((c) => c.is_gm === 1);
  const suspects = characters.filter((c) => c.is_gm === 0);

  const publicMessagesRaw = await listMessages("public", "public");
  const senderIds = [...new Set(publicMessagesRaw.map((m) => m.sender_guest_id).filter((id): id is number => id !== null))];
  const senderNames = await resolveSenderCharacterNames(senderIds);
  const publicMessages: DisplayMessage[] = publicMessagesRaw.map((m) => ({
    id: m.id,
    body: m.body,
    created_at: m.created_at,
    isMine: guest ? m.sender_guest_id === guest.id : false,
    senderLabel: m.sender_guest_id ? (senderNames.get(m.sender_guest_id) ?? "Unknown") : "Host",
  }));

  return (
    <main className="min-h-screen px-4 py-12">
      <AutoRefresh />
      <GuestNav guestName={guest?.name} />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="text-sm uppercase tracking-widest text-mystery-green font-semibold">
            Mystery Inc. Basecamp
          </p>
          <h1 className="font-display text-5xl text-mystery-orange-dark">
            Who Else Is In On This?
          </h1>
          <p className="text-mystery-brown/70">
            Public profiles only — everyone&apos;s alibi and secret stay locked to them.
          </p>
          {unclaimed > 0 && (
            <p className="inline-block bg-mystery-purple/10 text-mystery-purple font-semibold text-sm px-3 py-1 rounded-full">
              🕵️ {unclaimed} character{unclaimed === 1 ? "" : "s"} still unclaimed...
            </p>
          )}
        </div>

        {gm && (
          <div className="mystery-card px-5 py-5 space-y-2 !border-mystery-purple bg-mystery-purple/5 max-w-md mx-auto">
            <span className="block text-center text-xs font-semibold uppercase tracking-wide text-mystery-purple">
              🔮 Game Master — not a suspect
            </span>
            {gm.portrait_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={gm.portrait_image}
                alt={gm.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-mystery-purple mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-mystery-purple/20 border-4 border-mystery-purple flex items-center justify-center text-3xl mx-auto">
                🔮
              </div>
            )}
            <h2 className="font-display text-2xl text-center text-mystery-purple">{gm.name}</h2>
            <p className="text-sm text-center text-mystery-brown/80">{gm.bio}</p>
            <p className="text-xs text-center italic text-mystery-brown/60">
              {gm.relationship_to_scooby}
            </p>
          </div>
        )}

        {suspects.length === 0 ? (
          <p className="text-center text-mystery-brown/60 mystery-card px-6 py-10">
            Nobody has claimed a character yet. Be the first — take the quiz!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {suspects.map((c) => (
              <div key={c.id} className="mystery-card px-5 py-5 space-y-3">
                {c.portrait_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.portrait_image}
                    alt={c.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-mystery-brown mx-auto"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-mystery-purple/20 border-4 border-mystery-brown flex items-center justify-center text-3xl mx-auto">
                    🔍
                  </div>
                )}
                <h2 className="font-display text-2xl text-center text-mystery-brown">
                  {c.name}
                </h2>
                <p className="text-sm text-center text-mystery-brown/80">{c.bio}</p>
                {c.personality && (
                  <p className="text-xs text-center text-mystery-brown/70">
                    <span className="font-semibold text-mystery-brown/50">Personality: </span>
                    {c.personality}
                  </p>
                )}
                {c.life_outside_weekend && (
                  <p className="text-xs text-center text-mystery-brown/70">
                    <span className="font-semibold text-mystery-brown/50">Outside this weekend: </span>
                    {c.life_outside_weekend}
                  </p>
                )}
                <p className="text-xs text-center italic text-mystery-green-dark">
                  {c.relationship_to_scooby}
                </p>
              </div>
            ))}
          </div>
        )}

        <section className="mystery-card px-6 py-6 space-y-3 max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-mystery-brown text-center">
            📌 Message Board
          </h2>
          <p className="text-xs text-mystery-brown/60 text-center">
            Public — everyone at the party can see this.
          </p>
          <ChatThread
            messages={publicMessages}
            sendAction={guest ? sendPublicMessageAction : undefined}
            readOnly={!guest}
            placeholder="Post something everyone can see..."
            emptyLabel="Nothing posted yet."
          />
        </section>
      </div>

      <Link
        href="/admin/login"
        className="fixed bottom-4 right-4 flex items-center gap-1.5 text-xs text-mystery-brown/40 hover:text-mystery-brown/70 bg-white/70 hover:bg-white border border-mystery-brown/20 rounded-full px-3 py-1.5 shadow-sm transition-colors"
      >
        🔒 Host Login
      </Link>
    </main>
  );
}
