import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/misaq/logo";
import { people, meMember } from "@/lib/mock";
import { Avatar, CompatibilityRing, VerifiedBadge, PremiumBadge } from "@/components/misaq/bits";
import { Bell, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/app/")({ component: Home });

const prayers = [
  { name: "Fajr", time: "5:12" },
  { name: "Zuhr", time: "12:38" },
  { name: "Asr", time: "4:24", active: true },
  { name: "Maghrib", time: "6:52" },
  { name: "Isha", time: "8:14" },
];

function Home() {
  const featured = people.slice(0, 3);
  return (
    <div className="pb-8">
      <header className="relative overflow-hidden bg-gradient-royal px-6 pb-8 pt-14 text-white">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <Logo size={36} withWord tone="light" />
          <Link to="/app/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[color:var(--color-gold)]" />
          </Link>
        </div>
        <div className="relative mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Assalamu alaikum</p>
          <h1 className="mt-1 font-display text-3xl leading-tight">{meMember.name.split(" ")[0]}</h1>
        </div>

        <div className="relative mt-6 flex gap-2 overflow-x-auto rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
          {prayers.map((p) => (
            <div key={p.name} className={`flex flex-1 min-w-[64px] flex-col items-center rounded-xl px-2 py-2 text-center ${p.active ? "bg-[color:var(--color-gold)] text-[color:var(--color-gold-foreground)]" : "text-white/80"}`}>
              <span className="text-[10px] uppercase tracking-wider">{p.name}</span>
              <span className="mt-0.5 font-display text-sm">{p.time}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="mx-6 -mt-6 grid grid-cols-3 gap-3 rounded-3xl border border-border bg-card p-4 shadow-elegant">
        {[{ n: 12, l: "New matches" }, { n: 3, l: "Proposals" }, { n: 5, l: "Chats" }].map((s) => (
          <Link key={s.l} to="/app/matches" className="text-center">
            <p className="font-display text-2xl text-primary">{s.n}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 px-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-xl">Featured matches</h2>
          <Link to="/app/discover" className="text-xs font-medium text-primary">See all <ArrowRight className="inline h-3 w-3" /></Link>
        </div>
        <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
          {featured.map((p) => (
            <Link key={p.id} to="/app/profile/$id" params={{ id: p.id }} className="w-[68%] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div className="relative h-52" style={{ background: p.avatar }}>
                <div className="absolute right-3 top-3"><CompatibilityRing value={p.compatibility} tone="light" /></div>
                {p.premium && <div className="absolute left-3 top-3"><PremiumBadge /></div>}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg leading-none">{p.name}</p>
                    {p.verified && <span className="text-[color:var(--color-gold)]">✓</span>}
                  </div>
                  <p className="text-[11px] text-white/80">{p.age} • {p.profession}</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.city}</span>
                <span>{p.height}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-6">
        <h2 className="mb-3 font-display text-xl">Recent proposals</h2>
        <div className="space-y-2">
          {people.slice(3, 6).map((p) => (
            <Link key={p.id} to="/app/profile/$id" params={{ id: p.id }} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <Avatar person={p} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{p.name}</p>
                  {p.verified && <VerifiedBadge />}
                </div>
                <p className="truncate text-[11px] text-muted-foreground">Proposal received • {p.city}</p>
              </div>
              <CompatibilityRing value={p.compatibility} size={40} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
