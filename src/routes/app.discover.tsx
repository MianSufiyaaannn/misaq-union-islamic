import { createFileRoute, Link } from "@tanstack/react-router";
import { people } from "@/lib/mock";
import { CompatibilityRing, VerifiedBadge, PremiumBadge } from "@/components/misaq/bits";
import { SlidersHorizontal, MapPin, Heart, Bookmark } from "lucide-react";

export const Route = createFileRoute("/app/discover")({ component: Discover });

function Discover() {
  return (
    <div className="pb-8">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 pb-3 pt-14 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl">Discover</h1>
            <p className="text-[11px] text-muted-foreground">{people.length} verified profiles matching your filters</p>
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-soft">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {["All", "Age 22-28", "Pakistan", "Hafiz", "Doctor", "Sunnah beard", "Niqab"].map((c, i) => (
            <span key={c} className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium ${i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{c}</span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {people.map((p) => (
          <Link key={p.id} to="/app/profile/$id" params={{ id: p.id }} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <div className="relative h-48" style={{ background: p.avatar }}>
              <div className="absolute right-2 top-2"><CompatibilityRing value={p.compatibility} size={44} tone="light" /></div>
              {p.premium && <div className="absolute left-2 top-2"><PremiumBadge /></div>}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                <p className="font-display text-sm leading-tight">{p.name}, {p.age}</p>
                <p className="text-[10px] text-white/80 flex items-center gap-1"><MapPin className="h-3 w-3" />{p.city}</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[10px]">
              <span className="truncate text-muted-foreground">{p.profession}</span>
              <div className="flex gap-1.5">
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-muted"><Bookmark className="h-3 w-3" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"><Heart className="h-3 w-3 fill-current" /></button>
              </div>
            </div>
            {p.verified && <div className="border-t border-border px-3 py-1.5"><VerifiedBadge /></div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
