"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminReassignAction } from "@/lib/actions";
import { AdminGuestRow } from "@/lib/guest-session";

export default function ReassignForm({ guests }: { guests: AdminGuestRow[] }) {
  const router = useRouter();
  const [guestA, setGuestA] = useState("");
  const [guestB, setGuestB] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSwap() {
    if (!guestA || !guestB || guestA === guestB) return;
    setLoading(true);
    await adminReassignAction(Number(guestA), Number(guestB));
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs font-semibold mb-1">Guest A</label>
        <select
          value={guestA}
          onChange={(e) => setGuestA(e.target.value)}
          className="mystery-input"
        >
          <option value="">Select guest...</option>
          {guests.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.assigned_character_name ?? "no character"})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1">Guest B</label>
        <select
          value={guestB}
          onChange={(e) => setGuestB(e.target.value)}
          className="mystery-input"
        >
          <option value="">Select guest...</option>
          {guests.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name} ({g.assigned_character_name ?? "no character"})
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={handleSwap}
        disabled={!guestA || !guestB || guestA === guestB || loading}
        className="mystery-btn mystery-btn-secondary disabled:opacity-40"
      >
        {loading ? "Swapping..." : "Swap Characters"}
      </button>
    </div>
  );
}
