"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

type Brand = { id: string; name: string; slug: string };
type Product = {
  id: string;
  slug: string;
  model: string;
  shortDesc: string;
  available: boolean;
  easyBuy: boolean;
  featured: boolean;
  category: "SMARTPHONE" | "POWER_BANK";
  brand: { name: string; slug: string };
  images: { url: string; alt: string | null }[];
};

export default function ProductBrowser({
  whatsapp,
  businessPublicName,
}: {
  whatsapp: string;
  businessPublicName: string;
}) {
  const searchParams = useSearchParams();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [easyBuyOnly, setEasyBuyOnly] = useState(false);

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => r.json())
      .then((data) => setBrands(data.brands || []));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    if (availability) params.set("availability", availability);
    if (easyBuyOnly) params.set("easyBuy", "true");

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [search, brand, category, availability, easyBuyOnly]);

  const activeFilterCount = useMemo(
    () => [brand, category, availability, easyBuyOnly].filter(Boolean).length,
    [brand, category, availability, easyBuyOnly]
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search phones — e.g. HOT 70, Galaxy, Pixel"
          className="w-full rounded-full border border-line bg-white px-5 py-3 text-sm outline-none focus:border-brass md:max-w-sm"
        />
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={() => {
              setBrand("");
              setCategory("");
              setAvailability("");
              setEasyBuyOnly(false);
            }}
            className="text-sm text-ink/50 underline hover:text-brass"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm"
        >
          <option value="">All brands</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm"
        >
          <option value="">All categories</option>
          <option value="SMARTPHONE">Smartphones</option>
          <option value="POWER_BANK">Power banks</option>
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm"
        >
          <option value="">Any availability</option>
          <option value="available">In stock</option>
          <option value="out">Out of stock</option>
        </select>

        <label className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm">
          <input
            type="checkbox"
            checked={easyBuyOnly}
            onChange={(e) => setEasyBuyOnly(e.target.checked)}
          />
          EasyBuy only
        </label>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-sm text-ink/50">Loading phones…</p>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-line py-16 text-center">
            <p className="font-display text-lg">No phones found</p>
            <p className="mt-2 text-sm text-ink/60">
              Try a different search term, or ask us directly on WhatsApp — new stock arrives regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsapp={whatsapp}
                businessPublicName={businessPublicName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
