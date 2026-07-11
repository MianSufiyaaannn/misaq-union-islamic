import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/admins")({ component: AdminAdmins });

const admins = [
  { n: "Sheikh Umar", roleKey: "super", email: "umar@misaq.app" },
  { n: "Zainab Q.", roleKey: "mod", email: "zainab@misaq.app" },
  { n: "Bilal M.", roleKey: "support", email: "bilal@misaq.app" },
];

function AdminAdmins() {
  const t = useT();
  return (
    <div className="p-4 pb-8 space-y-3">
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 py-3 text-sm font-medium text-primary"><Plus className="h-4 w-4" /> {t("admin.admins.invite")}</button>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {admins.map((a, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-display text-white text-sm">{a.n.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{a.n}</p>
                <p className="truncate text-[10px] text-muted-foreground">{a.email}</p>
              </div>
              <span className="shrink-0 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-medium text-[color:var(--color-gold-foreground)] truncate max-w-[100px]">{t(`admin.admins.roles.${a.roleKey}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
