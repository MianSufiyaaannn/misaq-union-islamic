import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/premium")({ component: AdminPremium });

const plans = [
  { n: "Silver", p: "₨ 1,499", s: 3128, f: ["10 proposals/mo", "Verified badge"] },
  { n: "Gold", p: "₨ 3,499", s: 1842, f: ["Unlimited proposals", "Who viewed you", "Calls"] },
  { n: "Platinum", p: "₨ 6,999", s: 486, f: ["Everything + concierge", "Personal matchmaker"] },
];

function AdminPremium() {
  return (
    <div className="p-4 pb-8 space-y-3">
      {plans.map((p) => (
        <div key={p.n} className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-xl">{p.n}</p>
              <p className="text-xs text-muted-foreground">{p.p} / month · {p.s.toLocaleString()} subscribers</p>
            </div>
            <button className="rounded-full border border-border px-3 py-1 text-xs">Edit</button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {p.f.map((x) => <li key={x} className="rounded-full bg-muted px-2 py-1">{x}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
