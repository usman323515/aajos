"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  category: string | null;
  visible: boolean;
};

export default function GalleryManager({ images }: { images: GalleryImage[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("Shop");
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "aajoscomm/gallery");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: uploadData.url, category }),
        });
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function toggleVisible(image: GalleryImage) {
    await fetch(`/api/gallery/${image.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !image.visible }),
    });
    router.refresh();
  }

  async function handleDelete(image: GalleryImage) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/gallery/${image.id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-ink/60">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block rounded border border-line bg-white px-3 py-2 text-sm"
          >
            <option>Shop</option>
            <option>Abdul Jos</option>
            <option>Phones</option>
            <option>Business activities</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-ink/60">Upload images</label>
          <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} className="mt-1 block text-sm" />
        </div>
        {uploading && <p className="text-xs text-ink/50">Uploading…</p>}
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="border border-line bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.caption || ""} className="aspect-square w-full object-cover" />
            <p className="mt-2 text-xs text-ink/50">{image.category}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => toggleVisible(image)}
                className={`flex-1 rounded-full border px-2 py-1 text-xs ${
                  image.visible ? "border-line text-ink/70" : "border-red-300 text-red-500"
                }`}
              >
                {image.visible ? "Visible" : "Hidden"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(image)}
                className="flex-1 rounded-full border border-line px-2 py-1 text-xs text-red-500 hover:border-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
