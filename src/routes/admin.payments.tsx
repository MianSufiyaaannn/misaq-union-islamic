import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/payments")({ component: AdminPayments });

const rows = [
  { u: "Aisha Rahman", plan: "Gold", amt: "₨ 3,499", statusKey: "success", dateKey: "today" as const },
  { u: "Hamza Siddiqui", plan: "Silver", amt: "₨ 1,499", statusKey: "success", dateKey: "today" as const },
  { u: "Khadija Malik", plan: "Platinum", amt: "₨ 6,999", statusKey: "success", dateKey: "yesterday" as const },
  { u: "Bilal Ahmed", plan: "Gold", amt: "₨ 3,499", statusKey: "refund", dateKey: "yesterday" as const },
  { u: "Fatima Noor", plan: "Silver", amt: "₨ 1,499", statusKey: "failed", dateKey: "earlier" as const },
];

function AdminPayments() {
  const t = useT();
  const dateLabel = (k: "today" | "yesterday" | "earlier") =>
    k === "today" ? t("common.today") : k === "yesterday" ? t("common.yesterday") : t("common.earlier");
  return (
    <div className="p-4 pb-8 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Kpi l={t("admin.pay.today")} v="₨ 148k" />
        <Kpi l={t("admin.pay.month")} v="₨ 3.2M" />
        <Kpi l={t("admin.pay.refunds")} v="₨ 42k" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {rows.map((r, i) => (
            <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{r.u}</p>
                <p className="text-[10px] text-muted-foreground truncate">{r.plan} · {dateLabel(r.dateKey)}</p>
              </div>
              <p className="shrink-0 font-mono text-sm">{r.amt}</p>
              <span className={`shrink-0 self-center rounded-full px-2 py-0.5 text-[10px] ${r.statusKey === "success" ? "bg-primary/10 text-primary" : r.statusKey === "refund" ? "bg-gold/20 text-[color:var(--color-gold-foreground)]" : "bg-destructive/15 text-destructive"}`}>{t(`admin.pay.status.${r.statusKey}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kpi({ l, v }: { l: string; v: string }) {
  return <div className="rounded-2xl border border-border bg-card p-3"><p className="truncate text-[10px] uppercase text-muted-foreground">{l}</p><p className="font-display text-lg">{v}</p></div>;
}
