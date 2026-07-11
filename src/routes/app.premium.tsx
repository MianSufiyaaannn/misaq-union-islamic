import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/app/premium")({ component: Premium });

function Premium() {
  const t = useT();
  const plans = [
    { name: "Silver", price: "₨ 1,499", per: "/mo", features: ["10 proposals / month", t("profile.verified"), "Priority in search", t("wali.title")] },
    { name: "Gold", price: "₨ 3,499", per: "/mo", features: ["Unlimited proposals", "See who viewed you", "Advanced filters", `${t("call.voice")} + ${t("call.video")}`, "Featured profile"], best: true },
    { name: "Platinum", price: "₨ 6,999", per: "/mo", features: ["Everything in Gold", "Personal matchmaker", "Priority verification", "Family concierge", "Nikah planning support"] },
  ];
  return (
    <div className="pb-24">
      <div className="relative overflow-hidden bg-gradient-royal px-6 pb-14 pt-14 text-white">
        <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-[color:var(--color-gold)]/30 blur-3xl" />
        <TopBar back tone="light" transparent />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-gold)]">{t("premium.eyebrow")}</p>
          <h1 className="mt-2 font-display text-3xl leading-tight">{t("premium.title")}</h1>
          <p className="mt-2 max-w-[320px] text-sm text-white/75">{t("premium.subtitle")}</p>
        </div>
      </div>

      <div className="-mt-8 space-y-4 px-5">
        {plans.map((p) => (
          <div key={p.name} className={cn(
            "relative overflow-hidden rounded-3xl border p-5 shadow-elegant",
            p.best ? "border-gold/60 bg-gradient-to-br from-card to-gold/10" : "border-border bg-card",
          )}>
            {p.best && (
              <span className="absolute end-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-gold-foreground)]">{t("premium.mostChosen")}</span>
            )}
            <p className={cn("font-display text-2xl", p.best ? "text-primary" : "")}>{p.name}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-3xl">{p.price}</span>
              <span className="text-xs text-muted-foreground">{p.per}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full", p.best ? "bg-gradient-gold text-[color:var(--color-gold-foreground)]" : "bg-primary/10 text-primary")}>
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="min-w-0 truncate">{f}</span>
                </li>
              ))}
            </ul>
            <button className={cn("mt-5 w-full rounded-full py-3 font-medium",
              p.best ? "bg-gradient-primary text-white shadow-elegant" : "border border-border text-foreground")}>
              {t("premium.choose")} {p.name}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-6 px-6 text-center text-[11px] text-muted-foreground">{t("premium.footer")}</p>
    </div>
  );
}
