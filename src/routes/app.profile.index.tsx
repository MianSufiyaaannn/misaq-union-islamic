import { createFileRoute, Link } from "@tanstack/react-router";
import { meMember } from "@/lib/mock";
import { Avatar, VerifiedBadge, PremiumBadge, CompatibilityRing } from "@/components/misaq/bits";
import { Settings, Sparkles, Edit3, Eye, ShieldCheck } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/app/profile/")({ component: MyProfile });

function MyProfile() {
  const t = useT();
  return (
    <div className="pb-8">
      <div
        className="relative overflow-hidden bg-gradient-royal px-6 pb-16 text-white"
        style={{ paddingTop: "max(3.5rem, calc(env(safe-area-inset-top) + 1rem))" }}
      >
        <div className="pointer-events-none absolute -start-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] uppercase tracking-[0.3em] text-white/60">{t("profile.myTitle")}</p>
            <h1 className="mt-1 truncate font-display text-2xl">{t("profile.mashAllah")}</h1>
          </div>
          <Link to="/app/settings" aria-label={t("settings.title")} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10"><Settings className="h-4 w-4" /></Link>
        </div>
      </div>

      <div className="mx-4 -mt-12 rounded-3xl border border-border bg-card p-5 shadow-elegant sm:mx-6">
        <div className="flex items-center gap-4">
          <Avatar person={meMember} size={72} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl leading-tight">{meMember.name}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{meMember.age} {t("common.yrs")} • {meMember.profession}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <VerifiedBadge />
              <PremiumBadge />
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
          <div><p className="font-display text-lg text-primary">128</p><p className="truncate text-[10px] text-muted-foreground uppercase tracking-wider">{t("profile.views")}</p></div>
          <div><p className="font-display text-lg text-primary">14</p><p className="truncate text-[10px] text-muted-foreground uppercase tracking-wider">{t("home.proposals")}</p></div>
          <div><p className="font-display text-lg text-primary">92%</p><p className="truncate text-[10px] text-muted-foreground uppercase tracking-wider">{t("profile.complete")}</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-2 px-4 sm:px-6">
        <Row to="/app/premium" title={t("profile.upgrade")} desc={t("profile.upgradeDesc")} icon={<Sparkles className="h-4 w-4" />} gold />
        <Row title={t("profile.edit")} desc={t("profile.editDesc")} icon={<Edit3 className="h-4 w-4" />} />
        <Row title={t("profile.viewed")} desc={t("profile.viewedDesc")} icon={<Eye className="h-4 w-4" />} />
        <Row title={t("profile.myWali")} desc={t("profile.myWaliDesc")} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="mx-4 mt-6 rounded-3xl border border-border bg-card p-5 sm:mx-6">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-display text-lg">{t("profile.strength")}</p>
          <CompatibilityRing value={92} size={48} tone="gold" />
        </div>
        <div className="mt-4 space-y-2 text-xs">
          {[
            { label: t("profile.strengthPersonal"), pct: 100 },
            { label: t("profile.strengthReligious"), pct: 100 },
            { label: t("profile.strengthFamily"), pct: 80 },
            { label: `${t("profile.strengthPhotos")} (2/5)`, pct: 60 },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between gap-2"><span className="min-w-0 truncate text-muted-foreground">{s.label}</span><span className="shrink-0 font-medium">{s.pct}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ title, desc, icon, gold, to }: { title: string; desc: string; icon: React.ReactNode; gold?: boolean; to?: string }) {
  const inner = (
    <div className={`flex items-center gap-3 rounded-2xl border p-4 ${gold ? "border-gold/40 bg-gradient-gold text-[color:var(--color-gold-foreground)]" : "border-border bg-card"}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${gold ? "bg-white/30" : "bg-primary/10 text-primary"}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{title}</p>
        <p className={`truncate text-[11px] ${gold ? "text-[color:var(--color-gold-foreground)]/80" : "text-muted-foreground"}`}>{desc}</p>
      </div>
      <span className="shrink-0 text-lg rtl:rotate-180">›</span>
    </div>
  );
  return to ? <Link to={to as "/app/premium"}>{inner}</Link> : <button className="text-start">{inner}</button>;
}
