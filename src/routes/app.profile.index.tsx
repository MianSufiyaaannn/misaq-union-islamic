import { createFileRoute, Link } from "@tanstack/react-router";
import { meMember } from "@/lib/mock";
import { Avatar, VerifiedBadge, PremiumBadge, CompatibilityRing } from "@/components/misaq/bits";
import { Settings, Sparkles, Edit3, Eye, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/app/profile/")({ component: MyProfile });

function MyProfile() {
  return (
    <div className="pb-8">
      <div className="relative overflow-hidden bg-gradient-royal px-6 pb-16 pt-14 text-white">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Your profile</p>
            <h1 className="mt-1 font-display text-2xl">Ma sha Allah</h1>
          </div>
          <Link to="/app/settings" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><Settings className="h-4 w-4" /></Link>
        </div>
      </div>

      <div className="mx-6 -mt-12 rounded-3xl border border-border bg-card p-5 shadow-elegant">
        <div className="flex items-center gap-4">
          <Avatar person={meMember} size={72} />
          <div className="flex-1">
            <p className="font-display text-xl leading-none">{meMember.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{meMember.age} • {meMember.profession}</p>
            <div className="mt-2 flex gap-2">
              <VerifiedBadge />
              <PremiumBadge />
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
          <div><p className="font-display text-lg text-primary">128</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Profile views</p></div>
          <div><p className="font-display text-lg text-primary">14</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Proposals</p></div>
          <div><p className="font-display text-lg text-primary">92%</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Complete</p></div>
        </div>
      </div>

      <div className="mt-6 grid gap-2 px-6">
        <Row to="/app/premium" title="Upgrade to Platinum" desc="Unlimited proposals · priority visibility" icon={<Sparkles className="h-4 w-4" />} gold />
        <Row title="Edit profile" desc="Personal, religious, family, dowry" icon={<Edit3 className="h-4 w-4" />} />
        <Row title="Who viewed me" desc="42 members this week" icon={<Eye className="h-4 w-4" />} />
        <Row title="My Wali" desc="Abdullah Rahman · Father · Verified" icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="mx-6 mt-6 rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg">Profile strength</p>
          <CompatibilityRing value={92} size={48} tone="gold" />
        </div>
        <div className="mt-4 space-y-2 text-xs">
          {[
            { label: "Personal information", pct: 100 },
            { label: "Religious information", pct: 100 },
            { label: "Family details", pct: 80 },
            { label: "Photos (2 of 5)", pct: 60 },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between"><span className="text-muted-foreground">{s.label}</span><span className="font-medium">{s.pct}%</span></div>
              <div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${s.pct}%` }} /></div>
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
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${gold ? "bg-white/30" : "bg-primary/10 text-primary"}`}>{icon}</div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className={`text-[11px] ${gold ? "text-[color:var(--color-gold-foreground)]/80" : "text-muted-foreground"}`}>{desc}</p>
      </div>
      <span className="text-lg">›</span>
    </div>
  );
  return to ? <Link to={to as any}>{inner}</Link> : <button className="text-left">{inner}</button>;
}
