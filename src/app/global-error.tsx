"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center text-ink">
        <p className="font-display text-6xl text-ink/20">500</p>
        <h1 className="mt-4 text-2xl">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-ink/60">
          We couldn't load this page. Please try again, or contact us on WhatsApp if the problem continues.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
