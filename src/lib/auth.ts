import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "aajoscomm_admin_session";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a long random value in your environment variables."
    );
  }
  return new TextEncoder().encode(secret);
}

function getSessionHours() {
  const raw = process.env.AUTH_SESSION_HOURS;
  const hours = raw ? Number(raw) : 12;
  return Number.isFinite(hours) && hours > 0 ? hours : 12;
}

export type SessionPayload = {
  sub: string; // admin user id
  email: string;
  name: string;
  role: "OWNER" | "STAFF";
};

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createSessionToken(payload: SessionPayload) {
  const hours = getSessionHours();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${hours}h`)
    .sign(getSecretKey());
}

export async function readSessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions(hours: number) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: hours * 60 * 60,
  };
}

export function getSessionCookieName() {
  return COOKIE_NAME;
}

/** Reads and verifies the current admin session from the request cookies. */
export async function getCurrentAdmin(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return readSessionToken(token);
}
