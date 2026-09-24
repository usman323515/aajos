import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase JS client, for Storage/Auth/Realtime features beyond what Prisma
 * covers for the database itself.
 *
 * Two entry points, same "optional at runtime" pattern as prisma.ts:
 *
 * - `getSupabaseBrowserClient()` — anon key only. Safe to import from
 *   client components; respects Row Level Security.
 * - `getSupabaseAdminClient()`   — service_role key. Server-only
 *   (API routes, server actions). Bypasses RLS — never import this
 *   from a client component or expose its result to the browser.
 */

const globalForSupabase = globalThis as unknown as {
  supabaseBrowser?: SupabaseClient;
  supabaseAdmin?: SupabaseClient;
  supabaseWarningShown?: boolean;
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function isSupabaseAdminConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}

/**
 * Browser-safe client. Uses the anon key, so it only sees what your
 * Row Level Security policies allow. Fine to call from client components.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    if (!globalForSupabase.supabaseWarningShown) {
      globalForSupabase.supabaseWarningShown = true;
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Supabase-backed features are disabled."
      );
    }
    return null;
  }

  if (!globalForSupabase.supabaseBrowser) {
    globalForSupabase.supabaseBrowser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return globalForSupabase.supabaseBrowser;
}

/**
 * Server-only admin client. Uses the service_role key, which bypasses RLS.
 * NEVER import this file's admin client into a "use client" component, and
 * never send its query results straight to the browser without checking
 * the caller is authorized — it can read/write anything in the project.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error(
      "getSupabaseAdminClient() was called in the browser. The service_role key must never reach the client."
    );
  }

  if (!isSupabaseAdminConfigured()) {
    if (!globalForSupabase.supabaseWarningShown) {
      globalForSupabase.supabaseWarningShown = true;
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set. Supabase admin features are disabled."
      );
    }
    return null;
  }

  if (!globalForSupabase.supabaseAdmin) {
    globalForSupabase.supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return globalForSupabase.supabaseAdmin;
}

export function requireSupabaseAdmin(): SupabaseClient {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error(
      "Supabase admin client is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return client;
}
