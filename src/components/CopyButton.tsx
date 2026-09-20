"use client";

import { useState } from "react";

export default function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — silently ignore, the number is already visible on screen.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-line px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brass hover:text-brass"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
