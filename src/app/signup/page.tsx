import Link from "next/link";
import { redirect } from "next/navigation";
import { signupAction } from "@/lib/actions";
import { getCurrentGuest } from "@/lib/guest-session";

export default async function SignupPage({
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
          Sign Up
        </h1>
        <p className="text-center text-sm">
          The gang needs to know who&apos;s coming. No password required.
        </p>

        {error && (
          <p className="bg-red-100 border-2 border-red-400 text-red-800 rounded-lg px-4 py-2 text-sm">
            {error}
          </p>
        )}

        <form action={signupAction} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-1">
              Your Real Name
            </label>
            <p className="text-xs text-mystery-brown/60 mb-1">
              Not a character name — just you. We&apos;ll tell you who you&apos;re playing next.
            </p>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mystery-input w-full"
              placeholder="Your name"
            />
          </div>
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
          <fieldset>
            <legend className="block text-sm font-semibold mb-1">
              Your Gender
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ].map((opt, i) => (
                <label
                  key={opt.value}
                  className="flex items-center justify-center gap-1.5 border-2 border-mystery-brown/30 rounded-lg px-2 py-2 text-sm cursor-pointer hover:border-mystery-orange has-checked:border-mystery-orange has-checked:bg-mystery-orange/10"
                >
                  <input
                    type="radio"
                    name="gender_preference"
                    value={opt.value}
                    defaultChecked={i === 0}
                    className="accent-mystery-orange"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="mystery-btn w-full justify-center">
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm">
          Already signed up?{" "}
          <Link href="/login" className="underline font-semibold text-mystery-green-dark">
            Log back in
          </Link>
        </p>
      </div>
    </main>
  );
}
