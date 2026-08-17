"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { DisplayMessage } from "@/lib/messages";

export type { DisplayMessage };

/**
 * Generic two-way (or group) chat thread: message list + input, used for
 * character DMs, the admin Q&A DM, and the public Basecamp board. Messages
 * are fetched server-side and passed in as props; sending triggers a
 * router.refresh() to pull the latest, and a light poll keeps it near-live
 * for messages from other people without needing a websocket server.
 */
export default function ChatThread({
  messages: initialMessages,
  sendAction,
  fetchAction,
  placeholder = "Type a message...",
  pollMs = 6000,
  emptyLabel = "No messages yet.",
  readOnly = false,
}: {
  messages: DisplayMessage[];
  sendAction?: (body: string) => Promise<{ ok: boolean; error?: string }>;
  /** Polls just this thread's messages instead of refreshing the whole page. */
  fetchAction?: () => Promise<DisplayMessage[]>;
  placeholder?: string;
  pollMs?: number;
  emptyLabel?: string;
  readOnly?: boolean;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (fetchAction) {
        fetchAction().then(setMessages);
      } else {
        router.refresh();
      }
    }, pollMs);
    return () => clearInterval(interval);
  }, [router, pollMs, fetchAction]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || sending || !sendAction) return;
    setSending(true);
    setError(null);
    const result = await sendAction(trimmed);
    setSending(false);
    if (result.ok) {
      setText("");
      if (fetchAction) {
        setMessages(await fetchAction());
      } else {
        router.refresh();
      }
    } else {
      setError(result.error || "Couldn't send that.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="max-h-72 overflow-y-auto space-y-2 bg-white/60 rounded-lg p-3 border border-mystery-brown/15">
        {messages.length === 0 ? (
          <p className="text-sm text-mystery-brown/50 text-center py-4">{emptyLabel}</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.isMine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  m.isMine
                    ? "bg-mystery-orange text-white"
                    : "bg-mystery-brown/10 text-mystery-brown"
                }`}
              >
                {!m.isMine && (
                  <p className="text-xs font-semibold opacity-70 mb-0.5">{m.senderLabel}</p>
                )}
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {!readOnly && sendAction && (
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={placeholder}
            className="mystery-input flex-1 !text-sm"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !text.trim()}
            className="mystery-btn !text-sm !py-2 !px-4 disabled:opacity-50"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}
