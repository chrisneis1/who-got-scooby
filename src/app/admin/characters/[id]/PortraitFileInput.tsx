"use client";

import { useRef, useState } from "react";
import { compressImageFile } from "@/lib/compress-image-client";

export default function PortraitFileInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFileChange() {
    const input = inputRef.current;
    const file = input?.files?.[0];
    if (!input || !file) return;
    setBusy(true);
    try {
      const compressed = await compressImageFile(file);
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(compressed);
      input.files = dataTransfer.files;
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        name="portrait_file"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mystery-input w-full text-sm"
      />
      {busy && <p className="text-xs text-mystery-brown/60 mt-1">Preparing image...</p>}
    </>
  );
}
