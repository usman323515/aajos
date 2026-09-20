import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import { getSettings } from "@/lib/settings";

// Render on every request: content comes from the database at runtime (never baked in at build time,
// so the build does not need DATABASE_URL and admin edits show up immediately).
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer settings={settings} />
      <MobileActionBar settings={settings} />
    </>
  );
}
