import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Inbox } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reports")({ component: AdminReports });

const initialReports = [
  {
    by: "Aisha R.",
    against: "unknown@user",
    reasonKey: "admin.reports.reasons.msg",
    severity: "high",
    time: "12m",
  },
  {
    by: "Hamza S.",
    against: "user_2183",
    reasonKey: "admin.reports.reasons.fake",
    severity: "med",
    time: "1h",
  },
  {
    by: "Maryam I.",
    against: "user_9812",
    reasonKey: "admin.reports.reasons.harass",
    severity: "high",
    time: "3h",
  },
  {
    by: "Yusuf K.",
    against: "user_4409",
    reasonKey: "admin.reports.reasons.spam",
    severity: "low",
    time: "1d",
  },
];

function AdminReports() {
  const t = useT();
  const [reportList, setReportList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("misaq_reports");
      return saved ? JSON.parse(saved) : initialReports;
    }
    return initialReports;
  });

  const saveReports = (list: typeof initialReports) => {
    setReportList(list);
    if (typeof window !== "undefined") {
      localStorage.setItem("misaq_reports", JSON.stringify(list));
    }
  };

  const handleInvestigate = (r: any) => {
    toast.info(`Opening investigation console and chat audit logs for ${r.against}.`);
  };

  const handleSuspend = (r: any) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Suspending reported account...",
      success: () => {
        const next = reportList.filter((x) => x.against !== r.against);
        saveReports(next);
        return `Account ${r.against} suspended successfully!`;
      },
      error: "Action failed.",
    });
  };

  const handleDismiss = (r: any) => {
    const next = reportList.filter((x) => x.against !== r.against);
    saveReports(next);
    toast.success(`Report against ${r.against} dismissed.`);
  };

  return (
    <div className="p-4 pb-8 space-y-3">
      <p className="text-xs text-muted-foreground">{reportList.length} user reports pending</p>

      {reportList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground bg-card rounded-3xl border border-border animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-6 w-6" />
          </div>
          <p className="text-sm">All reports resolved. Platform is safe!</p>
        </div>
      ) : (
        reportList.map((r, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${r.severity === "high" ? "bg-destructive/15 text-destructive" : r.severity === "med" ? "bg-gold/20 text-[color:var(--color-gold-foreground)]" : "bg-muted text-muted-foreground"}`}
              >
                <AlertTriangle className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{t(r.reasonKey)}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {t("admin.reports.by")} {r.by} · {t("admin.reports.against")} {r.against}
                </p>
              </div>
              <span className="shrink-0 text-[10px] text-muted-foreground">{r.time}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-semibold">
              <button
                onClick={() => handleInvestigate(r)}
                className="rounded-full border border-border py-1.5 truncate cursor-pointer hover:bg-muted/30 transition-all"
              >
                {t("common.investigate")}
              </button>
              <button
                onClick={() => handleSuspend(r)}
                className="rounded-full border border-destructive/40 py-1.5 text-destructive truncate cursor-pointer hover:bg-destructive/5 transition-all"
              >
                {t("common.suspend")}
              </button>
              <button
                onClick={() => handleDismiss(r)}
                className="rounded-full border border-border py-1.5 truncate cursor-pointer hover:bg-muted/30 transition-all"
              >
                {t("common.dismiss")}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
