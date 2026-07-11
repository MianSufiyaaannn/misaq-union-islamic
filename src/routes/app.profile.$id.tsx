import { createFileRoute, Link } from "@tanstack/react-router";
import { findPerson, people } from "@/lib/mock";
import { CompatibilityRing, VerifiedBadge, PremiumBadge, PhotoBg } from "@/components/misaq/bits";
import { TopBar } from "@/components/misaq/top-bar";
import { Share2, Flag, Bookmark, Heart, MapPin, BookOpen, GraduationCap, Briefcase, Home as HomeIcon, ShieldCheck } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/app/profile/$id")({ component: ProfileView });

function ProfileView() {
  const { id } = Route.useParams();
  const t = useT();
  const p = findPerson(id);
  return (
    <div className="pb-28">
      <PhotoBg person={p} className="relative h-80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
        <TopBar back tone="light" transparent right={
          <div className="flex gap-2">
            <button aria-label="share" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white"><Share2 className="h-4 w-4" /></button>
            <button aria-label="report" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white"><Flag className="h-4 w-4" /></button>
          </div>
        } />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="truncate font-display text-3xl leading-tight">{p.name}</h1>
              {p.verified && <span className="text-[color:var(--color-gold)] text-lg">✓</span>}
            </div>
            <p className="mt-1 flex items-center gap-2 text-xs text-white/85">
              <span>{p.age} {t("common.yrs")}</span>·<span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 shrink-0" /> {p.city}, {p.country}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">{p.verified && <VerifiedBadge />}{p.premium && <PremiumBadge />}</div>
          </div>
          <CompatibilityRing value={p.compatibility} size={64} tone="light" />
        </div>
      </PhotoBg>

      <div className="px-6 pt-6">
        <div className="ornament mb-4 text-[11px] uppercase tracking-[0.25em]"><span>{t("profile.about")}</span></div>
        <p className="text-sm leading-relaxed text-foreground/90" dir="auto">{p.bio}</p>

        <Section title={t("profile.eduProf")} icon={<GraduationCap className="h-4 w-4" />}>
          <Row label={t("profile.education")} value={p.education} />
          <Row label={t("profile.profession")} value={p.profession} icon={<Briefcase className="h-3.5 w-3.5" />} />
          <Row label={t("profile.height")} value={p.height} />
        </Section>

        <Section title={t("profile.religion")} icon={<BookOpen className="h-4 w-4" />}>
          <Row label={t("profile.sect")} value={p.sect} />
          <Row label={t("profile.prayer")} value={p.prayer} />
          <Row label={t("profile.quran")} value={p.quran} />
          {p.hijab && <Row label={t("profile.hijab")} value={p.hijab} />}
          {p.beard && <Row label={t("profile.beard")} value={p.beard} />}
        </Section>

        <Section title={t("profile.family")} icon={<HomeIcon className="h-4 w-4" />}>
          <Row label={t("profile.father")} value="Alive · Retired teacher" />
          <Row label={t("profile.mother")} value="Alive · Homemaker" />
          <Row label={t("profile.siblings")} value="2 brothers · 1 sister" />
          <Row label={t("profile.familyType")} value="Separate" />
        </Section>

        <Section title={t("profile.wali")} icon={<ShieldCheck className="h-4 w-4" />}>
          <Row label={t("profile.waliName")} value="Abdullah Rahman" />
          <Row label={t("profile.verified")} value="CNIC & selfie confirmed" />
        </Section>

        <Section title={t("profile.dowry")}>
          <Row label={p.gender === "male" ? "Groom" : "Bride"} value={p.gender === "male" ? "Does not accept dowry" : "Prefer not to answer"} />
        </Section>

        <div className="mt-8">
          <div className="ornament mb-4 text-[11px] uppercase tracking-[0.25em]"><span>{t("profile.compat")}</span></div>
          <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
            {people.filter(x => x.id !== p.id).slice(0, 6).map((s) => (
              <Link key={s.id} to="/app/profile/$id" params={{ id: s.id }} className="w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-card">
                <PhotoBg person={s} className="h-24" />
                <div className="p-2">
                  <p className="truncate text-xs font-medium">{s.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{s.age} · {s.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[420px] gap-3 border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        <button aria-label={t("profile.save")} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border"><Bookmark className="h-4 w-4" /></button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 font-medium text-primary-foreground shadow-elegant">
          <Heart className="h-4 w-4 fill-current" /> {t("profile.sendProposal")}
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg">
        {icon && <span className="text-primary">{icon}</span>}{title}
      </h3>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">{children}</div>
    </div>
  );
}
function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
      <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">{icon}{label}</span>
      <span className="min-w-0 truncate text-end font-medium">{value}</span>
    </div>
  );
}
