import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sun, Moon } from "lucide-react";
import { useMisaq } from "@/components/misaq/providers";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Logo } from "@/components/misaq/logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/theme")({ component: ThemePick });

function ThemePick() {
  const { theme, setTheme, t } = useMisaq();
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col px-6 pb-10 pt-14">
        <Logo size={44} withWord />
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("theme.step")}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight">{t("theme.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("theme.hint")}</p>
        </div>

        <div className="mt-8 grid gap-4">
          <ThemeCard active={theme === "light"} onClick={() => setTheme("light")} label={t("theme.light")} desc={t("theme.lightDesc")} icon={<Sun className="h-5 w-5" />}
            preview={<div className="h-24 rounded-2xl border border-border bg-gradient-cream" />}
          />
          <ThemeCard active={theme === "dark"} onClick={() => setTheme("dark")} label={t("theme.dark")} desc={t("theme.darkDesc")} icon={<Moon className="h-5 w-5" />}
            preview={<div className="h-24 rounded-2xl bg-gradient-royal" />}
          />
        </div>

        <button onClick={() => navigate({ to: "/onboarding/language" })} className="mt-auto w-full rounded-full bg-primary py-4 font-medium text-primary-foreground shadow-elegant">
          {t("common.continue")}
        </button>
      </div>
    </PhoneFrame>
  );
}

function ThemeCard({ active, onClick, label, desc, icon, preview }: { active: boolean; onClick: () => void; label: string; desc: string; icon: React.ReactNode; preview: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("w-full rounded-3xl border p-4 text-start transition-all", active ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/40")}>
      {preview}
      <div className="mt-3 flex items-center gap-3">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-none">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
        </div>
        <div className={cn("ms-auto h-4 w-4 shrink-0 rounded-full border-2", active ? "border-primary bg-primary" : "border-border")} />
      </div>
    </button>
  );
}
