"use client";

export default function ResetGuestsButton({
  action,
  guestCount,
}: {
  action: () => void;
  guestCount: number;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const confirmed = window.confirm(
          `Delete all ${guestCount} guest(s) and unclaim every character? This can't be undone.`
        );
        if (!confirmed) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="text-xs font-semibold text-red-700 border-2 border-red-300 hover:bg-red-50 rounded-full px-3 py-1.5"
      >
        🗑️ Reset All Guests
      </button>
    </form>
  );
}
