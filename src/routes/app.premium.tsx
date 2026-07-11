import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const Route = createFileRoute("/app/premium")({ component: Premium });

const plans = [
  { name: "Silver", price: "₨ 1,499", per: "/mo", tone: "silver", features: ["10 proposals / month", "Verified badge", "Priority in search", "Wali dashboard"] },
  { name: "Gold", price: "₨ 3,499", per: "/mo", tone: "gold", features: ["Unlimited proposals", "See who viewed you", "Advanced filters", "Voice & video calls", "Featured profile"], best: true },
  { name: "Platinum", price: "₨ 6,999", per: "/mo", tone: "platinum", features: ["Everything in Gold", "Personal matchmaker", "Priority verification", "Family concierge", "Nikah planning support"] },
];

function Premium() {
  return (
    <div className="pb-24">
      <div className="relative overflow-hidden bg-gradient-royal px-6 pb-14 pt-14 text-white">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[color:var(--color-gold)]/30 blur-3xl" />
        <TopBar back tone="light" transparent />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-gold)]">Misaq Premium</p>
          <h1 className="mt-2 font-display text-3xl leading-tight">Invest in a purposeful search.</h1>
          <p className="mt-2 max-w-[280px] text-sm text-white/75">Members with Premium receive up to 4× more sincere proposals — with families involved from the first hello.</p>
        </div>
      </div>

      <div className="-mt-8 space-y-4 px-5">
        {plans.map((p) => (
          <div key={p.name} className={cn(
            "relative overflow-hidden rounded-3xl border p-5 shadow-elegant",
            p.best ? "border-gold/60 bg-gradient-to-br from-card to-gold/10" : "border-border bg-card",
          )}>
            {p.best && (
              <span className="absolute right-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-gold-foreground)]">Most chosen</span>
            )}
            <p className={cn("font-display text-2xl", p.best ? "text-primary" : "")}>{p.name}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-3xl">{p.price}</span>
              <span className="text-xs text-muted-foreground">{p.per}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className={cn("flex h-5 w-5 items-center justify-center rounded-full", p.best ? "bg-gradient-gold text-[color:var(--color-gold-foreground)]" : "bg-primary/10 text-primary")}>
                    <Check className="h-3 w-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={cn("mt-5 w-full rounded-full py-3 font-medium",
              p.best ? "bg-gradient-primary text-white shadow-elegant" : "border border-border text-foreground")}>
              Choose {p.name}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-6 px-6 text-center text-[11px] text-muted-foreground">All plans are halal-compliant subscriptions. Cancel anytime.</p>
    </div>
  );
}
