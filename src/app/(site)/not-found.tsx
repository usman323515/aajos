import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-6xl text-ink/20">404</p>
      <h1 className="mt-4 text-2xl">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink/60">
        The page you're looking for doesn't exist, or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-90"
      >
        Back to homepage
      </Link>
    </div>
  );
}
