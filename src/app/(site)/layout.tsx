import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileActionBar from "@/components/MobileActionBar";
import { getSettings } from "@/lib/settings";

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
