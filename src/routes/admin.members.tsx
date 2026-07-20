import { createFileRoute } from "@tanstack/react-router";
import { usePeople, resetRecommendations, type Person } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import {
  Search,
  MoreVertical,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Ban,
  RotateCcw,
  Eye,
} from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminProfileModal } from "@/components/misaq/admin-profile-modal";

export const Route = createFileRoute("/admin/members")({ component: AdminMembers });

type FilterKey = "all" | "verified" | "pending" | "premium" | "reported" | "suspended";

function AdminMembers() {
  const t = useT();
  const [people, updatePeople] = usePeople();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedMember, setSelectedMember] = useState<Person | null>(null);

  const filters: FilterKey[] = ["all", "verified", "pending", "premium", "reported", "suspended"];

  const filteredPeople = people.filter((p) => {
    // Search
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.profession.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Filter
    if (activeFilter === "verified") return p.verificationStatus === "Verified" || p.verified;
    if (activeFilter === "pending") return p.verificationStatus === "Submitted" || p.verificationStatus === "Under Review" || (!p.verified && !p.verificationStatus);
    if (activeFilter === "premium") return p.premium;
    if (activeFilter === "reported") return p.id.endsWith("3") || p.id.endsWith("7"); // Mock reported condition
    if (activeFilter === "suspended") return p.verificationStatus === "Suspended" || p.bio.includes("[SUSPENDED]");
    return true;
  });

  return (
    <div className="p-4 pb-8">
      <div className="mb-3 flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("admin.members.search")}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
      </div>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((k) => (
          <button
            key={k}
            onClick={() => setActiveFilter(k)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium cursor-pointer transition-colors",
              activeFilter === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40",
            )}
          >
            {t(`admin.members.f.${k}`)}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        {filteredPeople.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No members found matching the criteria.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filteredPeople.map((p) => {
              const isSuspended = p.verificationStatus === "Suspended" || p.bio.includes("[SUSPENDED]");
              return (
                <li
                  key={p.id}
                  onClick={() => setSelectedMember(p)}
                  className="flex items-center gap-3 px-3 py-3 text-sm hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <Avatar person={p} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p
                        className={cn(
                          "truncate font-semibold text-foreground",
                          isSuspended && "line-through text-muted-foreground",
                        )}
                      >
                        {p.name}
                      </p>
                      {isSuspended && (
                        <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[8px] font-bold text-destructive uppercase">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[10px] text-muted-foreground mt-0.5">
                      {p.age} yrs · {p.city} · {p.profession}
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <p
                      className={cn(
                        "text-[10px] font-semibold",
                        p.verificationStatus === "Verified" || p.verified ? "text-emerald-600" : "text-amber-500",
                      )}
                    >
                      {p.verificationStatus || (p.verified ? t("common.verified") : t("common.pending"))}
                    </p>
                    {p.premium && (
                      <p className="text-[9px] text-amber-500 font-bold">
                        ✦ Premium
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMember(p);
                    }}
                    className="shrink-0 text-muted-foreground p-1.5 hover:bg-muted rounded-full cursor-pointer"
                    aria-label="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Member Full Profile & Admin Management Modal */}
      <AdminProfileModal
        person={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />
    </div>
  );
}

