import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE = "admin_session";

function getSecret(): string {
  return process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";
}

function computeAdminToken(): string {
  return crypto.createHmac("sha256", getSecret()).update("admin-authenticated").digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function getAdminTokenValue(): string {
  return computeAdminToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = computeAdminToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
