"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizQuestion, QuizOption } from "@/lib/quiz-data";
import { submitQuizAction } from "@/lib/actions";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizClient({
  questions,
  guestName,
}: {
  questions: QuizQuestion[];
  guestName: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shuffledOptions = useMemo<Record<number, QuizOption[]>>(() => {
    const map: Record<number, QuizOption[]> = {};
    for (const q of questions) map[q.id] = shuffle(q.options);
    return map;
  }, [questions]);

  const question = questions[step];
  const progress = Math.round((step / questions.length) * 100);
  const selected = answers[question.id];

  function choose(key: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: key }));
  }

  async function goNext() {
    if (!selected) return;
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await submitQuizAction(answers);
    if (result.ok) {
      router.push("/reveal");
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  function goBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center">
          <p className="font-display text-2xl text-mystery-green-dark">
            {guestName}&apos;s Trail
          </p>
          <p className="text-sm text-mystery-brown/70">
            Question {step + 1} of {questions.length}
          </p>
        </div>

        {/* Mystery Machine progress bar */}
        <div className="relative h-10 mystery-card !shadow-none overflow-hidden">
          <div className="fog-divider absolute inset-x-0 top-1/2 -translate-y-1/2" />
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-out text-2xl"
            style={{ left: `calc(${progress}% - ${progress === 100 ? "24px" : "0px"})` }}
          >
            🚐
          </div>
        </div>

        <div className="mystery-card px-6 py-8 space-y-5">
          <h2 className="font-display text-2xl text-mystery-orange-dark leading-snug">
            {question.prompt}
          </h2>

          <div className="space-y-3">
            {shuffledOptions[question.id].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => choose(opt.key)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                  selected === opt.key
                    ? "border-mystery-orange bg-mystery-orange/10"
                    : "border-mystery-brown/30 hover:border-mystery-orange/60"
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>

          {error && (
            <p className="bg-red-100 border-2 border-red-400 text-red-800 rounded-lg px-4 py-2 text-sm">
              {error}
            </p>
          )}

          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="mystery-btn mystery-btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!selected || submitting}
              className="mystery-btn disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === questions.length - 1
                ? submitting
                  ? "Solving..."
                  : "Reveal My Character"
                : "Next"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
