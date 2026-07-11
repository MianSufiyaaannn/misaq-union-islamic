import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({ component: AdminReports });

const reports = [
  { by: "Aisha R.", against: "unknown@user", reason: "Inappropriate message", severity: "high", time: "12m" },
  { by: "Hamza S.", against: "user_2183", reason: "Fake profile", severity: "med", time: "1h" },
  { by: "Maryam I.", against: "user_9812", reason: "Harassment", severity: "high", time: "3h" },
  { by: "Yusuf K.", against: "user_4409", reason: "Spam / marketing", severity: "low", time: "1d" },
];

function AdminReports() {
  return (
    <div className="p-4 pb-8 space-y-3">
      {reports.map((r, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${r.severity === "high" ? "bg-destructive/15 text-destructive" : r.severity === "med" ? "bg-gold/20 text-[color:var(--color-gold-foreground)]" : "bg-muted text-muted-foreground"}`}><AlertTriangle className="h-4 w-4" /></span>
            <div className="flex-1">
              <p className="font-medium text-sm">{r.reason}</p>
              <p className="text-[11px] text-muted-foreground">By {r.by} · Against {r.against}</p>
            </div>
            <span className="text-[10px] text-muted-foreground">{r.time}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
            <button className="rounded-full border border-border py-1.5">Investigate</button>
            <button className="rounded-full border border-destructive/40 py-1.5 text-destructive">Suspend</button>
            <button className="rounded-full border border-border py-1.5">Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
}
