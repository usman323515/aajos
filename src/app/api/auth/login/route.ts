import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { dbUnavailable } from "@/lib/api";
import { createSessionToken, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const db = getPrisma();
  if (!db) return dbUnavailable();

  const { email, password } = parsed.data;

  const user = await db.adminUser.findUnique({ where: { email } });
  if (!user) {
    // Same message as a wrong password — never reveal whether the email exists.
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const hours = Number(process.env.AUTH_SESSION_HOURS ?? 12) || 12;
  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await db.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const res = NextResponse.json({ ok: true });
  const cookieOpts = sessionCookieOptions(hours);
  res.cookies.set(cookieOpts.name, token, cookieOpts);
  return res;
}
