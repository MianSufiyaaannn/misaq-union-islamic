import { createFileRoute, Link } from "@tanstack/react-router";
import { people, meMember, chats } from "@/lib/mock";
import { Avatar, VerifiedBadge, CompatibilityRing } from "@/components/misaq/bits";
import { ShieldCheck, MessageSquare, Bell } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/wali/")({ component: WaliHome });

function WaliHome() {
  const t = useT();
  const linked = meMember;
  return (
    <div className="pb-8">
      <header className="relative overflow-hidden bg-gradient-royal px-6 pb-10 pt-14 text-white">
        <div className="pointer-events-none absolute -end-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[color:var(--color-gold)]" />
            <div className="min-w-0">
              <p className="truncate text-[11px] uppercase tracking-[0.3em] text-white/60">{t("wali.dashboard")}</p>
              <h1 className="truncate font-display text-xl">{t("wali.name")}</h1>
            </div>
          </div>
          <button aria-label={t("notif.title")} className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
            <Bell className="h-4 w-4" />
            <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-[color:var(--color-gold)]" />
          </button>
        </div>
      </header>

      <div className="mx-5 -mt-6 rounded-3xl border border-border bg-card p-5 shadow-elegant">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("wali.guardianOf")}</p>
        <div className="mt-3 flex items-center gap-4">
          <Avatar person={linked} size={64} />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate font-display text-lg">{linked.name}</p>
              <VerifiedBadge />
            </div>
            <p className="truncate text-xs text-muted-foreground">{linked.age} · {linked.city} · {linked.profession}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div><p className="font-display text-lg text-primary">3</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{t("wali.stats.proposals")}</p></div>
          <div><p className="font-display text-lg text-primary">{chats.length}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{t("wali.stats.chats")}</p></div>
          <div><p className="font-display text-lg text-primary">0</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider truncate">{t("wali.stats.flags")}</p></div>
        </div>
      </div>

      <section className="mt-6 px-5">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="font-display text-lg truncate">{t("wali.current")}</h2>
          <Link to="/wali/proposals" className="shrink-0 text-xs font-medium text-primary">{t("wali.viewAll")}</Link>
        </div>
        <div className="space-y-2">
          {people.slice(0, 3).map((p) => (
            <Link key={p.id} to="/wali/profile/$id" params={{ id: p.id }} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <Avatar person={p} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{p.age} · {p.city} · {p.profession}</p>
              </div>
              <CompatibilityRing value={p.compatibility} size={40} />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2 className="font-display text-lg truncate">{t("wali.inProgress")}</h2>
          <Link to="/wali/chats" className="shrink-0 text-xs font-medium text-primary">{t("wali.monitor")}</Link>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary">
          <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5 shrink-0" /><span className="font-medium">{t("wali.fullVis")}</span></div>
          <p className="mt-1 text-primary/80">{t("wali.fullVisDesc")}</p>
        </div>
      </section>
    </div>
  );
}
