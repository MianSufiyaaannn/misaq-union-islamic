import { createFileRoute, Link } from "@tanstack/react-router";
import { people, meMember, chats } from "@/lib/mock";
import { Avatar, VerifiedBadge, CompatibilityRing } from "@/components/misaq/bits";
import { ShieldCheck, MessageSquare, Bell } from "lucide-react";

export const Route = createFileRoute("/wali/")({ component: WaliHome });

function WaliHome() {
  const linked = meMember;
  return (
    <div className="pb-8">
      <header className="relative overflow-hidden bg-gradient-royal px-6 pb-10 pt-14 text-white">
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[color:var(--color-gold)]" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Wali Dashboard</p>
              <h1 className="font-display text-xl">Abdullah Rahman</h1>
            </div>
          </div>
          <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10"><Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[color:var(--color-gold)]" /></button>
        </div>
      </header>

      <div className="mx-5 -mt-6 rounded-3xl border border-border bg-card p-5 shadow-elegant">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">You are guardian of</p>
        <div className="mt-3 flex items-center gap-4">
          <Avatar person={linked} size={64} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-display text-lg">{linked.name}</p>
              <VerifiedBadge />
            </div>
            <p className="text-xs text-muted-foreground">{linked.age} · {linked.city} · {linked.profession}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div><p className="font-display text-lg text-primary">3</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Proposals</p></div>
          <div><p className="font-display text-lg text-primary">{chats.length}</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Chats</p></div>
          <div><p className="font-display text-lg text-primary">0</p><p className="text-[10px] text-muted-foreground uppercase tracking-wider">Flags</p></div>
        </div>
      </div>

      <section className="mt-6 px-5">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="font-display text-lg">Current proposals</h2>
          <Link to="/wali/proposals" className="text-xs font-medium text-primary">View all</Link>
        </div>
        <div className="space-y-2">
          {people.slice(0, 3).map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <Avatar person={p} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{p.age} · {p.city} · {p.profession}</p>
              </div>
              <CompatibilityRing value={p.compatibility} size={40} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="font-display text-lg">Chats in progress</h2>
          <Link to="/wali/chats" className="text-xs font-medium text-primary">Monitor</Link>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary">
          <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5" /><span className="font-medium">You have full visibility.</span></div>
          <p className="mt-1 text-primary/80">Every message, voice note, and call between your ward and other members is available for you to review.</p>
        </div>
      </section>
    </div>
  );
}
