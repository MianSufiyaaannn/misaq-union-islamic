import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  ShieldCheck,
  MessageSquare,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ShieldAlert,
  UserCheck,
  Clock,
  Ban,
  Percent,
  Heart,
  Sparkles,
  Activity,
  ArrowRight,
} from "lucide-react";
import { usePeople, useChats, useProposals, resetRecommendations } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({ component: AdminDash });

function AdminDash() {
  const t = useT();
  const [people] = usePeople();
  const [chats] = useChats();
  const [proposals] = useProposals();

  // Dynamic computations from mock database arrays
  const totalUsers = people.length;
  const verifiedUsers = people.filter((p) => p.verificationStatus === "Verified").length;
  const pendingVerification = people.filter(
    (p) => p.verificationStatus === "Submitted" || p.verificationStatus === "Under Review",
  ).length;
  const rejectedProfiles = people.filter((p) => p.verificationStatus === "Rejected").length;
  const suspendedProfiles = people.filter((p) => p.verificationStatus === "Suspended").length;
  const bannedProfiles = people.filter((p) => p.verificationStatus === "Banned").length;

  const maleMembers = people.filter((p) => p.gender === "male").length;
  const femaleMembers = people.filter((p) => p.gender === "female").length;
  const premiumMembers = people.filter((p) => p.premium).length;
  const activeMatches = chats.length;
  const pendingProposals = proposals.sent.length + proposals.received.length;

  const finalProposals = chats.filter(
    (c) => c.finalProposalStatus && c.finalProposalStatus !== "none",
  ).length;

  // Revenue calculation: Premium memberships (Rs 5,000 each)
  const revenueVal =
    premiumMembers * 5000 +
    chats.filter((c) => c.finalProposalStatus === "purchased").length * 5000;
  const revenue = `₨ ${(revenueVal / 1000).toFixed(0)}k`;

  // Estimate online users (mock algorithm based on IDs)
  const onlineUsers = people.filter((p) => {
    let sum = 0;
    for (let c = 0; c < p.id.length; c++) sum += p.id.charCodeAt(c);
    return sum % 7 === 0;
  }).length;

  const recentRegistrations = people.slice(0, 5);
  const recentRequests = people
    .filter((p) => p.verificationStatus === "Submitted" || p.verificationStatus === "Under Review")
    .slice(0, 3);

  const kpis = [
    {
      l: "Total Users",
      v: totalUsers.toString(),
      d: `${maleMembers} Male · ${femaleMembers} Female`,
      i: Users,
      tone: "primary",
    },
    {
      l: "Verified Users",
      v: verifiedUsers.toString(),
      d: `${((verifiedUsers / totalUsers) * 100).toFixed(0)}% of total`,
      i: ShieldCheck,
      tone: "primary",
    },
    {
      l: "Pending Review",
      v: pendingVerification.toString(),
      d: "Requires approval",
      i: Clock,
      tone: "gold",
    },
    {
      l: "Premium Revenue",
      v: revenue,
      d: `${premiumMembers} Premium Users`,
      i: CreditCard,
      tone: "gold",
    },
  ];

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  k.tone === "gold"
                    ? "bg-gradient-gold text-[color:var(--color-gold-foreground)]"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <k.i className="h-4 w-4" />
              </span>
              <span className="text-[9px] text-muted-foreground truncate">{k.d}</span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold">{k.v}</p>
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground truncate">
              {k.l}
            </p>
          </div>
        ))}
      </div>

      {/* Verification Queue Summary */}
      <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-display text-base font-semibold">Verification Alert</p>
          <span className="shrink-0 text-[10px] text-muted-foreground flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-medium">
            <Activity className="h-3 w-3" />
            {onlineUsers} members online
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-muted/30 p-2.5 rounded-2xl border border-border/50">
            <p className="font-bold text-primary">{pendingVerification}</p>
            <p className="text-[9px] text-muted-foreground uppercase mt-0.5">Pending</p>
          </div>
          <div className="bg-muted/30 p-2.5 rounded-2xl border border-border/50">
            <p className="font-bold text-destructive">{rejectedProfiles}</p>
            <p className="text-[9px] text-muted-foreground uppercase mt-0.5">Rejected</p>
          </div>
          <div className="bg-muted/30 p-2.5 rounded-2xl border border-border/50">
            <p className="font-bold text-muted-foreground">{suspendedProfiles + bannedProfiles}</p>
            <p className="text-[9px] text-muted-foreground uppercase mt-0.5">Suspended/Banned</p>
          </div>
        </div>
      </div>

      {/* Match Statistics Graph */}
      <div className="rounded-3xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display text-base font-semibold">Matrimonial Workflows</p>
            <p className="text-[10px] text-muted-foreground">
              Active interactions across platforms
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-muted/20 border border-border/50 rounded-2xl">
            <Heart className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="font-display text-lg font-bold">{pendingProposals}</p>
            <p className="text-[9px] text-muted-foreground">Proposals Active</p>
          </div>
          <div className="p-3 bg-muted/20 border border-border/50 rounded-2xl">
            <MessageSquare className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="font-display text-lg font-bold">{activeMatches}</p>
            <p className="text-[9px] text-muted-foreground">Active Chats</p>
          </div>
          <div className="p-3 bg-muted/20 border border-border/50 rounded-2xl">
            <Sparkles className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="font-display text-lg font-bold">{finalProposals}</p>
            <p className="text-[9px] text-muted-foreground">Final Proposals</p>
          </div>
        </div>
      </div>

      {/* Recent Verification Requests */}
      {recentRequests.length > 0 && (
        <div className="rounded-3xl border border-border bg-card p-4">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-base font-semibold">Verification Requests</h2>
            <Link
              to="/admin/verification"
              className="text-xs text-primary font-medium hover:underline"
            >
              View All <ArrowRight className="inline h-3 w-3" />
            </Link>
          </div>
          <ul className="space-y-2">
            {recentRequests.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 text-xs border-b border-border/50 pb-2 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar person={p} size={32} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="truncate text-[9px] text-muted-foreground">
                      {p.city} · {p.profession}
                    </p>
                  </div>
                </div>
                <Link
                  to="/admin/verification"
                  className="rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] font-semibold hover:bg-primary/20"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="rounded-3xl border border-border bg-card p-4">
        <p className="mb-3 font-display text-base font-semibold">Recent Registrations</p>
        <ul className="space-y-3">
          {recentRegistrations.map((p) => (
            <li key={p.id} className="flex items-center gap-3 text-xs">
              <Avatar person={p} size={36} />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[9px] text-muted-foreground">
                  {p.city} · {p.profession}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-semibold capitalize ${
                  p.verificationStatus === "Verified"
                    ? "bg-primary/10 text-primary"
                    : p.verificationStatus === "Rejected"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-amber-500/10 text-amber-500"
                }`}
              >
                {p.verificationStatus || "Submitted"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* System Administration */}
      <div className="rounded-3xl border border-border bg-card p-4">
        <p className="mb-3 font-display text-base font-semibold">System Administration</p>
        <div className="space-y-2">
          <button
            onClick={() => {
              resetRecommendations();
              toast.success("All candidate recommendations have been reset successfully.");
            }}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-xs font-medium text-foreground transition-colors hover:bg-muted cursor-pointer animate-fade-in"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RotateCcw className="h-4 w-4" />
            </span>
            <div className="text-left flex-1 min-w-0">
              <p className="font-semibold text-xs">Reset Candidate Recommendations</p>
              <p className="text-[9px] text-muted-foreground">
                Clear all rejected profiles so they reappear in the Discover feed
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
