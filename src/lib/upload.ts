import crypto from "crypto";

/**
 * Netlify's deployed functions run on a read-only, ephemeral filesystem,
 * so product/gallery photos uploaded from /admin cannot be written to
 * /public at runtime. This adapter uploads to Cloudinary instead and
 * returns the resulting HTTPS URL, which is what gets stored on the
 * Product/GalleryImage rows.
 *
 * To swap providers (S3, Supabase Storage, etc.), replace the body of
 * uploadImage() — every caller in the app only depends on this function.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Image uploads are not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const body = new FormData();
  body.append("file", dataUri);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body }
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Image upload failed: ${detail}`);
  }

  const json = (await response.json()) as { secure_url: string };
  return json.secure_url;
}
