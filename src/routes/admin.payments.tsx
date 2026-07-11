import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/payments")({ component: AdminPayments });

const rows = [
  { u: "Aisha Rahman", plan: "Gold", amt: "₨ 3,499", status: "Success", date: "Today" },
  { u: "Hamza Siddiqui", plan: "Silver", amt: "₨ 1,499", status: "Success", date: "Today" },
  { u: "Khadija Malik", plan: "Platinum", amt: "₨ 6,999", status: "Success", date: "Yesterday" },
  { u: "Bilal Ahmed", plan: "Gold", amt: "₨ 3,499", status: "Refund", date: "Yesterday" },
  { u: "Fatima Noor", plan: "Silver", amt: "₨ 1,499", status: "Failed", date: "3d" },
];

function AdminPayments() {
  return (
    <div className="p-4 pb-8 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Kpi l="Today" v="₨ 148k" />
        <Kpi l="This month" v="₨ 3.2M" />
        <Kpi l="Refunds" v="₨ 42k" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {rows.map((r, i) => (
            <li key={i} className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 py-2.5 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{r.u}</p>
                <p className="text-[10px] text-muted-foreground">{r.plan} · {r.date}</p>
              </div>
              <p className="font-mono text-sm">{r.amt}</p>
              <span className={`self-center rounded-full px-2 py-0.5 text-[10px] ${r.status === "Success" ? "bg-primary/10 text-primary" : r.status === "Refund" ? "bg-gold/20 text-[color:var(--color-gold-foreground)]" : "bg-destructive/15 text-destructive"}`}>{r.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kpi({ l, v }: { l: string; v: string }) {
  return <div className="rounded-2xl border border-border bg-card p-3"><p className="text-[10px] uppercase text-muted-foreground">{l}</p><p className="font-display text-lg">{v}</p></div>;
}
