import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listGuestsForAdmin } from "@/lib/guest-session";
import { listAdminCharacters } from "@/lib/characters";
import { getEvent } from "@/lib/event";
import { adminLogoutAction, adminResetQuizAction, adminUpdateEventAction } from "@/lib/actions";
import ReassignForm from "./ReassignForm";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { saved } = await searchParams;
  const guests = await listGuestsForAdmin();
  const characters = await listAdminCharacters();
  const event = await getEvent();
  const killer = characters.find((c) => c.is_killer === 1);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-display text-4xl text-mystery-purple">Host Dashboard</h1>
          <form action={adminLogoutAction}>
            <button type="submit" className="mystery-btn mystery-btn-secondary text-sm">
              Log Out
            </button>
          </form>
        </div>

        {saved && (
          <p className="bg-green-100 border-2 border-green-500 text-green-800 rounded-lg px-4 py-2 text-sm">
            Saved.
          </p>
        )}

        {/* GM info: who the killer is, and whether they've confirmed the role in the app. */}
        <div className="mystery-card px-6 py-5 !border-mystery-purple bg-mystery-purple/5 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-mystery-purple">
            🔪 For the GM only
          </p>
          <p className="font-display text-xl text-mystery-brown">
            Killer: <span className="text-mystery-purple">{killer?.name ?? "Not yet set"}</span>
          </p>
          <p className="text-sm text-mystery-brown/70">
            Has confirmed their role in the app:{" "}
            <span
              className={
                event.killer_confirmed ? "text-green-700 font-semibold" : "text-red-700 font-semibold"
              }
            >
              {event.killer_confirmed ? "Yes" : "No"}
            </span>
          </p>
        </div>

        {/* Event details editor */}
        <section className="mystery-card px-6 py-6 space-y-4">
          <h2 className="font-display text-2xl text-mystery-orange-dark">Event Details</h2>
          <form action={adminUpdateEventAction} className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Date</label>
                <input name="date" defaultValue={event.date} className="mystery-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Time</label>
                <input name="time" defaultValue={event.time} className="mystery-input w-full" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Location</label>
                <input
                  name="location"
                  defaultValue={event.location}
                  className="mystery-input w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Premise Blurb</label>
              <textarea
                name="premise_blurb"
                defaultValue={event.premise_blurb}
                rows={3}
                className="mystery-input w-full"
              />
            </div>
            <button type="submit" className="mystery-btn text-sm">
              Save Event Details
            </button>
          </form>
        </section>

        {/* Guest list */}
        <section className="mystery-card px-6 py-6 space-y-4">
          <h2 className="font-display text-2xl text-mystery-orange-dark">
            Guests ({guests.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b-2 border-mystery-brown/20">
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">Character</th>
                  <th className="py-2 pr-3">Signed Up</th>
                  <th className="py-2 pr-3">Quiz</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g.id} className="border-b border-mystery-brown/10">
                    <td className="py-2 pr-3 font-semibold">{g.name}</td>
                    <td className="py-2 pr-3">{g.email}</td>
                    <td className="py-2 pr-3">{g.assigned_character_name ?? "—"}</td>
                    <td className="py-2 pr-3 text-xs text-mystery-brown/60">
                      {new Date(g.created_at + "Z").toLocaleString()}
                    </td>
                    <td className="py-2 pr-3">
                      <form action={adminResetQuizAction.bind(null, g.id)}>
                        <button type="submit" className="text-xs underline text-mystery-orange-dark">
                          Reset
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 border-t border-mystery-brown/10">
            <p className="text-xs font-semibold mb-2 text-mystery-brown/70">
              Manual reassignment (swap two guests&apos; characters)
            </p>
            <ReassignForm guests={guests} />
          </div>
        </section>

        {/* Character roster */}
        <section className="mystery-card px-6 py-6 space-y-4">
          <h2 className="font-display text-2xl text-mystery-orange-dark">
            Character Roster ({characters.filter((c) => !c.is_gm).length} suspects
            {characters.some((c) => c.is_gm) ? " + GM" : ""})
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {characters.map((c) => (
              <Link
                key={c.id}
                href={`/admin/characters/${c.id}`}
                className={`border-2 rounded-lg px-4 py-3 transition-colors ${
                  c.is_killer
                    ? "border-red-400 hover:border-red-500 bg-red-50"
                    : c.is_gm
                      ? "border-mystery-purple/40 hover:border-mystery-purple bg-mystery-purple/5"
                      : "border-mystery-brown/20 hover:border-mystery-orange"
                }`}
              >
                <p className="font-display text-lg">
                  {c.name} {c.is_killer === 1 ? "🔪" : ""}
                </p>
                <p className="text-xs text-mystery-brown/60">
                  {c.is_gm ? "🔮 Game Master" : c.taken ? "Claimed" : "Unclaimed"}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
