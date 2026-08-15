import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest-session";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getEvent } from "@/lib/event";
import GuestNav from "@/components/GuestNav";

export default async function CaseFilePage() {
  const guest = await getCurrentGuest();
  if (!guest && !(await isAdminAuthenticated())) redirect("/signup");

  const event = await getEvent();

  return (
    <main className="min-h-screen px-4 py-12">
      <GuestNav guestName={guest?.name} />
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <p className="text-sm uppercase tracking-widest text-mystery-green font-semibold">
            Case File
          </p>
          <h1 className="font-display text-5xl text-mystery-orange-dark">The Case So Far</h1>
        </div>

        <div className="mystery-card px-8 py-8 space-y-6">
          <section>
            <h2 className="font-display text-2xl text-mystery-brown mb-1">Victim</h2>
            <p className="leading-relaxed">
              <strong>Scooby-Doo.</strong> Beloved Great Dane, snack enthusiast, longtime member
              of Mystery Incorporated. Last seen investigating something he probably should have
              left alone.
            </p>
          </section>

          <div className="fog-divider" />

          <section>
            <h2 className="font-display text-2xl text-mystery-brown mb-1">The Setting</h2>
            <p className="leading-relaxed">{event.premise_blurb}</p>
          </section>

          <div className="fog-divider" />

          <section>
            <h2 className="font-display text-2xl text-mystery-brown mb-1">What We Know</h2>
            <p className="leading-relaxed">
              Everyone on the guest list is a suspect — including you. Check{" "}
              <a href="/basecamp" className="underline font-semibold text-mystery-green-dark">
                Basecamp
              </a>{" "}
              to see who else is involved. Your own character&apos;s alibi and secret are on your{" "}
              <a href="/me" className="underline font-semibold text-mystery-green-dark">
                My Character
              </a>{" "}
              page. The rest gets solved live, at the party.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
