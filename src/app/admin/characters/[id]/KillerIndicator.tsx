"use client";

import { useState } from "react";

/**
 * Renders on every suspect's edit page (not just the killer's) so the mere
 * presence of this toggle never gives away who the killer is — only the
 * revealed content differs. Same hide-by-default pattern as the dashboard's
 * killer panel; see AdminKillerSection.
 */
export default function KillerIndicator({ isKiller }: { isKiller: boolean }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span className="inline-flex items-center gap-2">
      {revealed ? (
        isKiller ? (
          <span className="text-red-600">🔪 This is the killer — GM only</span>
        ) : (
          <span className="text-mystery-brown/50">Not the killer</span>
        )
      ) : (
        <span className="text-mystery-brown/40">Killer status hidden</span>
      )}
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className="text-xs font-semibold px-2 py-0.5 rounded-full border border-mystery-brown/30 text-mystery-brown/60 hover:border-mystery-purple hover:text-mystery-purple transition-colors"
      >
        {revealed ? "🙈 Hide" : "👁️ Reveal"}
      </button>
    </span>
  );
}
