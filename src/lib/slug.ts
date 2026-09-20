import slugify from "slugify";

/** Builds a URL-safe slug from a brand and model, e.g. "infinix-hot-70". */
export function buildProductSlug(brandName: string, model: string): string {
  return slugify(`${brandName}-${model}`, { lower: true, strict: true });
}
