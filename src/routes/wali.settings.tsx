import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { User, ShieldCheck, Bell, Globe, Palette, LogOut, ChevronRight } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/wali/settings")({ component: WaliSettings });

function WaliSettings() {
  const t = useT();
  const items = [
    { i: User, l: t("wali.set.profile") },
    { i: ShieldCheck, l: t("wali.set.privacy") },
    { i: Bell, l: t("wali.set.notif") },
    { i: Globe, l: t("wali.set.lang") },
    { i: Palette, l: t("wali.set.theme") },
  ];
  return (
    <div className="pb-8">
      <TopBar title={t("wali.settings.title")} back={false} />
      <div className="p-4">
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {items.map((it) => (
            <li key={it.l} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><it.i className="h-4 w-4" /></span>
              <span className="flex-1 text-sm min-w-0 truncate">{it.l}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
            </li>
          ))}
        </ul>
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3 text-sm font-medium text-destructive">
          <LogOut className="h-4 w-4" /> {t("settings.logout")}
        </button>
      </div>
    </div>
  );
}
