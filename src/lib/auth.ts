import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "abdulrhman_admin";
// Default fallback so the panel works out of the box; override in production.
const SECRET = process.env.ADMIN_PASSWORD || "abdulrhman-admin-2026";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours

function sign(exp: number): string {
  const mac = crypto.createHmac("sha256", SECRET).update(String(exp)).digest("hex");
  return `${exp}.${mac}`;
}

function verify(token: string | undefined): boolean {
  if (!token) return false;
  const [expStr, mac] = token.split(".");
  if (!expStr || !mac) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(exp).split(".")[1] ?? "";
  if (mac.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verify(store.get(COOKIE_NAME)?.value);
}

export async function createSession(): Promise<void> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const store = await cookies();
  store.set(COOKIE_NAME, sign(exp), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "abdulrhman-admin-2026";
  if (password.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}
