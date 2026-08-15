import Link from "next/link";
import { redirect } from "next/navigation";
import { loginAction } from "@/lib/actions";
import { getCurrentGuest } from "@/lib/guest-session";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const guest = await getCurrentGuest();
  if (guest) redirect(guest.assigned_character_id ? "/me" : "/quiz");

  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="mystery-card max-w-md w-full px-8 py-10 space-y-6">
        <h1 className="font-display text-4xl text-mystery-orange-dark text-center">
          Log Back In
        </h1>
        <p className="text-center text-sm">
          Enter the email you signed up with to pick up where you left off.
        </p>

        {error && (
          <p className="bg-red-100 border-2 border-red-400 text-red-800 rounded-lg px-4 py-2 text-sm">
            {error}
          </p>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mystery-input w-full"
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="mystery-btn w-full justify-center">
            Log In
          </button>
        </form>

        <p className="text-center text-sm">
          Haven&apos;t signed up yet?{" "}
          <Link href="/signup" className="underline font-semibold text-mystery-green-dark">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
}
