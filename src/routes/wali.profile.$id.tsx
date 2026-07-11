import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { findPerson } from "@/lib/mock";
import { VerifiedBadge, PremiumBadge, CompatibilityRing } from "@/components/misaq/bits";

export const Route = createFileRoute("/wali/profile/$id")({ component: WaliProfileView });

function WaliProfileView() {
  const { id } = Route.useParams();
  const p = findPerson(id);
  return (
    <div className="pb-8">
      <div className="relative h-64" style={{ background: p.avatar }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
        <TopBar back tone="light" transparent />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
          <div>
            <h1 className="font-display text-3xl">{p.name}</h1>
            <p className="text-xs text-white/80">{p.age} · {p.city} · {p.profession}</p>
            <div className="mt-2 flex gap-2">{p.verified && <VerifiedBadge />}{p.premium && <PremiumBadge />}</div>
          </div>
          <CompatibilityRing value={p.compatibility} size={64} tone="light" />
        </div>
      </div>
      <div className="space-y-3 px-5 py-4 text-sm">
        <p className="text-muted-foreground">Reviewing this profile as Wali. Contact their Wali directly through the linked details below.</p>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Their Wali</p>
          <p className="mt-1 font-medium">Ismail Rahman (Father)</p>
          <p className="text-xs text-muted-foreground">+92 300 ••• ••• · Verified with CNIC</p>
          <button className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-medium text-primary-foreground">Message Wali directly</button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-medium">About</p>
          <p className="mt-1 text-xs text-muted-foreground">{p.bio}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-xs">
          <p className="font-medium mb-2">Religious</p>
          <p className="text-muted-foreground">Sect: {p.sect}</p>
          <p className="text-muted-foreground">Prayer: {p.prayer}</p>
          <p className="text-muted-foreground">Quran: {p.quran}</p>
        </div>
      </div>
    </div>
  );
}
