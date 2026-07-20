import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";
import { usePeople, type Person } from "@/lib/mock";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Edit3, UserCheck, Plus, Check, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/premium")({ component: AdminPremium });

const initialPlans = [
  {
    id: "p1",
    n: "Premium Nikah Match",
    p: "₨ 5,000",
    priceNum: 5000,
    s: 1242,
    f: [
      "Unlock matched profile details post-Wali approval",
      "Direct Wali contact details reveal",
      "High-resolution private gallery access",
      "Unlimited messaging & voice notes",
    ],
  },
];

function AdminPremium() {
  const t = useT();
  const [people, updatePeople] = usePeople();

  const [plans, setPlans] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("misaq_admin_plans");
      return saved ? JSON.parse(saved) : initialPlans;
    }
    return initialPlans;
  });

  const [editingPlan, setEditingPlan] = useState<typeof initialPlans[0] | null>(null);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");

  const premiumMembers = people.filter((p) => p.premium);

  const handleEditPlan = (p: typeof initialPlans[0]) => {
    setEditingPlan(p);
    setPlanName(p.n);
    setPlanPrice(p.p);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const nextPlans = plans.map((p) =>
      p.id === editingPlan.id ? { ...p, n: planName, p: planPrice } : p,
    );
    setPlans(nextPlans);
    if (typeof window !== "undefined") {
      localStorage.setItem("misaq_admin_plans", JSON.stringify(nextPlans));
    }
    toast.success(`Plan "${planName}" updated successfully!`);
    setEditingPlan(null);
  };

  const handleToggleMemberPremium = (person: Person) => {
    const nextPeople = people.map((p) =>
      p.id === person.id ? { ...p, premium: !p.premium } : p,
    );
    updatePeople(nextPeople);
    toast.success(`${person.name} Premium status updated!`);
  };

  return (
    <div className="p-4 pb-8 space-y-4 text-left">
      {/* Top Banner & Quick Grant Button */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-base font-bold">Premium Subscription Plans</h2>
          <p className="text-[11px] text-muted-foreground">
            Manage membership tiers & active subscribers
          </p>
        </div>
        <button
          onClick={() => setGrantModalOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft hover:bg-primary/95 cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" /> Grant Premium
        </button>
      </div>

      {/* Subscription Plans */}
      {plans.map((p) => (
        <div key={p.id} className="rounded-3xl border border-border bg-card p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold">{p.n}</p>
              <p className="truncate text-xs text-muted-foreground mt-0.5">
                <span className="font-semibold text-foreground">{p.p}</span> one-time · {premiumMembers.length} Active Subscribers
              </p>
            </div>
            <button
              onClick={() => handleEditPlan(p)}
              className="shrink-0 flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted cursor-pointer transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" /> {t("common.edit")}
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Included Features:
            </p>
            <ul className="space-y-1 text-xs">
              {p.f.map((x) => (
                <li key={x} className="flex items-center gap-2 text-foreground/90">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Active Premium Subscribers List */}
      <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-display font-semibold text-sm">Active Premium Members ({premiumMembers.length})</p>
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
            ✦ Premium Active
          </span>
        </div>
        <ul className="divide-y divide-border/60">
          {premiumMembers.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <img src={m.photo} alt={m.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold truncate">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{m.city} · {m.profession}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleMemberPremium(m)}
                className="text-[10px] font-semibold text-destructive hover:underline cursor-pointer shrink-0"
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Plan Dialog */}
      {editingPlan && (
        <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
          <DialogContent className="max-w-[380px] rounded-3xl bg-background p-5 text-left">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold">Edit Subscription Plan</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Update tier pricing and display name.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSavePlan} className="space-y-3 mt-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Plan Title</label>
                <input
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Price (PKR)</label>
                <input
                  value={planPrice}
                  onChange={(e) => setPlanPrice(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="flex-1 rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Grant Premium Member Search Dialog */}
      {grantModalOpen && (
        <Dialog open={grantModalOpen} onOpenChange={setGrantModalOpen}>
          <DialogContent className="max-w-[400px] rounded-3xl bg-background p-5 text-left">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold flex items-center gap-1.5 text-primary">
                <Sparkles className="h-4 w-4 text-amber-500" /> Grant Premium Status
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Select a member to grant or revoke Premium status.
              </DialogDescription>
            </DialogHeader>

            <div className="my-2 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-1.5 text-xs">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search member name or city..."
                className="w-full bg-transparent outline-none"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {people
                .filter((p) => p.name.toLowerCase().includes(memberSearch.toLowerCase()))
                .map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2 rounded-xl border border-border hover:bg-muted/30 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={p.photo} alt={p.name} className="h-8 w-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{p.city}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleMemberPremium(p)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.premium ? "bg-amber-500/10 text-amber-600 border border-amber-500/30" : "bg-primary text-primary-foreground"}`}
                    >
                      {p.premium ? "✦ Premium" : "Grant"}
                    </button>
                  </div>
                ))}
            </div>

            <button
              onClick={() => setGrantModalOpen(false)}
              className="w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground mt-2"
            >
              Done
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
