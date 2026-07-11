import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

const groups = [
  { t: "Platform", i: ["Branding & logo", "Onboarding flow", "Compatibility algorithm", "Language packs"] },
  { t: "Security", i: ["Password policy", "Two-factor for admins", "Session limits", "Audit log"] },
  { t: "Compliance", i: ["Data retention", "Right to be forgotten", "Export data", "Regional laws"] },
];

function AdminSettings() {
  return (
    <div className="p-4 pb-8 space-y-4">
      {groups.map((g) => (
        <div key={g.t}>
          <p className="mb-2 px-2 text-[10px] uppercase tracking-widest text-muted-foreground">{g.t}</p>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {g.i.map((x) => (
              <li key={x} className="flex items-center px-4 py-3 text-sm"><span className="flex-1">{x}</span><ChevronRight className="h-4 w-4 text-muted-foreground" /></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
