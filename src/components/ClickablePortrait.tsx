"use client";

import { useState } from "react";

export default function ClickablePortrait({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto block cursor-zoom-in"
        aria-label={`View ${alt}'s photo full size`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={className} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed top-4 right-4 text-white text-3xl leading-none w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 rounded-full"
            aria-label="Close"
          >
            &times;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full rounded-lg shadow-2xl cursor-auto"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
