import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client, authenticated with the SECRET (service role)
 * key. This module must never be imported from a Client Component, a
 * browser bundle, or anything under `"use client"` — SUPABASE_SECRET_KEY
 * bypasses Row Level Security and must stay on the server.
 *
 * Current callers: src/lib/upload.ts (storage) and
 * src/app/api/auth/login/route.ts (AdminUser lookup). Both only run inside
 * API routes with `export const runtime = "nodejs"`, which is the only
 * place this should be imported from.
 */

let cached: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL?.trim() && process.env.SUPABASE_SECRET_KEY?.trim());
}

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
  }

  cached = createClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return cached;
}

/** Bucket that holds all application uploads (products, gallery, misc). */
export const UPLOAD_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "aajoscomm-uploads";
