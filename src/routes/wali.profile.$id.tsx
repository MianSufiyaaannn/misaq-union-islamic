import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { findPerson } from "@/lib/mock";
import { VerifiedBadge, PremiumBadge, CompatibilityRing, PhotoBg } from "@/components/misaq/bits";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/wali/profile/$id")({ component: WaliProfileView });

function WaliProfileView() {
  const { id } = Route.useParams();
  const t = useT();
  const p = findPerson(id);
  return (
    <div className="pb-8">
      <PhotoBg person={p} className="relative h-64">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/10" />
        <TopBar back tone="light" transparent />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
          <div className="min-w-0">
            <h1 className="truncate font-display text-3xl">{p.name}</h1>
            <p className="truncate text-xs text-white/80">
              {p.age} · {p.city} · {p.profession}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.verified && <VerifiedBadge />}
              {p.premium && <PremiumBadge />}
            </div>
          </div>
          <CompatibilityRing value={p.compatibility} size={64} tone="light" />
        </div>
      </PhotoBg>
      <div className="space-y-3 px-5 py-4 text-sm">
        <p className="text-muted-foreground" dir="auto">
          {t("wali.review.subtitle")}
        </p>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("wali.review.theirWali")}
          </p>
          <p className="mt-1 font-medium">{t("wali.review.waliName")}</p>
          <p className="text-xs text-muted-foreground">{t("wali.review.waliContact")}</p>
          <button
            onClick={() => toast.success(`Request sent to coordinate with ${p.name}'s Wali.`)}
            className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-medium text-primary-foreground cursor-pointer"
          >
            {t("wali.review.message")}
          </button>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="font-medium">{t("profile.about")}</p>
          <p className="mt-1 text-xs text-muted-foreground" dir="auto">
            {p.bio}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 text-xs space-y-1 text-left">
          <p className="mb-2 font-medium">{t("wali.review.religious")}</p>
          <p className="text-muted-foreground">
            Religion: Islam
          </p>
          <p className="text-muted-foreground">
            Maslak / Sect: {p.sect}
          </p>
          <p className="text-muted-foreground">
            {p.gender === "male" ? "Prayer in Masjid" : "Prayer"}: {p.prayer}
          </p>
          <p className="text-muted-foreground">
            {t("profile.quran")}: {p.quran}
          </p>
          {p.religiousPractice && (
            <p className="text-muted-foreground">
              Religious Practice: {p.religiousPractice}
            </p>
          )}
          {p.religiousEnvironment && (
            <p className="text-muted-foreground">
              Religious Environment: {p.religiousEnvironment}
            </p>
          )}
          {p.hijab && (
            <p className="text-muted-foreground">
              Hijab / Niqab: {p.hijab}
            </p>
          )}
          {p.beard && (
            <p className="text-muted-foreground">
              Beard: {p.beard}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
