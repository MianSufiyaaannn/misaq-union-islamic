import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const t = useT();
  const groups = [
    { t: t("admin.set.platform"), i: ["admin.set.p.branding", "admin.set.p.onboarding", "admin.set.p.algo", "admin.set.p.langs"] },
    { t: t("admin.set.security"), i: ["admin.set.s.pw", "admin.set.s.2fa", "admin.set.s.sess", "admin.set.s.audit"] },
    { t: t("admin.set.compliance"), i: ["admin.set.c.retention", "admin.set.c.forgotten", "admin.set.c.export", "admin.set.c.laws"] },
  ];
  return (
    <div className="p-4 pb-8 space-y-4">
      {groups.map((g) => (
        <div key={g.t}>
          <p className="mb-2 px-2 text-[10px] uppercase tracking-widest text-muted-foreground">{g.t}</p>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {g.i.map((k) => (
              <li key={k} className="flex items-center px-4 py-3 text-sm">
                <span className="flex-1 min-w-0 truncate">{t(k)}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
