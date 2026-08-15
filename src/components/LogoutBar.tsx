import { guestLogoutAction } from "@/lib/actions";

/**
 * Compact "Signed in as X / Log Out" pill for screens that don't use the
 * full GuestNav (quiz, reveal, landing) — fixed top-right so it doesn't
 * disrupt centered layouts. Same idea as GuestNav's version on My
 * Character/Basecamp/Case File, just self-contained for pages with their
 * own header.
 */
export default function LogoutBar({ guestName }: { guestName: string }) {
  return (
    <div className="fixed top-4 right-4 z-10 flex items-center gap-2 bg-white/90 border border-mystery-brown/20 rounded-full pl-3 pr-1.5 py-1.5 shadow-sm text-xs">
      <span className="text-mystery-brown/70 hidden sm:inline">
        Signed in as <strong className="text-mystery-brown">{guestName}</strong>
      </span>
      <form action={guestLogoutAction}>
        <button
          type="submit"
          className="mystery-btn mystery-btn-secondary !py-1 !px-3 !text-xs"
        >
          Log Out
        </button>
      </form>
    </div>
  );
}
