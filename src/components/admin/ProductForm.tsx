"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Brand = { id: string; name: string };

type ExistingProduct = {
  id: string;
  brandId: string;
  category: "SMARTPHONE" | "POWER_BANK";
  model: string;
  shortDesc: string;
  fullDesc: string;
  ram: string | null;
  storage: string | null;
  color: string | null;
  specs: string | null;
  available: boolean;
  featured: boolean;
  easyBuy: boolean;
  visible: boolean;
  images: { url: string }[];
};

export default function ProductForm({ brands, product }: { brands: Brand[]; product?: ExistingProduct }) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [brandId, setBrandId] = useState(product?.brandId || brands[0]?.id || "");
  const [category, setCategory] = useState<"SMARTPHONE" | "POWER_BANK">(product?.category || "SMARTPHONE");
  const [model, setModel] = useState(product?.model || "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc || "");
  const [fullDesc, setFullDesc] = useState(product?.fullDesc || "");
  const [ram, setRam] = useState(product?.ram || "");
  const [storage, setStorage] = useState(product?.storage || "");
  const [color, setColor] = useState(product?.color || "");
  const [specs, setSpecs] = useState(product?.specs || "");
  const [available, setAvailable] = useState(product?.available ?? true);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [easyBuy, setEasyBuy] = useState(product?.easyBuy ?? false);
  const [visible, setVisible] = useState(product?.visible ?? true);
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images.map((i) => i.url) || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "aajoscomm/products");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImageUrls((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      brandId,
      category,
      model,
      shortDesc,
      fullDesc,
      ram,
      storage,
      color,
      specs,
      available,
      featured,
      easyBuy,
      visible,
      imageUrls,
    };

    try {
      const res = await fetch(isEdit ? `/api/products/${product!.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Please check the form and try again.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs text-ink/60">Brand</label>
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            required
            className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-ink/60">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "SMARTPHONE" | "POWER_BANK")}
            className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
          >
            <option value="SMARTPHONE">Smartphone</option>
            <option value="POWER_BANK">Power bank</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-ink/60">Model name</label>
        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          placeholder="e.g. HOT 70, Galaxy S26 Ultra"
          className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
        />
      </div>

      <div>
        <label className="text-xs text-ink/60">Short description (shown on product cards)</label>
        <input
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          required
          maxLength={160}
          className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
        />
      </div>

      <div>
        <label className="text-xs text-ink/60">Full description</label>
        <textarea
          value={fullDesc}
          onChange={(e) => setFullDesc(e.target.value)}
          required
          rows={5}
          className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs text-ink/60">RAM</label>
          <input
            value={ram}
            onChange={(e) => setRam(e.target.value)}
            placeholder="e.g. 8GB"
            className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="text-xs text-ink/60">Storage</label>
          <input
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            placeholder="e.g. 128GB"
            className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
          />
        </div>
        <div>
          <label className="text-xs text-ink/60">Color</label>
          <input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Midnight Black"
            className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-ink/60">Key specifications (one per line, optional)</label>
        <textarea
          value={specs}
          onChange={(e) => setSpecs(e.target.value)}
          rows={4}
          placeholder={"6.7-inch AMOLED display\n5000mAh battery\n50MP main camera"}
          className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
        />
      </div>

      <div>
        <label className="text-xs text-ink/60">Product images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-1 block w-full text-sm"
        />
        {uploading && <p className="mt-1 text-xs text-ink/50">Uploading…</p>}
        {imageUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {imageUrls.map((url) => (
              <div key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-20 w-20 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-xs text-paper"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} />
          Available
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={easyBuy} onChange={(e) => setEasyBuy(e.target.checked)} />
          EasyBuy available
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Visible on site
        </label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}
