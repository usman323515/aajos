import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/prisma";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-paper">
      <div className="flex flex-col md:flex-row">
        <aside className="border-b border-line bg-ink text-paper md:min-h-screen md:w-60 md:border-b-0 md:border-r">
          <div className="p-5">
            <p className="font-display text-lg">A,A JOS COMM</p>
            <p className="mt-0.5 text-xs text-paper/50">Admin dashboard</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-5 pb-4 md:flex-col md:gap-0 md:overflow-visible md:px-0 md:pb-0">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded md:rounded-none px-3 py-2 text-sm text-paper/80 hover:bg-lineDark hover:text-paper md:px-5"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto hidden border-t border-lineDark p-5 md:block">
            {admin && <p className="text-xs text-paper/50">Signed in as {admin.name}</p>}
            <div className="mt-3">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <div className="flex-1 p-5 md:p-10">
          <div className="mb-6 flex justify-end md:hidden">
            <LogoutButton />
          </div>
          {isDatabaseConfigured() ? (
            children
          ) : (
            <div className="border border-dashed border-line p-10 text-center">
              <p className="font-display text-lg">Database not connected</p>
              <p className="mt-2 text-sm text-ink/60">
                Products, gallery and settings can be managed once a database is configured for this site.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
