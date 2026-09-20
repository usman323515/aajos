import { getStoredSettings } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getStoredSettings();

  return (
    <div>
      <h1 className="font-display text-2xl">Business settings</h1>
      <p className="mt-1 text-sm text-ink/60">
        Changes here update the live website immediately — no code changes needed.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
