/**
 * Parallel to KillerConfirm — shown to every guest whose character isn't the
 * killer. Purely informational (no action to take), and safe to show: a
 * guest only ever sees this about their OWN character, so it never reveals
 * who anyone else is.
 */
export default function NotTheKiller() {
  return (
    <div className="print:hidden border-t-2 border-dashed border-mystery-brown/30 pt-5 space-y-3">
      <div className="bg-mystery-green/10 border-2 border-mystery-green rounded-lg px-4 py-4 space-y-2">
        <p className="font-display text-lg text-mystery-green-dark flex items-center gap-2">
          <span aria-hidden>🛡️</span> For your eyes only
        </p>
        <p className="text-sm">
          You&apos;re safe — your character is <strong>not</strong> the killer. Whatever
          suspicion comes your way tonight, it&apos;s just the story doing its job.
        </p>
      </div>
    </div>
  );
}
