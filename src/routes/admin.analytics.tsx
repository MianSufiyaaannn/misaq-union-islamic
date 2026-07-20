import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Calendar, BarChart3, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/analytics")({ component: AdminAnalytics });

type Timeframe = "today" | "7d" | "30d" | "all";

function AdminAnalytics() {
  const t = useT();
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");

  const metrics: Record<Timeframe, { dau: string; retention: string; avg: string; mtn: string }> = {
    today: { dau: "4,208", retention: "72%", avg: "5.1m", mtn: "14%" },
    "7d": { dau: "28,450", retention: "70%", avg: "4.9m", mtn: "13%" },
    "30d": { dau: "118,900", retention: "68%", avg: "4.8m", mtn: "12%" },
    all: { dau: "450,120", retention: "65%", avg: "4.5m", mtn: "11%" },
  };

  const countries = [
    { c: "Pakistan", n: "6,148", p: 82 },
    { c: "UAE", n: "1,924", p: 34 },
    { c: "UK", n: "1,606", p: 28 },
    { c: "USA", n: "1,204", p: 22 },
    { c: "Canada", n: "812", p: 14 },
    { c: "KSA", n: "734", p: 12 },
  ];

  const handleExportCSV = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Generating platform analytics report...",
      success: () => {
        // Trigger CSV download
        const csvContent =
          "data:text/csv;charset=utf-8,Country,Members,Percentage\n" +
          countries.map((e) => `${e.c},${e.n},${e.p}%`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Misaq_Analytics_${timeframe}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return "Analytics report exported successfully!";
      },
      error: "Export failed.",
    });
  };

  const currentMetrics = metrics[timeframe];

  return (
    <div className="p-4 pb-8 space-y-4 text-left">
      {/* Timeframe Filter Bar & Export */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 bg-surface p-1 rounded-full border border-border">
          {(["today", "7d", "30d", "all"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "rounded-full px-3 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer",
                timeframe === tf
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {tf}
            </button>
          ))}
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-muted cursor-pointer transition-all shadow-sm"
        >
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card l={t("admin.analytics.dau")} v={currentMetrics.dau} d="+3.4%" />
        <Card l={t("admin.analytics.retention")} v={currentMetrics.retention} d="+2.1%" />
        <Card l={t("admin.analytics.avg")} v={currentMetrics.avg} d="+0.6" />
        <Card l={t("admin.analytics.mtn")} v={currentMetrics.mtn} d="+1.2%" />
      </div>

      <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
        <p className="font-display font-bold text-base">{t("admin.analytics.byCountry")}</p>
        <ul className="space-y-2.5 text-sm">
          {countries.map((r) => (
            <li key={r.c}>
              <div className="flex justify-between text-xs font-medium">
                <span className="truncate">{r.c}</span>
                <span className="font-semibold shrink-0">{r.n}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
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
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
      <p className="truncate text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{l}</p>
      <p className="font-display text-2xl font-bold mt-1">{v}</p>
      <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">{d} vs last period</p>
    </div>
  );
}
