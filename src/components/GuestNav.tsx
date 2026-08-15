"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { guestLogoutAction } from "@/lib/actions";

const LINKS = [
  { href: "/me", label: "My Character" },
  { href: "/basecamp", label: "Basecamp" },
  { href: "/case-file", label: "Case File" },
];

export default function GuestNav({ guestName }: { guestName?: string }) {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto mb-8 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="font-display text-xl text-mystery-orange-dark">
          Who Got Scooby?
        </Link>
        {guestName && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-mystery-brown/70">
              Signed in as <strong className="text-mystery-brown">{guestName}</strong>
            </span>
            <form action={guestLogoutAction}>
              <button
                type="submit"
                className="mystery-btn mystery-btn-secondary !py-2 !px-4 !text-sm"
              >
                Log Out
              </button>
            </form>
          </div>
        )}
      </div>

      <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "px-3 py-1.5 rounded-full bg-mystery-orange text-white shadow-[2px_2px_0_0_var(--color-mystery-brown)]"
                  : "px-3 py-1.5 rounded-full text-mystery-brown/70 hover:text-mystery-orange-dark hover:bg-mystery-orange/10"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
