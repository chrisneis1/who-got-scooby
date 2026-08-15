import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminCharacter } from "@/lib/characters";
import { adminUpdateCharacterAction } from "@/lib/actions";

export default async function CharacterEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const { error } = await searchParams;
  const character = await getAdminCharacter(Number(id));
  if (!character) notFound();

  const updateAction = adminUpdateCharacterAction.bind(null, character.id);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/admin" className="text-sm underline text-mystery-brown/70">
          ← Back to dashboard
        </Link>

        <div className="mystery-card px-8 py-8 space-y-5">
          <div className="flex items-center gap-4">
            {character.portrait_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={character.portrait_image}
                alt={character.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-mystery-brown flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-mystery-purple/20 border-4 border-mystery-brown flex items-center justify-center text-2xl flex-shrink-0">
                🔍
              </div>
            )}
            <div>
              <h1 className="font-display text-4xl text-mystery-orange-dark">
                {character.name}
              </h1>
              <p className="text-xs font-semibold space-x-2">
                {character.is_gm ? (
                  <span className="text-mystery-purple">🔮 Game Master — not a suspect</span>
                ) : character.taken ? (
                  <span className="text-mystery-green-dark">Claimed by a guest</span>
                ) : (
                  <span className="text-mystery-brown/50">Unclaimed</span>
                )}
                {character.is_killer === 1 && (
                  <span className="text-red-600">🔪 This is the killer — GM only</span>
                )}
              </p>
            </div>
          </div>

          {!character.is_gm && (
            <p className="text-xs text-mystery-brown/60">
              Traits — Bravery {character.trait_bravery}, Logic {character.trait_logic}, Charm{" "}
              {character.trait_charm}, Loyalty {character.trait_loyalty}, Comfort-seek{" "}
              {character.trait_comfort}, Curiosity {character.trait_curiosity}
            </p>
          )}

          {error && (
            <p className="bg-red-100 border-2 border-red-400 text-red-800 rounded-lg px-4 py-2 text-sm">
              {error}
            </p>
          )}

          <form action={updateAction} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Portrait Photo</label>
              <p className="text-xs text-mystery-brown/60 mb-2">
                Upload anytime — this can be changed even after a guest has already been assigned
                this character.
              </p>
              <input
                name="portrait_file"
                type="file"
                accept="image/*"
                className="mystery-input w-full text-sm"
              />
              <label className="block text-xs font-semibold mt-3 mb-1 text-mystery-brown/70">
                ...or paste an image URL instead
              </label>
              <input
                name="portrait_image"
                defaultValue={character.portrait_image}
                className="mystery-input w-full"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Bio <span className="font-normal text-mystery-brown/50">(public)</span>
              </label>
              <textarea
                name="bio"
                defaultValue={character.bio}
                rows={3}
                className="mystery-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Relationship to Scooby{" "}
                <span className="font-normal text-mystery-brown/50">(public)</span>
              </label>
              <textarea
                name="relationship_to_scooby"
                defaultValue={character.relationship_to_scooby}
                rows={2}
                className="mystery-input w-full"
              />
            </div>
            {!character.is_gm && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Alibi <span className="font-normal text-mystery-brown/50">(private)</span>
                  </label>
                  <textarea
                    name="alibi"
                    defaultValue={character.alibi}
                    rows={3}
                    className="mystery-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Secret <span className="font-normal text-mystery-brown/50">(private)</span>
                  </label>
                  <textarea
                    name="secret"
                    defaultValue={character.secret}
                    rows={3}
                    className="mystery-input w-full"
                  />
                </div>
              </>
            )}
            <button type="submit" className="mystery-btn">
              Save Character
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
