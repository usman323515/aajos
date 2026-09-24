import crypto from "crypto";
import { getSupabaseAdmin, UPLOAD_BUCKET } from "./supabase";

/**
 * Netlify's deployed functions run on a read-only, ephemeral filesystem,
 * so product/gallery photos uploaded from /admin cannot be written to
 * /public at runtime. This adapter uploads to Supabase Storage instead and
 * returns the resulting public HTTPS URL, which is what gets stored on the
 * Product/GalleryImage rows.
 *
 * This runs server-side only (called from src/app/api/upload/route.ts,
 * which sets `export const runtime = "nodejs"`) using the Supabase admin
 * client authenticated with SUPABASE_SECRET_KEY. That key never reaches
 * the browser.
 *
 * To swap providers again, replace the body of uploadImage() — every
 * caller in the app only depends on this function.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const supabase = getSupabaseAdmin();

  const originalExt = file.name.includes(".") ? file.name.split(".").pop() : undefined;
  const ext = (originalExt || file.type.split("/")[1] || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
  const path = `${folder}/${filename}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from(UPLOAD_BUCKET)
    .upload(path, Buffer.from(arrayBuffer), {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(UPLOAD_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
