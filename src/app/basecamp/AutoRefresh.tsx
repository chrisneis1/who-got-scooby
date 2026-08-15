"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Near-live updates: quietly refreshes server data every 20s. */
export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 20000);
    return () => clearInterval(interval);
  }, [router]);

  return null;
}
