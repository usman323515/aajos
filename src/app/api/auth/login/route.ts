import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { dbUnavailable } from "@/lib/api";
import { createSessionToken, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

/**
 * AdminUser lookups go through the Supabase server client (service-role
 * key) instead of Prisma, so this route has its own DB round-trip that
 * doesn't share Prisma's connection pool. Login/session logic itself is
 * unchanged: bcrypt password check + our own signed JWT cookie — Supabase
 * Auth is not involved.
 */
type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "OWNER" | "STAFF";
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) return dbUnavailable();
  const supabase = getSupabaseAdmin();

  const { email, password } = parsed.data;

  const { data, error: fetchError } = await supabase
    .from("AdminUser")
    .select("id, email, name, passwordHash, role")
    .eq("email", email)
    .maybeSingle();

  if (fetchError) {
    console.error("[auth] AdminUser lookup failed:", fetchError.message);
    return dbUnavailable();
  }

  const user = data as AdminUserRow | null;

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

  const { error: updateError } = await supabase
    .from("AdminUser")
    .update({ lastLoginAt: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) {
    // Non-critical — don't block a valid login on this.
    console.error("[auth] Failed to update lastLoginAt:", updateError.message);
  }

  const res = NextResponse.json({ ok: true });
  const cookieOpts = sessionCookieOptions(hours);
  res.cookies.set(cookieOpts.name, token, cookieOpts);
  return res;
}
