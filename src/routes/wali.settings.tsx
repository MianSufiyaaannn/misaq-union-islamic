import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { User, ShieldCheck, Bell, Globe, Palette, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/wali/settings")({ component: WaliSettings });

const items = [
  { i: User, l: "Profile & verification" },
  { i: ShieldCheck, l: "Ward's privacy controls" },
  { i: Bell, l: "Notifications" },
  { i: Globe, l: "Language" },
  { i: Palette, l: "Theme" },
];

function WaliSettings() {
  return (
    <div className="pb-8">
      <TopBar title="Wali settings" back={false} />
      <div className="p-4">
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {items.map((it) => (
            <li key={it.l} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><it.i className="h-4 w-4" /></span>
              <span className="flex-1 text-sm">{it.l}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3 text-sm font-medium text-destructive">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );
}
