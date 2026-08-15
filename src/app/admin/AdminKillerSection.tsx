"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminCharacter } from "@/lib/characters";

/**
 * Wraps everything on the dashboard that reveals who the killer is — the
 * summary panel and the roster grid's killer badge/border. Defaults to
 * hidden on every page load/navigation on purpose: the whole point is that
 * a host who forgets to hide it before walking away, or just reloads the
 * page later, doesn't leave it sitting visible on screen.
 */
export default function AdminKillerSection({
  characters,
  killerConfirmed,
}: {
  characters: AdminCharacter[];
  killerConfirmed: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const killer = characters.find((c) => c.is_killer === 1);

  return (
    <>
      {/* GM info: who the killer is, and whether they've confirmed the role in the app. */}
      <div className="mystery-card px-6 py-5 !border-mystery-purple bg-mystery-purple/5 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-mystery-purple">
            🔪 For the GM only
          </p>
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="text-xs font-semibold px-3 py-1 rounded-full border-2 border-mystery-purple text-mystery-purple hover:bg-mystery-purple hover:text-white transition-colors"
          >
            {revealed ? "🙈 Hide" : "👁️ Reveal"}
          </button>
        </div>
        <p className="font-display text-xl text-mystery-brown">
          Killer:{" "}
          <span className="text-mystery-purple">
            {revealed ? (killer?.name ?? "Not yet set") : "•••••• hidden ••••••"}
          </span>
        </p>
        <p className="text-sm text-mystery-brown/70">
          Has confirmed their role in the app:{" "}
          <span
            className={killerConfirmed ? "text-green-700 font-semibold" : "text-red-700 font-semibold"}
          >
            {killerConfirmed ? "Yes" : "No"}
          </span>
        </p>
      </div>

      {/* Character roster */}
      <section className="mystery-card px-6 py-6 space-y-4">
        <h2 className="font-display text-2xl text-mystery-orange-dark">
          Character Roster ({characters.filter((c) => !c.is_gm).length} suspects
          {characters.some((c) => c.is_gm) ? " + GM" : ""})
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {characters.map((c) => {
            const showAsKiller = revealed && c.is_killer === 1;
            return (
              <Link
                key={c.id}
                href={`/admin/characters/${c.id}`}
                className={`border-2 rounded-lg px-4 py-3 transition-colors ${
                  showAsKiller
                    ? "border-red-400 hover:border-red-500 bg-red-50"
                    : c.is_gm
                      ? "border-mystery-purple/40 hover:border-mystery-purple bg-mystery-purple/5"
                      : "border-mystery-brown/20 hover:border-mystery-orange"
                }`}
              >
                <p className="font-display text-lg">
                  {c.name} {showAsKiller ? "🔪" : ""}
                </p>
                <p className="text-xs text-mystery-brown/60">
                  {c.is_gm ? "🔮 Game Master" : c.taken ? "Claimed" : "Unclaimed"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
