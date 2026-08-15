import { redirect } from "next/navigation";
import { adminLoginAction } from "@/lib/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="mystery-card max-w-md w-full px-8 py-10 space-y-6">
        <h1 className="font-display text-4xl text-mystery-purple text-center">
          Host Login
        </h1>
        <p className="text-center text-sm text-mystery-brown/70">
          For the party host only.
        </p>

        {error && (
          <p className="bg-red-100 border-2 border-red-400 text-red-800 rounded-lg px-4 py-2 text-sm">
            {error}
          </p>
        )}

        <form action={adminLoginAction} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mystery-input w-full"
            />
          </div>
          <button type="submit" className="mystery-btn mystery-btn-secondary w-full justify-center">
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
