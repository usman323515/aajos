"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type Row = {
  id: string;
  model: string;
  slug: string;
  available: boolean;
  featured: boolean;
  easyBuy: boolean;
  visible: boolean;
  brand: { name: string };
};

export default function ProductRowActions({ product }: { product: Row }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle(field: "available" | "featured" | "easyBuy" | "visible", value: boolean) {
    setBusy(true);
    try {
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${product.brand.name} ${product.model}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => toggle("available", !product.available)}
        className={`rounded-full border px-3 py-1 text-xs ${
          product.available ? "border-signal text-signal" : "border-line text-ink/50"
        }`}
      >
        {product.available ? "In stock" : "Out of stock"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => toggle("featured", !product.featured)}
        className={`rounded-full border px-3 py-1 text-xs ${
          product.featured ? "border-brass text-brass" : "border-line text-ink/50"
        }`}
      >
        {product.featured ? "Featured" : "Not featured"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => toggle("easyBuy", !product.easyBuy)}
        className={`rounded-full border px-3 py-1 text-xs ${
          product.easyBuy ? "border-ink text-ink" : "border-line text-ink/50"
        }`}
      >
        EasyBuy {product.easyBuy ? "on" : "off"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => toggle("visible", !product.visible)}
        className={`rounded-full border px-3 py-1 text-xs ${
          product.visible ? "border-line text-ink/70" : "border-red-300 text-red-500"
        }`}
      >
        {product.visible ? "Visible" : "Hidden"}
      </button>

      <Link href={`/admin/products/${product.id}`} className="rounded-full border border-line px-3 py-1 text-xs text-ink/70 hover:border-brass hover:text-brass">
        Edit
      </Link>
      <button
        type="button"
        disabled={busy}
        onClick={handleDelete}
        className="rounded-full border border-line px-3 py-1 text-xs text-red-500 hover:border-red-400"
      >
        Delete
      </button>
    </div>
  );
}
