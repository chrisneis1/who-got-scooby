"use client";

import { useState } from "react";
import { confirmKillerAction } from "@/lib/actions";

export default function KillerConfirm() {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const result = await confirmKillerAction();
    setLoading(false);
    if (result.ok) {
      setConfirmed(true);
    } else {
      setError(result.error || "Something went wrong.");
    }
  }

  return (
    <div className="print:hidden border-t-2 border-dashed border-mystery-brown/30 pt-5 space-y-3">
      <div className="bg-mystery-purple/10 border-2 border-mystery-purple rounded-lg px-4 py-4 space-y-3">
        <p className="font-display text-lg text-mystery-purple flex items-center gap-2">
          <span aria-hidden>🔪🩸</span> For your eyes only
        </p>
        {confirmed ? (
          <p className="text-sm font-semibold">
            ✅ Role confirmed. See you at the party — good luck.
          </p>
        ) : (
          <>
            <p className="text-sm">
              This is the only place this will ever be said out loud on the site: you&apos;re the
              killer for this event. Nobody else can see this, including the host. Confirming just
              lets the host know (privately, with no name attached) that the role has been
              acknowledged.
            </p>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="mystery-btn mystery-btn-secondary disabled:opacity-50"
            >
              {loading ? "Confirming..." : "I understand I'm the killer. Confirm my role."}
            </button>
            {error && <p className="text-sm text-red-700">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
