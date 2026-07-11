import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/walis")({ component: AdminWalis });

const walis = [
  { n: "Abdullah Rahman", w: "Aisha Rahman", r: "Father", v: true },
  { n: "Ismail Siddiqui", w: "Hamza Siddiqui", r: "Father", v: true },
  { n: "Amina Iqbal", w: "Maryam Iqbal", r: "Mother", v: true },
  { n: "Omar Khan", w: "Yusuf Khan", r: "Brother", v: false },
];

function AdminWalis() {
  return (
    <div className="p-4 pb-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {walis.map((w, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-royal font-display text-white text-sm">{w.n.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{w.n}</p>
                <p className="text-[10px] text-muted-foreground">Wali of {w.w} · {w.r}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${w.v ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{w.v ? "Verified" : "Pending"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
