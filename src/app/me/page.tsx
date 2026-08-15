import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest-session";
import { getPrivateCharacterForGuest } from "@/lib/characters";
import KillerConfirm from "./KillerConfirm";
import PrintButton from "./PrintButton";
import GuestNav from "@/components/GuestNav";

export default async function MyCharacterPage() {
  const guest = await getCurrentGuest();
  if (!guest) redirect("/signup");
  if (!guest.assigned_character_id) redirect("/quiz");

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

        <div className="mystery-card px-8 py-8 space-y-6 print:shadow-none">
          {character.portrait_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={character.portrait_image}
              alt={character.name}
              className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-mystery-brown"
            />
          )}

          <Section title="Bio" badge="Public — share freely" badgeColor="green">
            {character.bio}
          </Section>

          <Section title="Relationship to Scooby" badge="Public — share freely" badgeColor="green">
            {character.relationship_to_scooby}
          </Section>

          <div className="fog-divider" />

          <Section title="Your Alibi" badge="Private — yours to reveal or withhold" badgeColor="orange">
            {character.alibi}
          </Section>

          <Section title="Your Secret" badge="Private — yours to reveal or withhold" badgeColor="orange">
            {character.secret}
          </Section>

          <p className="text-sm text-mystery-brown/70 bg-mystery-fog/40 rounded-lg px-4 py-3 print:hidden">
            <strong>How to play it:</strong> Your bio and relationship to Scooby are safe to share
            with anyone at the party. Your alibi and secret are yours — reveal them, bluff around
            them, or keep them close to the vest. It&apos;s your call.
          </p>

          {character.show_confirmation_checkbox && <KillerConfirm />}
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
