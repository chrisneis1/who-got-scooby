import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest-session";
import { getPrivateCharacterForGuest } from "@/lib/characters";
import KillerConfirm from "./KillerConfirm";
import NotTheKiller from "./NotTheKiller";
import PrintButton from "./PrintButton";
import GuestNav from "@/components/GuestNav";
import PhotoUpload from "./PhotoUpload";

export default async function MyCharacterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const guest = await getCurrentGuest();
  if (!guest) redirect("/signup");
  if (!guest.assigned_character_id) redirect("/quiz");

  const { error, saved } = await searchParams;
  const character = await getPrivateCharacterForGuest(guest.assigned_character_id);
  if (!character) redirect("/quiz");

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="print:hidden">
        <GuestNav guestName={guest.name} />
      </div>
      <div className="max-w-2xl mx-auto space-y-6 print:max-w-full">
        <div className="text-center space-y-1">
          <p className="text-sm uppercase tracking-widest text-mystery-green font-semibold">
            My Character
          </p>
          <h1 className="font-display text-5xl text-mystery-orange-dark">{character.name}</h1>
        </div>

        {(error || saved) && (
          <p
            className={`text-sm rounded-lg px-4 py-2 print:hidden ${
              error
                ? "bg-red-100 border-2 border-red-400 text-red-800"
                : "bg-green-100 border-2 border-green-500 text-green-800"
            }`}
          >
            {error || "Photo updated."}
          </p>
        )}

        <div className="mystery-card px-8 py-8 space-y-6 print:shadow-none">
          {character.portrait_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={character.portrait_image}
              alt={character.name}
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-mystery-brown"
            />
          )}

          <div className="print:hidden">
            <PhotoUpload />
          </div>

          <Section title="Bio" badge="Public — share freely" badgeColor="green">
            {character.bio}
          </Section>

          {character.personality && (
            <Section title="Personality" badge="Public — share freely" badgeColor="green">
              {character.personality}
            </Section>
          )}

          {character.life_outside_weekend && (
            <Section title="Life Outside This Weekend" badge="Public — share freely" badgeColor="green">
              {character.life_outside_weekend}
            </Section>
          )}

          <Section title="Relationship to Scooby" badge="Public — share freely" badgeColor="green">
            {character.relationship_to_scooby}
          </Section>

          <div className="fog-divider" />

          <Section title="Your Alibi" badge="Private — Round 1" badgeColor="orange">
            {character.alibi}
          </Section>

          <Section title="Your Secret" badge="Private — Round 3" badgeColor="orange">
            {character.secret}
          </Section>

          {character.motive && (
            <Section title="Your Motive" badge="Private — Round 5" badgeColor="orange">
              {character.motive}
            </Section>
          )}

          <p className="text-sm text-mystery-brown/70 bg-mystery-fog/40 rounded-lg px-4 py-3 print:hidden">
            <strong>How to play it:</strong> Bio, personality, life outside this weekend, and your
            relationship to Scooby are all safe to share with anyone. Your alibi, secret, and
            motive are read aloud one-on-one, in Rounds 1, 3, and 5 — read them exactly as
            written. Everything you say about your character must be true; you can decline to
            answer or stay quiet, but you can&apos;t lie.
          </p>

          {character.show_confirmation_checkbox ? <KillerConfirm /> : <NotTheKiller />}
        </div>

        <div className="flex justify-center print:hidden">
          <PrintButton />
        </div>

        <div className="mystery-card px-6 py-5 text-center print:hidden">
          <p className="font-display text-lg text-mystery-green-dark mb-1">
            There&apos;s more to see 👀
          </p>
          <p className="text-sm text-mystery-brown/70 mb-3">
            This is just your page — the rest of the guest list, their public bios, and the full
            case are waiting for you.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/basecamp" className="mystery-btn !text-sm !py-2 !px-4">
              Explore Basecamp
            </Link>
            <Link
              href="/case-file"
              className="mystery-btn mystery-btn-secondary !text-sm !py-2 !px-4"
            >
              Read the Case File
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  badge,
  badgeColor,
  children,
}: {
  title: string;
  badge: string;
  badgeColor: "green" | "orange";
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <h2 className="font-display text-xl text-mystery-brown">{title}</h2>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
            badgeColor === "green"
              ? "bg-mystery-green/15 text-mystery-green-dark"
              : "bg-mystery-orange/15 text-mystery-orange-dark"
          }`}
        >
          {badge}
        </span>
      </div>
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}
