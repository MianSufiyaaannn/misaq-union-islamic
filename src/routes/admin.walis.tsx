import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/walis")({ component: AdminWalis });

const walis = [
  { n: "Abdullah Rahman", w: "Aisha Rahman", relKey: "reg.o.rel.father", v: true },
  { n: "Ismail Siddiqui", w: "Hamza Siddiqui", relKey: "reg.o.rel.father", v: true },
  { n: "Amina Iqbal", w: "Maryam Iqbal", relKey: "reg.o.rel.mother", v: true },
  { n: "Omar Khan", w: "Yusuf Khan", relKey: "reg.o.rel.brother", v: false },
];

function AdminWalis() {
  const t = useT();
  return (
    <div className="p-4 pb-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {walis.map((w, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-royal font-display text-white text-sm">{w.n.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{w.n}</p>
                <p className="truncate text-[10px] text-muted-foreground">{t("admin.walis.of")} {w.w} · {t(w.relKey)}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${w.v ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{w.v ? t("common.verified") : t("common.pending")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
