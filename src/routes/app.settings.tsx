import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { useMisaq } from "@/components/misaq/providers";
import { User, Lock, Bell, Globe, Palette, Sparkles, HelpCircle, FileText, LogOut, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

const groups = [
  { title: "Account", items: [
    { i: User, l: "My account" },
    { i: ShieldCheck, l: "Privacy" },
    { i: Lock, l: "Security & 2FA" },
    { i: Bell, l: "Notifications" },
  ]},
  { title: "Preferences", items: [
    { i: Globe, l: "Language" },
    { i: Palette, l: "Theme" },
    { i: Sparkles, l: "Misaq Premium" },
  ]},
  { title: "Support", items: [
    { i: HelpCircle, l: "Help centre" },
    { i: FileText, l: "About Misaq" },
    { i: FileText, l: "Terms of service" },
    { i: FileText, l: "Privacy policy" },
  ]},
];

function SettingsPage() {
  const { theme, setTheme, lang, setLang } = useMisaq();
  return (
    <div className="pb-8">
      <TopBar title="Settings" back={false} />
      <div className="px-4 py-4 space-y-6">
        <div className="rounded-3xl border border-border bg-card p-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={cn("rounded-2xl border py-2 text-sm capitalize", theme === t ? "border-primary bg-primary/10 text-primary" : "border-border")}>{t}</button>
            ))}
          </div>
          <p className="mt-4 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Language</p>
          <div className="grid grid-cols-3 gap-2">
            {(["en", "ur", "ru"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={cn("rounded-2xl border py-2 text-sm", lang === l ? "border-primary bg-primary/10 text-primary" : "border-border")}>
                {l === "en" ? "English" : l === "ur" ? "اُردُو" : "Roman"}
              </button>
            ))}
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-2 px-2 text-[10px] uppercase tracking-widest text-muted-foreground">{g.title}</p>
            <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
              {g.items.map((it) => (
                <li key={it.l} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><it.i className="h-4 w-4" /></span>
                  <span className="flex-1 text-sm">{it.l}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3 text-sm font-medium text-destructive">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </div>
  );
}
