import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/misaq/logo";
import { usePeople, useMe, useChats, useProposals } from "@/lib/mock";
import {
  Avatar,
  CompatibilityRing,
  VerifiedBadge,
  PremiumBadge,
  PhotoBg,
} from "@/components/misaq/bits";
import { 
  Bell, 
  MapPin, 
  ArrowRight, 
  BookOpen, 
  Heart, 
  MessageSquare, 
  FileText, 
  User, 
  CheckCircle2, 
  Circle 
} from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({ component: Home });

const prayers = [
  { name: "Fajr", time: "5:12" },
  { name: "Zuhr", time: "12:38" },
  { name: "Asr", time: "4:24", active: true },
  { name: "Maghrib", time: "6:52" },
  { name: "Isha", time: "8:14" },
];

const reminders = [
  {
    text: "The best among you are those who are best to their wives.",
    ref: "Sahih al-Tirmidhi",
  },
  {
    text: "A woman is married for four things: her wealth, her family status, her beauty and her religion. So you should marry the religious woman.",
    ref: "Sahih al-Bukhari",
  },
  {
    text: "There is nothing like marriage, for two who love one another.",
    ref: "Sunan Ibn Majah",
  },
  {
    text: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.",
    ref: "Surah Ar-Rum (30:21)",
  },
  {
    text: "When a man marries, he has fulfilled half of the religion; so let him fear Allah regarding the remaining half.",
    ref: "Al-Tirmidhi",
  }
];

function Home() {
  const t = useT();
  const [me] = useMe();
  const [chats] = useChats();
  const [proposals] = useProposals();
  const [peopleList] = usePeople();
  const featured = peopleList.slice(0, 6);
  const recent = peopleList.slice(6, 10);

  const dayIdx = new Date().getDate() % reminders.length;
  const dailyReminder = reminders[dayIdx];

  const journeySteps = [
    { label: "Profile Completed", completed: true },
    { label: "Identity Verified", completed: me.verificationStatus === "Verified" },
    { label: "Wali Added", completed: !!me.waliName },
    { label: "Waiting for Match", completed: true },
    { label: "Proposal Sent", completed: proposals.sent.length > 0 },
    { label: "Premium Unlocked", completed: me.premium === true },
  ];

  return (
    <div className="relative h-full overflow-y-auto pb-24 bg-surface/30">
      {/* Custom Styles for Floating Lanterns and Smooth Transitions */}
      <style>{`
        @keyframes float-lantern-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1.5deg); }
        }
        @keyframes float-lantern-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1.5deg); }
        }
        @keyframes pulse-glow-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        @keyframes pulse-indicator {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .animate-float-slow {
          animation: float-lantern-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-lantern-medium 6s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow-slow 5s ease-in-out infinite;
        }
        .animate-pulse-indicator {
          animation: pulse-indicator 1.5s ease-in-out infinite;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Repeating Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.015] mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 30,0 L 60,30 L 30,60 L 0,30 Z M 30,10 L 50,30 L 30,50 L 10,30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.75"
                className="text-primary"
              />
              <circle cx="30" cy="30" r="2.5" fill="currentColor" className="text-gold" />
              <path
                d="M0,0 L60,60 M60,0 L0,60"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                className="text-primary/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid-pattern)" />
        </svg>
      </div>

      {/* Floating Lanterns and Glowing Light Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Glowing Orbs */}
        <div className="absolute top-[10%] left-[-10%] w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-pulse-glow" />
        <div className="absolute top-[40%] right-[-10%] w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse-glow" />
        
        {/* Floating Islamic Lantern Left */}
        <div className="absolute top-28 left-3 w-10 h-18 opacity-[0.15] dark:opacity-[0.25] animate-float-slow text-primary">
          <svg viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 2v6M12 8h16M20 8c-7 0-10 6-10 10h20c0-4-3-10-10-10z" fill="currentColor" />
            <path d="M10 18h20v25H10z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 18l5 25h10l5-25" stroke="currentColor" strokeWidth="1" />
            <path d="M15 18l5 25M25 18l-5 25" stroke="currentColor" strokeWidth="0.75" />
            <path d="M10 43h20v4H10z" fill="currentColor" />
            <path d="M20 47v10M17 57h6" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        {/* Floating Islamic Lantern Right */}
        <div className="absolute top-64 right-4 w-8 h-14 opacity-[0.12] dark:opacity-[0.2] animate-float-medium text-gold">
          <svg viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M20 2v6M12 8h16M20 8c-7 0-10 6-10 10h20c0-4-3-10-10-10z" fill="currentColor" />
            <path d="M10 18h20v25H10z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 18l5 25h10l5-25" stroke="currentColor" strokeWidth="1" />
            <path d="M15 18l5 25M25 18l-5 25" stroke="currentColor" strokeWidth="0.75" />
            <path d="M10 43h20v4H10z" fill="currentColor" />
            <path d="M20 47v10M17 57h6" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>

      <header className="relative overflow-hidden bg-gradient-royal px-6 pb-8 pt-14 text-white">
        <div className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center justify-between gap-3">
          <Logo size={36} withWord tone="light" />
          <Link
            to="/app/notifications"
            aria-label={t("notif.title")}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all hover:bg-white/10 hover:border-white/30"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute end-2 top-2 h-2 w-2 rounded-full bg-[color:var(--color-gold)] animate-pulse" />
          </Link>
        </div>

        {/* ELEGANT GLASS ISLAMIC HERO CARD */}
        <div className="relative mt-6 rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur-xl shadow-luxury text-center overflow-hidden">
          {/* Subtle Islamic Geometric Medallion in Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08] flex items-center justify-center">
            <svg className="w-44 h-44 text-[color:var(--color-gold)]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 5 L62 38 L95 50 L62 62 L50 95 L38 62 L5 50 L38 38 Z" />
              <path d="M50 15 L59 41 L85 50 L59 59 L50 85 L41 59 L15 50 L41 41 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>

          {/* Decorative Corner Accents */}
          <div className="absolute inset-2.5 border border-white/5 rounded-[22px] pointer-events-none" />
          <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[color:var(--color-gold)]/40 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[color:var(--color-gold)]/40 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[color:var(--color-gold)]/40 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[color:var(--color-gold)]/40 rounded-br-sm pointer-events-none" />

          <p className="text-[9px] uppercase tracking-[0.25em] text-white/50 mb-3.5 font-sans font-medium">Verse of the Day</p>
          
          {/* Large Centered Arabic Verse */}
          <p className="font-arabic text-2xl md:text-3xl text-[color:var(--color-gold)] leading-loose mb-4 text-center select-none drop-shadow-[0_2px_10px_rgba(212,175,55,0.25)]" dir="rtl">
            وَأَنْكِحُوا الْأَيَامَىٰ مِنْكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ ۗ وَاللَّهُ وَاسِعٌ عَلِيمٌ
          </p>

          {/* Urdu Translation */}
          <p className="text-xs md:text-sm text-white/90 leading-relaxed mb-4 font-urdu px-3 max-w-md mx-auto text-center" dir="rtl">
            "اور تم میں سے جو غیر شادی شدہ ہوں ان کے نکاح کر دو، اور اگر وہ غریب ہوں گے تو اللہ اپنے فضل سے انہیں غنی کر دے گا۔"
          </p>

          {/* Reference with Quran Icon */}
          <div className="inline-flex items-center gap-2 text-[10px] text-[color:var(--color-gold)] bg-white/10 py-1.5 px-4 rounded-full border border-white/10 shadow-soft mx-auto backdrop-blur-sm">
            <svg className="h-3.5 w-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-display font-medium tracking-wide">Surah An-Nur (24:32)</span>
          </div>

          {/* Halal Journey Subtitle */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
            <span className="text-sm select-none">🌙</span>
            <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">
              Begin your halal journey toward marriage
            </p>
          </div>
        </div>

        {/* Prayer Times Row */}
        <div className="relative mt-6 flex gap-2 overflow-x-auto rounded-2xl bg-white/[0.06] p-2 backdrop-blur-md border border-white/10 scrollbar-none">
          {prayers.map((p) => (
            <div
              key={p.name}
              className={cn(
                "flex flex-1 min-w-[66px] flex-col items-center rounded-xl px-2 py-2 text-center transition-all duration-300",
                p.active 
                  ? "bg-gradient-gold text-[color:var(--color-gold-foreground)] shadow-gold font-semibold scale-105" 
                  : "text-white/70 hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase tracking-wider">{p.name}</span>
                {p.active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-gold-foreground)] animate-pulse-indicator" />
                )}
              </div>
              <span className="mt-0.5 font-display text-sm">{p.time}</span>
            </div>
          ))}
        </div>
      </header>

      {me.verificationStatus !== "Verified" && (
        <div className="mx-6 mt-4 p-4 rounded-2xl border border-dashed border-primary bg-primary/5 space-y-2 animate-fade-in text-left">
          <div className="flex items-center gap-2 text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="font-semibold text-xs">Profile Status: {me.verificationStatus}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal">
            {me.verificationStatus === "Rejected"
              ? `Verification Rejected. Reason: ${me.rejectionReason || "Blurry documents"}. Please go to Profile > Update Documents to resubmit.`
              : "Your profile is currently under verification. Discover and Matching workflows are locked until your documents are approved by our administrative team."}
          </p>
        </div>
      )}

      {/* QUICK ACTIONS SECTION */}
      <section className="mt-6 px-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: "Discover Match",
              icon: <Heart className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-300" />,
              desc: "Find compatible spouses",
              to: "/app/discover" as const,
              bg: "from-primary/5 to-transparent",
              border: "hover:border-primary/40"
            },
            {
              label: "Messages",
              icon: <MessageSquare className="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform duration-300" />,
              desc: "Secure halal chats",
              to: "/app/chats" as const,
              bg: "from-amber-500/5 to-transparent",
              border: "hover:border-amber-500/40"
            },
            {
              label: "My Proposals",
              icon: <FileText className="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />,
              desc: "Sent & received proposals",
              to: "/app/matches" as const,
              bg: "from-emerald-500/5 to-transparent",
              border: "hover:border-emerald-500/40"
            },
            {
              label: "My Profile",
              icon: <User className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />,
              desc: "Manage verification & deen",
              to: "/app/profile" as const,
              bg: "from-blue-500/5 to-transparent",
              border: "hover:border-blue-500/40"
            }
          ].map((act) => (
            <Link
              key={act.label}
              to={act.to}
              className={cn(
                "group relative flex flex-col justify-between p-5 rounded-3xl border border-border/80 bg-card shadow-soft text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-luxury overflow-hidden",
                act.border
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-500 group-hover:opacity-60", act.bg)} />
              
              {/* Premium Corner Ornament on Hover */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 text-[color:var(--color-gold)] opacity-0 group-hover:opacity-[0.12] transition-opacity duration-500 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                  <path d="M100 0 L100 100 L0 100 Z" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-surface to-muted border border-border/60 shadow-soft transition-all duration-500 group-hover:from-[color:var(--color-gold)]/10 group-hover:to-transparent group-hover:border-[color:var(--color-gold)]/30 group-hover:shadow-gold">
                  {act.icon}
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {act.label}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 leading-normal">
                  {act.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TODAY'S REMINDER */}
      <section className="mt-8 px-6 text-left">
        <h2 className="mb-4 text-center font-display text-lg font-medium text-foreground ornament">Today's Reminder</h2>
        <div className="relative rounded-3xl border border-[color:var(--color-gold)]/20 bg-gradient-to-br from-card to-[color:var(--color-gold)]/5 p-6 shadow-soft text-center overflow-hidden">
          {/* Subtle Decorative Inner Border */}
          <div className="absolute inset-2 border border-[color:var(--color-gold)]/10 rounded-[22px] pointer-events-none" />
          
          <div className="absolute top-0 end-0 p-4 opacity-[0.03] pointer-events-none">
            <svg className="w-20 h-20 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 0 0 2 12c0 3.9 2.2 7.2 5.5 8.7L6.5 22h11l-1-1.3c3.3-1.5 5.5-4.8 5.5-8.7A10 10 0 0 0 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
            </svg>
          </div>

          <div className="flex justify-center mb-1 select-none pointer-events-none">
            <span className="text-4xl text-[color:var(--color-gold)] font-serif leading-none">“</span>
          </div>
          
          <p className="font-serif italic text-sm md:text-base text-foreground/90 leading-relaxed px-3">
            "{dailyReminder.text}"
          </p>
          
          <p className="mt-4 text-[10px] font-semibold text-primary uppercase tracking-widest block text-center">
            — {dailyReminder.ref}
          </p>
        </div>
      </section>

      {/* MATRIMONIAL JOURNEY PROGRESS */}
      <section className="mt-8 px-6 text-left">
        <h2 className="mb-4 text-center font-display text-lg font-medium text-foreground ornament">Your Matrimonial Journey</h2>
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft relative overflow-hidden">
          
          <div className="relative pl-7 space-y-4">
            {/* Timeline Vertical Progress Line */}
            <div className="absolute left-[10px] top-2 bottom-2 w-[1.5px] bg-muted" />
            
            {journeySteps.map((step, idx) => (
              <div key={idx} className="relative flex items-center gap-4 group">
                {/* Custom Glowing Progress Node */}
                <div className="absolute -left-7 flex items-center justify-center">
                  <span className={cn(
                    "flex h-5.5 w-5.5 items-center justify-center rounded-full border transition-all duration-300",
                    step.completed 
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                      : "bg-background border-border text-muted-foreground/40"
                  )}>
                    {step.completed ? (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} />
                    ) : (
                      <Circle className="h-2 w-2 fill-muted-foreground/30" />
                    )}
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className={cn(
                    "text-xs font-semibold transition-colors duration-300",
                    step.completed ? "text-foreground" : "text-muted-foreground/80"
                  )}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 px-6">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-display text-xl truncate">{t("home.featured")}</h2>
          <Link to="/app/discover" className="shrink-0 text-xs font-medium text-primary">
            {t("common.viewAll")} <ArrowRight className="inline h-3 w-3" />
          </Link>
        </div>
        <div className="-mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2">
          {featured.map((p) => (
            <Link
              key={p.id}
              to="/app/profile/$id"
              params={{ id: p.id }}
              className="w-[68%] shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
            >
              <PhotoBg person={p} className="relative h-52">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute end-3 top-3">
                  <CompatibilityRing value={p.compatibility} tone="light" />
                </div>
                {p.premium && (
                  <div className="absolute start-3 top-3">
                    <PremiumBadge />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-lg leading-none">{p.name}</p>
                    {p.verified && <span className="text-[color:var(--color-gold)]">✓</span>}
                  </div>
                  <p className="truncate text-[11px] text-white/80">
                    {p.age} • {p.profession}
                  </p>
                </div>
              </PhotoBg>
              <div className="flex items-center justify-between gap-2 px-4 py-3 text-[11px] text-muted-foreground">
                <span className="flex min-w-0 items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 shrink-0" /> {p.city}
                </span>
                <span className="shrink-0">{p.height}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 px-6">
        <h2 className="mb-3 font-display text-xl">{t("home.recent")}</h2>
        <div className="space-y-2">
          {recent.map((p) => (
            <Link
              key={p.id}
              to="/app/profile/$id"
              params={{ id: p.id }}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <Avatar person={p} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="truncate font-medium">{p.name}</p>
                  {p.verified && <VerifiedBadge />}
                </div>
                <p className="truncate text-[11px] text-muted-foreground">
                  {t("home.proposalReceived")} • {p.city}
                </p>
              </div>
              <CompatibilityRing value={p.compatibility} size={40} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
