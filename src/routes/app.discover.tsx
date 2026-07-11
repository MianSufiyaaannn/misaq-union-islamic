import { createFileRoute, Link } from "@tanstack/react-router";
import { people } from "@/lib/mock";
import { CompatibilityRing, VerifiedBadge, PremiumBadge, PhotoBg } from "@/components/misaq/bits";
import { SlidersHorizontal, MapPin, Heart, Bookmark } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/app/discover")({ component: Discover });

function Discover() {
  const t = useT();
  const chips = [t("discover.filter.all"), "22–28", "Pakistan", "Hafiz", "Doctor", "Sunnah", "Niqab"];
  return (
    <div className="pb-8">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 pb-3 pt-14 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-2xl truncate">{t("discover.title")}</h1>
            <p className="text-[11px] text-muted-foreground truncate">{people.length} {t("discover.count")}</p>
          </div>
          <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-soft" aria-label={t("common.filter")}>
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {chips.map((c, i) => (
            <span key={c} className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium ${i === 0 ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{c}</span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {people.map((p) => (
          <Link key={p.id} to="/app/profile/$id" params={{ id: p.id }} className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
            <PhotoBg person={p} className="h-48">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute end-2 top-2"><CompatibilityRing value={p.compatibility} size={44} tone="light" /></div>
              {p.premium && <div className="absolute start-2 top-2"><PremiumBadge /></div>}
              <div className="absolute inset-x-0 bottom-0 p-2 text-white">
                <p className="font-display text-sm leading-tight truncate">{p.name}, {p.age}</p>
                <p className="text-[10px] text-white/80 flex items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0" />{p.city}</p>
              </div>
            </PhotoBg>
            <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px]">
              <span className="min-w-0 truncate text-muted-foreground">{p.profession}</span>
              <div className="flex shrink-0 gap-1.5">
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-muted" aria-label={t("profile.save")}><Bookmark className="h-3 w-3" /></button>
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-label={t("profile.sendProposal")}><Heart className="h-3 w-3 fill-current" /></button>
              </div>
            </div>
            {p.verified && <div className="border-t border-border px-3 py-1.5"><VerifiedBadge /></div>}
          </Link>
        ))}
      </div>
    </div>
  );
}
