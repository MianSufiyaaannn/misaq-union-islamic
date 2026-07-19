import { createFileRoute, Link } from "@tanstack/react-router";
import { usePeople, useMe, useChats, useProposals } from "@/lib/mock";
import { Avatar, VerifiedBadge, CompatibilityRing } from "@/components/misaq/bits";
import { ShieldCheck, MessageSquare, Bell } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/wali/")({ component: WaliHome });

function WaliHome() {
  const t = useT();
  const [linked] = useMe();
  const [chats] = useChats();
  const [proposals] = useProposals();
  const [peopleList] = usePeople();

  const pendingFinalChat = chats.find((c) => c.finalProposalStatus === "accepted");

  return (
    <div className="h-full overflow-y-auto pb-24">
      <header className="relative overflow-hidden bg-gradient-royal px-6 pb-10 pt-[calc(1rem+env(safe-area-inset-top))] text-white">
        <div className="pointer-events-none absolute -end-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[color:var(--color-gold)]" />
            <div className="min-w-0">
              <p className="truncate text-[11px] uppercase tracking-[0.3em] text-white/60">
                {t("wali.dashboard")}
              </p>
              <h1 className="truncate font-display text-xl">{t("wali.name")}</h1>
            </div>
          </div>
          <button
            onClick={() =>
              toast.success(
                pendingFinalChat
                  ? "You have 1 pending matrimonial Final Proposal to review!"
                  : "No new alerts for Wali.",
              )
            }
            aria-label={t("notif.title")}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {pendingFinalChat && (
              <span className="absolute end-2 top-2 h-2.5 w-2.5 rounded-full bg-[color:var(--color-gold)] animate-pulse" />
            )}
          </button>
        </div>
      </header>

      {pendingFinalChat && (
        <div className="mx-5 mb-4 mt-4 rounded-3xl border-2 border-gold bg-gradient-to-br from-card to-gold/10 p-4 shadow-elegant flex items-center justify-between gap-3 text-left animate-pulse">
          <div>
            <p className="text-[10px] font-bold text-gold uppercase tracking-wider">
              Matrimonial Request
            </p>
            <h3 className="font-display text-sm text-primary mt-0.5">
              Pending Final Proposal Review
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Ahmed Raza has sent a matrimonial proposal. Review now.
            </p>
          </div>
          <Link
            to="/wali/proposals"
            className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shrink-0 shadow-soft"
          >
            Review
          </Link>
        </div>
      )}

      <div className="mx-5 -mt-6 rounded-3xl border border-border bg-card p-5 shadow-elegant">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {t("wali.guardianOf")}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <Avatar person={linked} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate font-display text-lg">{linked.name}</p>
              <VerifiedBadge />
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {linked.age} · {linked.city} · {linked.profession}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div>
            <p className="font-display text-lg text-primary">{proposals.received.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
              {t("wali.stats.proposals")}
            </p>
          </div>
          <div>
            <p className="font-display text-lg text-primary">{chats.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
              {t("wali.stats.chats")}
            </p>
          </div>
          <div>
            <p className="font-display text-lg text-primary">0</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">
              {t("wali.stats.flags")}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-6 px-5">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="font-display text-lg truncate">{t("wali.current")}</h2>
          <Link to="/wali/proposals" className="shrink-0 text-xs font-medium text-primary">
            {t("wali.viewAll")}
          </Link>
        </div>
        <div className="space-y-2">
          {peopleList.slice(0, 3).map((p) => (
            <Link
              key={p.id}
              to="/wali/profile/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <Avatar person={p} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {p.age} · {p.city} · {p.profession}
                </p>
              </div>
              <CompatibilityRing value={p.compatibility} size={40} />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="font-display text-lg truncate">{t("wali.inProgress")}</h2>
          <Link to="/wali/chats" className="shrink-0 text-xs font-medium text-primary">
            {t("wali.monitor")}
          </Link>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">{t("wali.fullVis")}</span>
          </div>
          <p className="mt-1 text-primary/80">{t("wali.fullVisDesc")}</p>
        </div>
      </section>
    </div>
  );
}
