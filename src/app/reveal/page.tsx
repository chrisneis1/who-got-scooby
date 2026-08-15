import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest-session";
import { getPrivateCharacterForGuest } from "@/lib/characters";
import RevealClient from "./RevealClient";

export default async function RevealPage() {
  const guest = await getCurrentGuest();
  if (!guest) redirect("/signup");
  if (!guest.assigned_character_id) redirect("/quiz");

  const character = await getPrivateCharacterForGuest(guest.assigned_character_id);
  if (!character) redirect("/quiz");

  return (
    <RevealClient
      name={character.name}
      portrait={character.portrait_image}
      bio={character.bio}
    />
  );
}
