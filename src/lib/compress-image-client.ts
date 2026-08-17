"use client";

/**
 * Downscales and re-encodes an image file in the browser before upload.
 * Phone photos routinely run 2-8MB at full resolution, but every portrait on
 * this site only ever renders as a small thumbnail — storing them full-size
 * as base64 in the DB (and re-transferring that on every Basecamp poll) is
 * what was overloading the free-tier host. Shrinking client-side, before the
 * upload, avoids adding any server-side image-processing dependency.
 */
export async function compressImageFile(
  file: File,
  maxDimension = 640,
  quality = 0.82
): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality)
  );
  if (!blob || blob.size >= file.size) return file;

  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}
