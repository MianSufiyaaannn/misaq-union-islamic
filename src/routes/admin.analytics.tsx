import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/analytics")({ component: AdminAnalytics });

function AdminAnalytics() {
  const t = useT();
  const countries = [
    { c: "Pakistan", n: "6,148", p: 82 },
    { c: "UAE", n: "1,924", p: 34 },
    { c: "UK", n: "1,606", p: 28 },
    { c: "USA", n: "1,204", p: 22 },
    { c: "Canada", n: "812", p: 14 },
    { c: "KSA", n: "734", p: 12 },
  ];
  return (
    <div className="p-4 pb-8 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Card l={t("admin.analytics.dau")} v="4,208" d="+3.4%" />
        <Card l={t("admin.analytics.retention")} v="68%" d="+2.1%" />
        <Card l={t("admin.analytics.avg")} v="4.8" d="+0.6" />
        <Card l={t("admin.analytics.mtn")} v="12%" d="+1.2%" />
      </div>
      <div className="rounded-3xl border border-border bg-card p-4">
        <p className="mb-3 font-display text-lg">{t("admin.analytics.byCountry")}</p>
        <ul className="space-y-2 text-sm">
          {countries.map((r) => (
            <li key={r.c}>
              <div className="flex justify-between text-xs">
                <span className="truncate">{r.c}</span>
                <span className="font-medium shrink-0">{r.n}</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${r.p}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function Card({ l, v, d }: { l: string; v: string; d: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="truncate text-[10px] uppercase text-muted-foreground">{l}</p>
      <p className="font-display text-xl">{v}</p>
      <p className="text-[10px] text-primary">{d}</p>
    </div>
  );
}
