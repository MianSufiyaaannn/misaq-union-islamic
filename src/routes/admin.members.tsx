import { createFileRoute } from "@tanstack/react-router";
import { people } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { Search, MoreVertical } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/members")({ component: AdminMembers });

function AdminMembers() {
  const t = useT();
  const filters = ["all", "verified", "pending", "premium", "reported", "suspended"] as const;
  return (
    <div className="p-4 pb-8">
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input placeholder={t("admin.members.search")} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
      </div>
      <div className="mb-3 flex gap-2 overflow-x-auto">
        {filters.map((k, i) => (
          <span key={k} className={`shrink-0 rounded-full border px-3 py-1 text-[11px] ${i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{t(`admin.members.f.${k}`)}</span>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {people.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <Avatar person={p} size={36} />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{p.age} · {p.city} · {p.profession}</p>
              </div>
              <div className="shrink-0 text-end">
                <p className={`text-[10px] font-medium ${p.verified ? "text-primary" : "text-muted-foreground"}`}>{p.verified ? t("common.verified") : t("common.pending")}</p>
                {p.premium && <p className="text-[9px] text-[color:var(--color-gold-foreground)]">✦ Premium</p>}
              </div>
              <button className="shrink-0 text-muted-foreground" aria-label="menu"><MoreVertical className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
