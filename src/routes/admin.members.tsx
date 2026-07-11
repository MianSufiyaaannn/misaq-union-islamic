import { createFileRoute } from "@tanstack/react-router";
import { people } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { Search, MoreVertical } from "lucide-react";

export const Route = createFileRoute("/admin/members")({ component: AdminMembers });

function AdminMembers() {
  return (
    <div className="p-4 pb-8">
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Search 12,428 members…" className="flex-1 bg-transparent text-sm outline-none" />
      </div>
      <div className="mb-3 flex gap-2 overflow-x-auto">
        {["All", "Verified", "Pending", "Premium", "Reported", "Suspended"].map((t, i) => (
          <span key={t} className={`shrink-0 rounded-full border px-3 py-1 text-[11px] ${i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>{t}</span>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {[...people, ...people].map((p, i) => (
            <li key={`${p.id}-${i}`} className="flex items-center gap-3 px-3 py-2.5 text-sm">
              <Avatar person={p} size={36} />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{p.age} · {p.city} · {p.profession}</p>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-medium ${p.verified ? "text-primary" : "text-muted-foreground"}`}>{p.verified ? "Verified" : "Pending"}</p>
                {p.premium && <p className="text-[9px] text-[color:var(--color-gold-foreground)]">✦ Premium</p>}
              </div>
              <button className="text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
