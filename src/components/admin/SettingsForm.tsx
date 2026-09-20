"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SettingsData = {
  businessName: string;
  ceoName: string;
  ceoPublicName: string;
  phone: string;
  whatsapp: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  country: string;
  mapUrl: string | null;
  openingTime: string;
  closingTime: string;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  shopVideoUrl: string | null;
  moniepointAccountNumber: string | null;
  moniepointAccountName: string | null;
  opayAccountNumber: string | null;
  opayAccountName: string | null;
  easyBuyDescription: string | null;
};

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-ink/60">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
      />
    </div>
  );
}

export default function SettingsForm({ settings }: { settings: SettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    ...settings,
    addressLine2: settings.addressLine2 || "",
    mapUrl: settings.mapUrl || "",
    tiktokUrl: settings.tiktokUrl || "",
    facebookUrl: settings.facebookUrl || "",
    shopVideoUrl: settings.shopVideoUrl || "",
    moniepointAccountNumber: settings.moniepointAccountNumber || "",
    moniepointAccountName: settings.moniepointAccountName || "",
    opayAccountNumber: settings.opayAccountNumber || "",
    opayAccountName: settings.opayAccountName || "",
    easyBuyDescription: settings.easyBuyDescription || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Please check the form and try again.");
        return;
      }
      setMessage("Saved.");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="font-display text-lg">Business identity</h2>
        <Field label="Business name" value={form.businessName} onChange={(v) => update("businessName", v)} />
        <Field label="CEO full name" value={form.ceoName} onChange={(v) => update("ceoName", v)} />
        <Field label="CEO public name" value={form.ceoPublicName} onChange={(v) => update("ceoPublicName", v)} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone number" value={form.phone} onChange={(v) => update("phone", v)} />
          <Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Location &amp; hours</h2>
        <Field label="Address line 1" value={form.addressLine1} onChange={(v) => update("addressLine1", v)} />
        <Field label="Address line 2" value={form.addressLine2} onChange={(v) => update("addressLine2", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="City / state" value={form.city} onChange={(v) => update("city", v)} />
          <Field label="Country" value={form.country} onChange={(v) => update("country", v)} />
        </div>
        <Field
          label="Google Maps link (optional)"
          value={form.mapUrl}
          onChange={(v) => update("mapUrl", v)}
          placeholder="https://maps.app.goo.gl/..."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Opening time" value={form.openingTime} onChange={(v) => update("openingTime", v)} />
          <Field label="Closing time" value={form.closingTime} onChange={(v) => update("closingTime", v)} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Social &amp; video</h2>
        <Field label="TikTok URL" value={form.tiktokUrl} onChange={(v) => update("tiktokUrl", v)} />
        <Field label="Facebook URL" value={form.facebookUrl} onChange={(v) => update("facebookUrl", v)} />
        <Field label="Shop video URL (YouTube)" value={form.shopVideoUrl} onChange={(v) => update("shopVideoUrl", v)} />
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">Payment accounts</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Moniepoint account number" value={form.moniepointAccountNumber} onChange={(v) => update("moniepointAccountNumber", v)} />
          <Field label="Moniepoint account name" value={form.moniepointAccountName} onChange={(v) => update("moniepointAccountName", v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="OPay account number" value={form.opayAccountNumber} onChange={(v) => update("opayAccountNumber", v)} />
          <Field label="OPay account name" value={form.opayAccountName} onChange={(v) => update("opayAccountName", v)} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg">EasyBuy</h2>
        <div>
          <label className="text-xs text-ink/60">EasyBuy description</label>
          <textarea
            value={form.easyBuyDescription}
            onChange={(e) => update("easyBuyDescription", e.target.value)}
            rows={3}
            className="mt-1 w-full rounded border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brass"
          />
        </div>
      </section>

      {message && <p className="text-sm text-signal">{message}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-paper hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
