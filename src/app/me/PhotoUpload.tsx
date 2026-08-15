import { guestUpdatePortraitAction } from "@/lib/actions";

export default function PhotoUpload() {
  return (
    <form action={guestUpdatePortraitAction} className="flex flex-wrap items-center justify-center gap-2">
      <input
        name="portrait_file"
        type="file"
        accept="image/*"
        required
        className="mystery-input text-sm !py-1.5"
      />
      <button type="submit" className="mystery-btn mystery-btn-secondary !text-sm !py-1.5 !px-3">
        Update Photo
      </button>
    </form>
  );
}
