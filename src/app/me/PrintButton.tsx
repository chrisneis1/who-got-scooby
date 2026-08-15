"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="mystery-btn">
      🖨️ Print Character Sheet
    </button>
  );
}
