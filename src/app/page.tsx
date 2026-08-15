import Link from "next/link";
import { getEvent } from "@/lib/event";
import { getCurrentGuest } from "@/lib/guest-session";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function LandingPage() {
  const event = await getEvent();
  const guest = await getCurrentGuest();
  const isAdmin = await isAdminAuthenticated();

  let ctaHref = "/signup";
  let ctaLabel = "Sign up & find your character";
  if (guest) {
    ctaHref = guest.assigned_character_id ? "/me" : "/quiz";
    ctaLabel = guest.assigned_character_id ? "View my character" : "Take the quiz";
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="mystery-card px-8 py-10 space-y-6">
          <p className="uppercase tracking-[0.3em] text-sm text-mystery-green font-semibold">
            Mystery Incorporated presents
          </p>
          <h1 className="font-display text-6xl sm:text-7xl text-mystery-orange-dark drop-shadow-[3px_3px_0_rgba(74,47,28,0.3)]">
            Who Got Scooby?
          </h1>
          <div className="fog-divider" />
          <p className="text-lg leading-relaxed">{event.premise_blurb}</p>
          <div className="pt-2">
            <Link href={ctaHref} className="mystery-btn">
              {ctaLabel} 🔦
            </Link>
          </div>
        </div>

        <div className="mystery-card px-6 py-5 text-left">
          <h2 className="font-display text-2xl text-mystery-green-dark mb-2">Event Details</h2>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="font-semibold">Date</dt>
            <dd>{event.date}</dd>
            <dt className="font-semibold">Time</dt>
            <dd>{event.time}</dd>
            <dt className="font-semibold">Location</dt>
            <dd>{event.location}</dd>
          </dl>
        </div>

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link href="/case-file" className="underline decoration-dotted hover:text-mystery-orange-dark">
            View the Case File
          </Link>
          <span aria-hidden>•</span>
          <Link href="/login" className="underline decoration-dotted hover:text-mystery-orange-dark">
            Already signed up? Log back in
          </Link>
        </div>

        {isAdmin ? (
          <div className="mystery-card px-6 py-5 text-left border-mystery-purple">
            <h2 className="font-display text-xl text-mystery-purple mb-3">Host Tools</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <Link href="/admin" className="mystery-btn mystery-btn-secondary !py-1.5 !px-3 text-xs">
                Admin Dashboard
              </Link>
              <Link href="/basecamp" className="mystery-btn mystery-btn-secondary !py-1.5 !px-3 text-xs">
                Preview Basecamp
              </Link>
              <Link href="/case-file" className="mystery-btn mystery-btn-secondary !py-1.5 !px-3 text-xs">
                Preview Case File
              </Link>
            </div>
            <p className="text-xs text-mystery-brown/50 mt-2">
              Logged in as host. &ldquo;My Character&rdquo; still requires an actual guest signup,
              since it's tied to a specific assigned character.
            </p>
          </div>
        ) : (
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-mystery-brown/40 hover:text-mystery-brown/70 bg-white/70 hover:bg-white border border-mystery-brown/20 rounded-full px-3 py-1.5 shadow-sm transition-colors"
          >
            🔒 Host Login
          </Link>
        )}
      </div>
    </main>
  );
}
