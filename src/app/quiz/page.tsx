import { redirect } from "next/navigation";
import { getCurrentGuest } from "@/lib/guest-session";
import { QUIZ_QUESTIONS } from "@/lib/quiz-data";
import QuizClient from "./QuizClient";
import LogoutBar from "@/components/LogoutBar";

export default async function QuizPage() {
  const guest = await getCurrentGuest();
  if (!guest) redirect("/signup");
  if (guest.assigned_character_id) redirect("/me");

  return (
    <>
      <LogoutBar guestName={guest.name} />
      <QuizClient questions={QUIZ_QUESTIONS} guestName={guest.name} />
    </>
  );
}
