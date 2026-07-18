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
} from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
    if (activeFilter === "verified") return p.verified;
    if (activeFilter === "pending") return !p.verified;
    if (activeFilter === "premium") return p.premium;
    if (activeFilter === "reported") return p.id.endsWith("3") || p.id.endsWith("7"); // Mock reported condition
    if (activeFilter === "suspended") return p.bio.includes("[SUSPENDED]"); // Mock suspended condition
    return true;
  });

  const handleToggleVerify = (person: Person) => {
    const nextPeople = people.map((p) => {
      if (p.id === person.id) {
        const nextState = !p.verified;
        toast.success(`${p.name} is now ${nextState ? "Verified" : "Unverified"}`);
        return { ...p, verified: nextState };
      }
      return p;
    });
    updatePeople(nextPeople);
    setSelectedMember(null);
  };

  const handleTogglePremium = (person: Person) => {
    const nextPeople = people.map((p) => {
      if (p.id === person.id) {
        const nextState = !p.premium;
        toast.success(`${p.name} is now ${nextState ? "Premium member" : "Standard member"}`);
        return { ...p, premium: nextState };
      }
      return p;
    });
    updatePeople(nextPeople);
    setSelectedMember(null);
  };

  const handleResetRecommendations = (person: Person) => {
    resetRecommendations();
    toast.success(
      `Discover recommendations reset for ${person.name}. Previously rejected profiles can reappear.`,
    );
    setSelectedMember(null);
  };

  const handleToggleSuspend = (person: Person) => {
    const nextPeople = people.map((p) => {
      if (p.id === person.id) {
        const isSuspended = p.bio.includes("[SUSPENDED]");
        const nextBio = isSuspended ? p.bio.replace("[SUSPENDED] ", "") : `[SUSPENDED] ${p.bio}`;
        toast.error(`${p.name} has been ${isSuspended ? "activated" : "suspended"}`);
        return { ...p, bio: nextBio };
      }
      return p;
    });
    updatePeople(nextPeople);
    setSelectedMember(null);
  };

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
              const isSuspended = p.bio.includes("[SUSPENDED]");
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/10 transition-colors"
                >
                  <Avatar person={p} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p
                        className={cn(
                          "truncate font-medium",
                          isSuspended && "line-through text-muted-foreground",
                        )}
                      >
                        {p.name}
                      </p>
                      {isSuspended && (
                        <span className="rounded bg-destructive/10 px-1 py-0.5 text-[8px] font-semibold text-destructive uppercase">
                          Suspended
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {p.age} · {p.city} · {p.profession}
                    </p>
                  </div>
                  <div className="shrink-0 text-end">
                    <p
                      className={cn(
                        "text-[10px] font-medium",
                        p.verified ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {p.verified ? t("common.verified") : t("common.pending")}
                    </p>
                    {p.premium && (
                      <p className="text-[9px] text-[color:var(--color-gold-foreground)]">
                        ✦ Premium
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedMember(p)}
                    className="shrink-0 text-muted-foreground p-1 hover:bg-muted rounded-full cursor-pointer"
                    aria-label="menu"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Member Administration Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        {selectedMember && (
          <DialogContent className="max-w-[360px] rounded-3xl bg-background p-6">
            <DialogHeader className="items-center text-center">
              <Avatar person={selectedMember} size={64} />
              <DialogTitle className="font-display text-lg text-primary mt-2">
                {selectedMember.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedMember.age} yrs · {selectedMember.city} · {selectedMember.profession}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => handleToggleVerify(selectedMember)}
                className="w-full flex items-center justify-between rounded-2xl border border-border p-3 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" /> Verification Status
                </span>
                <span
                  className={cn(selectedMember.verified ? "text-primary" : "text-muted-foreground")}
                >
                  {selectedMember.verified ? "Verified ✓" : "Verify member"}
                </span>
              </button>
              <button
                onClick={() => handleTogglePremium(selectedMember)}
                className="w-full flex items-center justify-between rounded-2xl border border-border p-3 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-gold" /> Premium Subscription
                </span>
                <span
                  className={cn(selectedMember.premium ? "text-gold" : "text-muted-foreground")}
                >
                  {selectedMember.premium ? "Premium active ✦" : "Grant Premium"}
                </span>
              </button>
              <button
                onClick={() => handleToggleSuspend(selectedMember)}
                className="w-full flex items-center justify-between rounded-2xl border border-destructive/20 p-3 text-xs font-semibold cursor-pointer hover:bg-destructive/5 text-destructive transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Ban className="h-4 w-4" /> Account Access
                </span>
                <span>
                  {selectedMember.bio.includes("[SUSPENDED]")
                    ? "Unsuspend account"
                    : "Suspend account"}
                </span>
              </button>
              <button
                onClick={() => handleResetRecommendations(selectedMember)}
                className="w-full flex items-center justify-between rounded-2xl border border-border p-3 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-primary" /> Discover Recommendations
                </span>
                <span className="text-muted-foreground">Reset rejected queue</span>
              </button>
            </div>
            <button
              onClick={() => setSelectedMember(null)}
              className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground mt-4 shadow-soft"
            >
              Close Console
            </button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
