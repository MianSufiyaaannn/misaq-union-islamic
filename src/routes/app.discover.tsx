import { createFileRoute, Link } from "@tanstack/react-router";
import {
  people,
  usePeople,
  useProposals,
  useMe,
  useChats,
  useRejectedProfiles,
  useNextMatchAvailableAt,
  type Person,
  getPhotoRequests,
  setPhotoRequest,
  getMatchId,
  hasPhotoAccess,
  addNotification,
  calculateCompatibility,
} from "@/lib/mock";
import { CompatibilityRing, VerifiedBadge, PremiumBadge, PhotoBg } from "@/components/misaq/bits";
import {
  SlidersHorizontal,
  MapPin,
  Heart,
  Bookmark,
  X,
  SearchX,
  ShieldAlert,
  Lock,
} from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/app/discover")({ component: Discover });

// ---------- Derived attributes (deterministic per profile, mock only) ----------
const NATIONALITIES = [
  "Pakistani",
  "Emirati",
  "Saudi",
  "British",
  "Canadian",
  "American",
  "Turkish",
  "Malaysian",
  "Indonesian",
];
const MARITALS = ["Never Married", "Divorced", "Widowed"] as const;
const RELIGIOUS = ["Very Religious", "Religious", "Moderately Religious"] as const;
const FAMILY_TYPES = ["Nuclear", "Joint"] as const;
const DOWRY = ["No Dowry", "Simple", "As per Sunnah"] as const;
const CHILDREN = ["No Children", "1 Child", "2 Children", "3+"] as const;
const RELOCATION = ["Willing to Relocate", "Prefer Same City", "Open to Discussion"] as const;
const INCOMES = ["< 50k", "50k – 150k", "150k – 300k", "300k – 600k", "600k+"] as const;

function hash(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h;
}
function pickAt<T>(arr: readonly T[], seed: number) {
  return arr[seed % arr.length];
}

type Derived = {
  nationality: string;
  maritalStatus: string;
  religiousLevel: string;
  familyType: string;
  dowry: string;
  children: string;
  relocation: string;
  income: string;
  online: boolean;
  recentlyActive: boolean;
};

function derive(p: Person): Derived {
  const s = hash(p.id);
  return {
    nationality: pickAt(NATIONALITIES, s),
    maritalStatus: pickAt(MARITALS, s >> 2),
    religiousLevel: pickAt(RELIGIOUS, s >> 3),
    familyType: pickAt(FAMILY_TYPES, s >> 4),
    dowry: pickAt(DOWRY, s >> 5),
    children: pickAt(CHILDREN, s >> 6),
    relocation: pickAt(RELOCATION, s >> 7),
    income: pickAt(INCOMES, s >> 8),
    online: s % 7 === 0,
    recentlyActive: s % 3 !== 0,
  };
}

function heightToInches(h: string): number {
  const m = h.match(/(\d+)'(\d+)/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 12 + parseInt(m[2], 10);
}
const inchesToLabel = (i: number) => `${Math.floor(i / 12)}'${i % 12}"`;

// ---------- Filter state ----------
type Filters = {
  ageMin: number;
  ageMax: number;
  heightMin: number;
  heightMax: number; // inches
  country: string;
  city: string;
  nationality: string;
  gender: "" | "male" | "female";
  maritalStatus: string;
  education: string;
  profession: string;
  income: string;
  prayer: string;
  quran: string;
  religiousLevel: string;
  hijab: string;
  beard: string;
  sect: string;
  familyType: string;
  dowry: string;
  children: string;
  relocation: string;
  verifiedOnly: boolean;
  premiumOnly: boolean;
  onlineNow: boolean;
  recentlyActive: boolean;
};

const DEFAULTS: Filters = {
  ageMin: 18,
  ageMax: 60,
  heightMin: 54,
  heightMax: 84,
  country: "",
  city: "",
  nationality: "",
  gender: "",
  maritalStatus: "",
  education: "",
  profession: "",
  income: "",
  prayer: "",
  quran: "",
  religiousLevel: "",
  hijab: "",
  beard: "",
  sect: "",
  familyType: "",
  dowry: "",
  children: "",
  relocation: "",
  verifiedOnly: false,
  premiumOnly: false,
  onlineNow: false,
  recentlyActive: false,
};

const STORAGE_KEY = "misaq.discover.filters";

function loadFilters(): Filters {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

// ---------- Options (derived from data) ----------
const uniq = <T,>(a: T[]) => Array.from(new Set(a)).sort();
const COUNTRIES = uniq(people.map((p) => p.country));
const CITIES = uniq(people.map((p) => p.city));
const PROFESSIONS = uniq(people.map((p) => p.profession));
const EDUCATIONS = uniq(people.map((p) => p.education));
const SECTS = uniq(people.map((p) => p.sect));
const PRAYERS = uniq(people.map((p) => p.prayer));
const QURANS = uniq(people.map((p) => p.quran));
const HIJABS = uniq(people.filter((p) => p.hijab).map((p) => p.hijab!));
const BEARDS = uniq(people.filter((p) => p.beard).map((p) => p.beard!));

// ---------- Component ----------
function Discover() {
  const t = useT();
  const [filters, setFilters] = useState<Filters>(DEFAULTS);
  const [open, setOpen] = useState(false);
  const [peopleList] = usePeople();
  const [proposals, updateProposals] = useProposals();
  const [me] = useMe();
  const [chats] = useChats();
  const [photoRequests, setPhotoRequests] = useState(() => getPhotoRequests());

  const handleRequestPhotoAccess = (target: Person) => {
    const matchId = getMatchId(me.id, target.id);
    setPhotoRequest(matchId, "pending");
    setPhotoRequests(getPhotoRequests());

    addNotification({
      kind: "photo_request",
      title: "Photo Access Request",
      desc: `${me.name} has requested access to view your profile photo.`,
      personId: me.id,
      recipientId: target.id,
      photoRequest: {
        requesterId: me.id,
        matchId,
        status: "pending",
      },
    });

    toast.success(`Photo access request sent to ${target.name.split(" ")[0]} successfully!`);
  };

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const b = localStorage.getItem("misaq_bookmarks");
      return b ? JSON.parse(b) : [];
    }
    return [];
  });

  const [rejectedIds, updateRejectedIds] = useRejectedProfiles();
  const [nextMatchAvailableAt, setNextMatchAvailableAt] = useNextMatchAvailableAt();
  const [tempProcessedIds, setTempProcessedIds] = useState<string[]>([]);

  const COUNTDOWN_SECONDS = 20;
  const [countdown, setCountdown] = useState<number>(() =>
    nextMatchAvailableAt ? Math.max(0, Math.ceil((nextMatchAvailableAt - Date.now()) / 1000)) : 0,
  );

  useEffect(() => {
    if (!nextMatchAvailableAt) {
      setCountdown(0);
      return;
    }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((nextMatchAvailableAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) setNextMatchAvailableAt(null);
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [nextMatchAvailableAt]);

  const handleReject = (personId: string) => {
    updateRejectedIds((prev) => [...prev, personId]);
    setNextMatchAvailableAt(Date.now() + COUNTDOWN_SECONDS * 1000);
    toast.error("Profile rejected. Finding next match...");
  };

  const handleSaveForLater = (id: string, name: string) => {
    if (!bookmarks.includes(id)) {
      const next = [...bookmarks, id];
      setBookmarks(next);
      if (typeof window !== "undefined") {
        localStorage.setItem("misaq_bookmarks", JSON.stringify(next));
      }
      toast.success(`Saved ${name.split(" ")[0]}'s profile`);
    }
  };

  const handleSendProposal = (person: Person) => {
    const isAlreadySent = proposals.sent.some((s) => s.id === person.id);
    const isAlreadyAccepted = proposals.accepted.some((s) => s.id === person.id);
    const isAlreadyReceived = proposals.received.some((s) => s.id === person.id);

    if (isAlreadySent || isAlreadyAccepted || isAlreadyReceived) {
      toast.info(`Proposal already active for ${person.name}`);
      return;
    }

    // Immediately remove from feed
    setTempProcessedIds((prev) => [...prev, person.id]);

    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          updateProposals((prev) => {
            if (prev.sent.some((s) => s.id === person.id)) return prev;
            return {
              ...prev,
              sent: [...prev.sent, person],
            };
          });
          resolve(true);
        }, 1000);
      }),
      {
        loading: "Sending proposal with dignity...",
        success: () => `Proposal sent to ${person.name.split(" ")[0]} successfully!`,
        error: "Error sending proposal.",
      },
    );
  };

  useEffect(() => {
    setFilters(loadFilters());
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      /* noop */
    }
  }, [filters]);

  const derivedById = useMemo(() => {
    const map = new Map<string, Derived>();
    peopleList.forEach((p) => map.set(p.id, derive(p)));
    return map;
  }, [peopleList]);

  const results = useMemo(() => {
    const filtered = peopleList.filter((p) => {
      // Exclude same gender profiles
      if (p.gender === me.gender) return false;

      // Only show Verified members in Discover
      if (p.verificationStatus !== "Verified") return false;

      // Exclude rejected candidates
      if (rejectedIds.includes(p.id)) return false;

      // Exclude saved for later (bookmarks)
      if (bookmarks.includes(p.id)) return false;

      // Exclude candidates with active or received proposals
      const hasSent = proposals.sent.some((s) => s.id === p.id);
      const hasAccepted = proposals.accepted.some((s) => s.id === p.id);
      const hasReceived = proposals.received.some((s) => s.id === p.id);
      if (hasSent || hasAccepted || hasReceived) return false;

      // Exclude temporary processed IDs
      if (tempProcessedIds.includes(p.id)) return false;

      const d = derivedById.get(p.id)!;
      if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
      const inches = heightToInches(p.height);
      if (inches < filters.heightMin || inches > filters.heightMax) return false;
      if (filters.country && p.country !== filters.country) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (filters.nationality && d.nationality !== filters.nationality) return false;
      if (filters.gender && p.gender !== filters.gender) return false;
      if (filters.maritalStatus && d.maritalStatus !== filters.maritalStatus) return false;
      if (filters.education && p.education !== filters.education) return false;
      if (filters.profession && p.profession !== filters.profession) return false;
      if (filters.income && d.income !== filters.income) return false;
      if (filters.prayer && p.prayer !== filters.prayer) return false;
      if (filters.quran && p.quran !== filters.quran) return false;
      if (filters.religiousLevel && d.religiousLevel !== filters.religiousLevel) return false;
      if (filters.hijab && p.hijab !== filters.hijab) return false;
      if (filters.beard && p.beard !== filters.beard) return false;
      if (filters.sect && p.sect !== filters.sect) return false;
      if (filters.familyType && d.familyType !== filters.familyType) return false;
      if (filters.dowry && d.dowry !== filters.dowry) return false;
      if (filters.children && d.children !== filters.children) return false;
      if (filters.relocation && d.relocation !== filters.relocation) return false;
      if (filters.verifiedOnly && !p.verified) return false;
      if (filters.premiumOnly && !p.premium) return false;
      if (filters.onlineNow && !d.online) return false;
      if (filters.recentlyActive && !d.recentlyActive) return false;
      return true;
    });

    return [...filtered].sort((a, b) => b.compatibility - a.compatibility);
  }, [
    filters,
    derivedById,
    peopleList,
    me.gender,
    rejectedIds,
    bookmarks,
    proposals,
    tempProcessedIds,
  ]);

  const totalUnfilteredRemaining = useMemo(() => {
    return peopleList.filter((p) => {
      if (p.gender === me.gender) return false;
      if (p.verificationStatus !== "Verified") return false;
      if (rejectedIds.includes(p.id)) return false;
      if (bookmarks.includes(p.id)) return false;
      const hasSent = proposals.sent.some((s) => s.id === p.id);
      const hasAccepted = proposals.accepted.some((s) => s.id === p.id);
      const hasReceived = proposals.received.some((s) => s.id === p.id);
      if (hasSent || hasAccepted || hasReceived) return false;
      if (tempProcessedIds.includes(p.id)) return false;
      return true;
    }).length;
  }, [peopleList, me.gender, rejectedIds, bookmarks, proposals, tempProcessedIds]);

  const chips = useMemo(() => activeChips(filters), [filters]);
  const activeCount = chips.length;
  const clearAll = () => setFilters(DEFAULTS);
  const removeChip = (key: keyof Filters) =>
    setFilters((f) => ({ ...f, [key]: DEFAULTS[key] }) as Filters);

  // Verification Block Screen
  if (me.verificationStatus !== "Verified") {
    return (
      <div className="flex min-h-full flex-col items-center justify-center bg-background px-8 text-center py-16 space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldAlert className="h-8 w-8 animate-pulse" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="font-display text-xl font-bold text-foreground">Verification Required</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {me.verificationStatus === "Rejected"
              ? `Your profile verification was rejected. Reason: ${me.rejectionReason || "Blurry documents"}. Please go to Profile > Update Documents to resubmit.`
              : "Your profile is currently under verification. Discover recommendations will be unlocked and visible as soon as your account is approved."}
          </p>
        </div>
        {me.verificationStatus === "Rejected" && (
          <Link
            to="/app/profile"
            className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft"
          >
            Go to Profile
          </Link>
        )}
      </div>
    );
  }

  // Full-screen blocking Rejection Loading State
  if (countdown > 0) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center px-8 text-center space-y-6 animate-fade-in">
        <div className="relative flex items-center justify-center h-40 w-40">
          {/* Smooth spinner circular path */}
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="80"
              cy="80"
              r="70"
              className="stroke-muted-foreground/10 fill-none"
              strokeWidth="6"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              className="stroke-primary fill-none transition-all duration-1000"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 70}
              strokeDashoffset={2 * Math.PI * 70 * (1 - countdown / COUNTDOWN_SECONDS)}
            />
          </svg>
          <div className="flex flex-col items-center justify-center z-10">
            <span className="font-display text-4xl font-bold text-primary">{countdown}</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              Seconds
            </span>
          </div>
        </div>

        <div className="space-y-2 max-w-sm">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Finding your next compatible match...
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Misaq is curating highly compatible candidate matches based on your Sharia preferences,
            values, and profile metrics.
          </p>
        </div>

        {/* Premium Loading Animation */}
        <div className="flex items-center gap-1.5 py-4">
          <span
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden pb-4">
      <header
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 pb-3 backdrop-blur shrink-0"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-2xl truncate">{t("discover.title")}</h1>
            <p className="text-[11px] text-muted-foreground truncate">
              {results.length} {t("discover.count")}
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="relative flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 shadow-soft"
            aria-label={t("common.filter")}
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeCount > 0 && (
              <span className="text-[11px] font-semibold text-primary">({activeCount})</span>
            )}
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {chips.length === 0 ? (
            <span className="shrink-0 rounded-full border border-primary bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
              {t("discover.filter.all")}
            </span>
          ) : (
            <>
              {chips.map((c) => (
                <button
                  key={c.key + c.label}
                  onClick={() => removeChip(c.key)}
                  className="flex shrink-0 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary"
                >
                  {c.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
              <button
                onClick={clearAll}
                className="shrink-0 rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </header>

      {totalUnfilteredRemaining === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <SearchX className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-5 font-display text-lg">
            No compatible profiles are available right now.
          </h2>
          <p className="mt-2 max-w-xs text-xs text-muted-foreground">
            We'll notify you when new members join.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex-1 overflow-y-auto">
          <EmptyState onClear={clearAll} />
        </div>
      ) : (
        (() => {
          const currentProfile = results[0];
          const { reasons } = calculateCompatibility(me, currentProfile);
          const hasAccess = hasPhotoAccess(me, currentProfile, chats, proposals, "member");
          const matchId = getMatchId(me.id, currentProfile.id);
          const reqStatus = photoRequests[matchId];
          return (
            <div className="flex-1 min-h-0 mx-4 my-3 flex flex-col items-center justify-between">
              {/* Card Container */}
              <div className="flex-1 min-h-0 w-full max-w-[420px] overflow-hidden rounded-3xl border border-border bg-card shadow-soft flex flex-col">
                <Link to="/app/profile/$id" params={{ id: currentProfile.id }} className="block flex-1 min-h-0 relative">
                  <PhotoBg person={currentProfile} className="h-full w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {!hasAccess && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-6 text-center space-y-3 z-10">
                        <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                        <p className="text-xs font-semibold max-w-[200px] leading-normal">
                          This member has chosen to keep her profile photo private.
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (reqStatus === "pending") return;
                            handleRequestPhotoAccess(currentProfile);
                          }}
                          className={cn(
                            "rounded-full px-5 py-2.5 text-xs font-semibold shadow-md transition-all cursor-pointer",
                            reqStatus === "pending"
                              ? "bg-white/20 text-white/60 cursor-not-allowed border border-white/10"
                              : "bg-primary text-primary-foreground hover:bg-primary/95",
                          )}
                          disabled={reqStatus === "pending"}
                        >
                          {reqStatus === "pending"
                            ? "Photo Access Requested"
                            : "Request Photo Access"}
                        </button>
                      </div>
                    )}

                    {/* Top badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {currentProfile.premium && <PremiumBadge />}
                      {currentProfile.verified && <VerifiedBadge />}
                    </div>

                    <div className="absolute top-4 right-4">
                      <CompatibilityRing
                        value={currentProfile.compatibility}
                        size={48}
                        tone="light"
                      />
                    </div>

                    {/* Profile Text Details */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white text-left">
                      <div className="flex items-baseline gap-2">
                        <h2 className="font-display text-2xl font-bold">{currentProfile.name}</h2>
                        <span className="text-xl font-light">{currentProfile.age}</span>
                      </div>
                      <p className="mt-1 text-sm text-white/80 flex items-center gap-1">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {currentProfile.city}, {currentProfile.country}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-white/70 border-t border-white/20 pt-3">
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-white/40">
                            Profession
                          </span>
                          <span className="font-medium text-white">
                            {currentProfile.profession}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-white/40">
                            Education
                          </span>
                          <span className="font-medium text-white">{currentProfile.education}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-white/40">
                            Maslak / Sect
                          </span>
                          <span className="font-medium text-white truncate block max-w-[120px]">
                            {currentProfile.sect}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-wider text-white/40">
                            Prayer
                          </span>
                          <span className="font-medium text-white">{currentProfile.prayer}</span>
                        </div>
                      </div>
                    </div>
                  </PhotoBg>
                </Link>
              </div>

              {/* Match Reasons & Compatibility Score */}
              <div className="mt-3 px-4 w-full max-w-[420px] flex flex-col items-center gap-2 shrink-0 animate-fade-in">
                <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-semibold text-rose-600 border border-rose-500/20 shadow-soft">
                  <span>❤️ Compatibility: {currentProfile.compatibility}%</span>
                </div>
                {reasons.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center mt-1">
                    {reasons.slice(0, 4).map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600 border border-emerald-500/20"
                      >
                        ✓ {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-4 flex items-center justify-center gap-6 w-full px-4 shrink-0">
                {/* Reject */}
                <button
                  onClick={() => handleReject(currentProfile.id)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10 text-destructive shadow-soft hover:bg-destructive/20 transition-all cursor-pointer"
                  title="Reject Candidate"
                >
                  <X className="h-6 w-6" />
                </button>

                {/* Save for Later */}
                <button
                  onClick={() => handleSaveForLater(currentProfile.id, currentProfile.name)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:bg-muted shadow-soft transition-all cursor-pointer"
                  title="Save for Later"
                >
                  <Bookmark className="h-6 w-6 text-muted-foreground" />
                </button>

                {/* Send Proposal */}
                <button
                  onClick={() => handleSendProposal(currentProfile)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 transition-all cursor-pointer"
                  title="Send Proposal"
                >
                  <Heart className="h-6 w-6" />
                </button>
              </div>
            </div>
          );
        })()
      )}

      {open && (
        <FilterSheet
          initial={filters}
          matchCount={(f) => countMatches(f, derivedById)}
          onClose={() => setOpen(false)}
          onApply={(f) => {
            setFilters(f);
            setOpen(false);
          }}
          onClear={() => setFilters(DEFAULTS)}
        />
      )}
    </div>
  );
}

function countMatches(f: Filters, derivedById: Map<string, Derived>) {
  return people.filter((p) => {
    const d = derivedById.get(p.id)!;
    if (p.age < f.ageMin || p.age > f.ageMax) return false;
    const inches = heightToInches(p.height);
    if (inches < f.heightMin || inches > f.heightMax) return false;
    if (f.country && p.country !== f.country) return false;
    if (f.city && p.city !== f.city) return false;
    if (f.nationality && d.nationality !== f.nationality) return false;
    if (f.gender && p.gender !== f.gender) return false;
    if (f.maritalStatus && d.maritalStatus !== f.maritalStatus) return false;
    if (f.education && p.education !== f.education) return false;
    if (f.profession && p.profession !== f.profession) return false;
    if (f.income && d.income !== f.income) return false;
    if (f.prayer && p.prayer !== f.prayer) return false;
    if (f.quran && p.quran !== f.quran) return false;
    if (f.religiousLevel && d.religiousLevel !== f.religiousLevel) return false;
    if (f.hijab && p.hijab !== f.hijab) return false;
    if (f.beard && p.beard !== f.beard) return false;
    if (f.sect && p.sect !== f.sect) return false;
    if (f.familyType && d.familyType !== f.familyType) return false;
    if (f.dowry && d.dowry !== f.dowry) return false;
    if (f.children && d.children !== f.children) return false;
    if (f.relocation && d.relocation !== f.relocation) return false;
    if (f.verifiedOnly && !p.verified) return false;
    if (f.premiumOnly && !p.premium) return false;
    if (f.onlineNow && !d.online) return false;
    if (f.recentlyActive && !d.recentlyActive) return false;
    return true;
  }).length;
}

// ---------- Active chips computation ----------
type Chip = { key: keyof Filters; label: string };
function activeChips(f: Filters): Chip[] {
  const c: Chip[] = [];
  if (f.ageMin !== DEFAULTS.ageMin || f.ageMax !== DEFAULTS.ageMax)
    c.push({ key: "ageMin", label: `${f.ageMin}–${f.ageMax} yrs` });
  if (f.heightMin !== DEFAULTS.heightMin || f.heightMax !== DEFAULTS.heightMax)
    c.push({
      key: "heightMin",
      label: `${inchesToLabel(f.heightMin)}–${inchesToLabel(f.heightMax)}`,
    });
  if (f.country) c.push({ key: "country", label: f.country });
  if (f.city) c.push({ key: "city", label: f.city });
  if (f.nationality) c.push({ key: "nationality", label: f.nationality });
  if (f.gender) c.push({ key: "gender", label: f.gender === "male" ? "Male" : "Female" });
  if (f.maritalStatus) c.push({ key: "maritalStatus", label: f.maritalStatus });
  if (f.education) c.push({ key: "education", label: f.education });
  if (f.profession) c.push({ key: "profession", label: f.profession });
  if (f.income) c.push({ key: "income", label: f.income });
  if (f.prayer) c.push({ key: "prayer", label: f.prayer });
  if (f.quran) c.push({ key: "quran", label: `Qur'an: ${f.quran}` });
  if (f.religiousLevel) c.push({ key: "religiousLevel", label: f.religiousLevel });
  if (f.hijab) c.push({ key: "hijab", label: `Hijab: ${f.hijab}` });
  if (f.beard) c.push({ key: "beard", label: `Beard: ${f.beard}` });
  if (f.sect) c.push({ key: "sect", label: f.sect });
  if (f.familyType) c.push({ key: "familyType", label: `${f.familyType} family` });
  if (f.dowry) c.push({ key: "dowry", label: f.dowry });
  if (f.children) c.push({ key: "children", label: f.children });
  if (f.relocation) c.push({ key: "relocation", label: f.relocation });
  if (f.verifiedOnly) c.push({ key: "verifiedOnly", label: "Verified" });
  if (f.premiumOnly) c.push({ key: "premiumOnly", label: "Premium" });
  if (f.onlineNow) c.push({ key: "onlineNow", label: "Online now" });
  if (f.recentlyActive) c.push({ key: "recentlyActive", label: "Recently active" });
  return c;
}

// ---------- Empty state ----------
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-8 pt-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <SearchX className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mt-5 font-display text-lg">No profiles match your selected filters.</h2>
      <p className="mt-2 max-w-xs text-xs text-muted-foreground">
        Try broadening your criteria or clearing a few filters to see more matches.
      </p>
      <button
        onClick={onClear}
        className="mt-6 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-soft"
      >
        Clear Filters
      </button>
    </div>
  );
}

// ---------- Filter sheet ----------
function FilterSheet({
  initial,
  matchCount,
  onClose,
  onApply,
  onClear,
}: {
  initial: Filters;
  matchCount: (f: Filters) => number;
  onClose: () => void;
  onApply: (f: Filters) => void;
  onClear: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(initial);
  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const count = matchCount(draft);
  const showHijab = draft.gender !== "male";
  const showBeard = draft.gender !== "female";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div
        className="flex max-h-[92%] w-full max-w-[520px] flex-col rounded-t-3xl border-t border-border bg-background shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-lg">Filters</h2>
            <p className="text-[11px] text-muted-foreground">{count} profiles match</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          <RangeGroup
            label="Age Range"
            min={18}
            max={60}
            vMin={draft.ageMin}
            vMax={draft.ageMax}
            suffix=" yrs"
            onChange={(a, b) => {
              set("ageMin", a);
              set("ageMax", b);
            }}
          />

          <RangeGroup
            label="Height Range"
            min={54}
            max={84}
            vMin={draft.heightMin}
            vMax={draft.heightMax}
            format={inchesToLabel}
            onChange={(a, b) => {
              set("heightMin", a);
              set("heightMax", b);
            }}
          />

          <SelectGroup
            label="Country"
            value={draft.country}
            options={COUNTRIES}
            onChange={(v) => set("country", v)}
          />
          <SelectGroup
            label="City"
            value={draft.city}
            options={CITIES}
            onChange={(v) => set("city", v)}
          />
          <SelectGroup
            label="Nationality"
            value={draft.nationality}
            options={NATIONALITIES}
            onChange={(v) => set("nationality", v)}
          />

          <ChipGroup
            label="Gender"
            value={draft.gender}
            options={[
              ["", "Any"],
              ["male", "Male"],
              ["female", "Female"],
            ]}
            onChange={(v) => set("gender", v as Filters["gender"])}
          />

          <ChipGroup
            label="Marital Status"
            value={draft.maritalStatus}
            options={[["", "Any"], ...MARITALS.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("maritalStatus", v)}
          />

          <SelectGroup
            label="Education"
            value={draft.education}
            options={EDUCATIONS}
            onChange={(v) => set("education", v)}
          />
          <SelectGroup
            label="Profession"
            value={draft.profession}
            options={PROFESSIONS}
            onChange={(v) => set("profession", v)}
          />
          <SelectGroup
            label="Monthly Income"
            value={draft.income}
            options={[...INCOMES]}
            onChange={(v) => set("income", v)}
          />

          <ChipGroup
            label="Prayer Level"
            value={draft.prayer}
            options={[["", "Any"], ...PRAYERS.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("prayer", v)}
          />
          <ChipGroup
            label="Qur'an Reading Level"
            value={draft.quran}
            options={[["", "Any"], ...QURANS.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("quran", v)}
          />
          <ChipGroup
            label="Religious Level"
            value={draft.religiousLevel}
            options={[["", "Any"], ...RELIGIOUS.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("religiousLevel", v)}
          />

          {showHijab && (
            <ChipGroup
              label="Hijab (Female)"
              value={draft.hijab}
              options={[["", "Any"], ...HIJABS.map((m) => [m, m] as [string, string])]}
              onChange={(v) => set("hijab", v)}
            />
          )}
          {showBeard && (
            <ChipGroup
              label="Beard (Male)"
              value={draft.beard}
              options={[["", "Any"], ...BEARDS.map((m) => [m, m] as [string, string])]}
              onChange={(v) => set("beard", v)}
            />
          )}

          <SelectGroup
            label="Sect"
            value={draft.sect}
            options={SECTS}
            onChange={(v) => set("sect", v)}
          />
          <ChipGroup
            label="Family Type"
            value={draft.familyType}
            options={[["", "Any"], ...FAMILY_TYPES.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("familyType", v)}
          />
          <ChipGroup
            label="Dowry Preference"
            value={draft.dowry}
            options={[["", "Any"], ...DOWRY.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("dowry", v)}
          />
          <ChipGroup
            label="Children"
            value={draft.children}
            options={[["", "Any"], ...CHILDREN.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("children", v)}
          />
          <ChipGroup
            label="Relocation Preference"
            value={draft.relocation}
            options={[["", "Any"], ...RELOCATION.map((m) => [m, m] as [string, string])]}
            onChange={(v) => set("relocation", v)}
          />

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Additional</p>
            <ToggleRow
              label="Verified only"
              checked={draft.verifiedOnly}
              onChange={(v) => set("verifiedOnly", v)}
            />
            <ToggleRow
              label="Premium members only"
              checked={draft.premiumOnly}
              onChange={(v) => set("premiumOnly", v)}
            />
            <ToggleRow
              label="Online now"
              checked={draft.onlineNow}
              onChange={(v) => set("onlineNow", v)}
            />
            <ToggleRow
              label="Recently active"
              checked={draft.recentlyActive}
              onChange={(v) => set("recentlyActive", v)}
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-border px-5 py-4">
          <button
            onClick={() => {
              setDraft(DEFAULTS);
              onClear();
            }}
            className="flex-1 rounded-full border border-border py-3 text-xs font-semibold text-muted-foreground"
          >
            Clear All Filters
          </button>
          <button
            onClick={() => onApply(draft)}
            className="flex-[1.4] rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-soft"
          >
            Apply Filters ({count})
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Field primitives ----------
function SelectGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-xs text-foreground"
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChipGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <button
            key={v || "__any"}
            onClick={() => onChange(v)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[11px] font-medium",
              value === v
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeGroup({
  label,
  min,
  max,
  vMin,
  vMax,
  suffix,
  format,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  vMin: number;
  vMax: number;
  suffix?: string;
  format?: (v: number) => string;
  onChange: (a: number, b: number) => void;
}) {
  const fmt = (v: number) => (format ? format(v) : `${v}${suffix ?? ""}`);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-[11px] text-muted-foreground">
          {fmt(vMin)} – {fmt(vMax)}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="rounded-2xl border border-border bg-card px-3 py-2">
          <span className="block text-[10px] text-muted-foreground">Min</span>
          <input
            type="range"
            min={min}
            max={max}
            value={vMin}
            onChange={(e) => onChange(Math.min(parseInt(e.target.value, 10), vMax), vMax)}
            className="w-full accent-[color:var(--color-primary)]"
          />
        </label>
        <label className="rounded-2xl border border-border bg-card px-3 py-2">
          <span className="block text-[10px] text-muted-foreground">Max</span>
          <input
            type="range"
            min={min}
            max={max}
            value={vMax}
            onChange={(e) => onChange(vMin, Math.max(parseInt(e.target.value, 10), vMin))}
            className="w-full accent-[color:var(--color-primary)]"
          />
        </label>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
      <span className="text-xs">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-10 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        )}
        aria-pressed={checked}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "start-4" : "start-0.5",
          )}
        />
      </button>
    </label>
  );
}
