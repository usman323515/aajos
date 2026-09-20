import { NextResponse } from "next/server";

/** 503 response for API routes when the database is not configured. `extra` keeps the usual response shape (e.g. `{ products: [] }`). */
export function dbUnavailable(extra: Record<string, unknown> = {}) {
  return NextResponse.json(
    { error: "The database is not available. This feature is temporarily disabled.", ...extra },
    { status: 503 }
  );
}
