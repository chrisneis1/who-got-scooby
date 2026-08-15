"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RevealClient({
  name,
  portrait,
  bio,
}: {
  name: string;
  portrait: string;
  bio: string;
}) {
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 900);
    const t2 = setTimeout(() => setStage(2), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center space-y-6">
        <p className="font-display text-3xl text-mystery-green-dark animate-reveal-fade-up">
          You are...
        </p>

        {stage >= 1 && (
          <div className="mystery-card px-8 py-10 space-y-4 animate-reveal-pop">
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portrait}
                alt={name}
                className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-mystery-brown"
              />
            ) : (
              <div className="w-40 h-40 mx-auto rounded-full bg-mystery-purple/20 border-4 border-mystery-brown flex items-center justify-center text-5xl">
                🔍
              </div>
            )}
            <h1 className="font-display text-4xl sm:text-5xl text-mystery-orange-dark">
              {name}!
            </h1>
            {stage >= 2 && (
              <p className="text-mystery-brown/80 animate-reveal-fade-up">{bio}</p>
            )}
          </div>
        )}

        {stage >= 2 && (
          <div className="animate-reveal-fade-up space-y-4">
            <Link href="/me" className="mystery-btn">
              See My Full Character →
            </Link>

            <div className="mystery-card px-5 py-4 text-sm">
              <p className="text-mystery-brown/70 mb-2">
                This is just one piece of it — the rest of the guest list and the case itself are
                waiting whenever you&apos;re ready.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Link
                  href="/basecamp"
                  className="mystery-btn mystery-btn-secondary !text-sm !py-2 !px-4"
                >
                  Browse Basecamp
                </Link>
                <Link href="/case-file" className="mystery-btn mystery-btn-secondary !text-sm !py-2 !px-4">
                  Read the Case File
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
