import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  findPerson,
  people,
  useProposals,
  useMe,
  useChats,
  getPhotoRequests,
  setPhotoRequest,
  getMatchId,
  hasPhotoAccess,
  addNotification,
  type Person,
} from "@/lib/mock";
import { CompatibilityRing, VerifiedBadge, PremiumBadge, PhotoBg } from "@/components/misaq/bits";
import { TopBar } from "@/components/misaq/top-bar";
import {
  Share2,
  Flag,
  Bookmark,
  Heart,
  MapPin,
  BookOpen,
  GraduationCap,
  Briefcase,
  Home as HomeIcon,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/profile/$id")({ component: ProfileView });

function ProfileView() {
  const { id } = Route.useParams();
  const t = useT();
  const navigate = useNavigate();
  const p = findPerson(id);

  const [me] = useMe();
  const [chats] = useChats();
  const [proposals, updateProposals] = useProposals();
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDesc, setReportDesc] = useState("");
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

  const isSaved = bookmarks.includes(p.id);
  const hasSent = proposals.sent.some((s) => s.id === p.id);
  const hasAccepted = proposals.accepted.some((s) => s.id === p.id);

  // Workflow checks for revealing contact info
  const activeChat = chats.find((c) => c.personId === p.id);
  const isMatchedPartner = activeChat !== undefined;
  const isPremiumUnlocked = activeChat?.finalProposalStatus === "purchased";

  const hasAccess = hasPhotoAccess(me, p, chats, proposals, "member");
  const matchId = getMatchId(me.id, p.id);
  const reqStatus = photoRequests[matchId];

  const toggleBookmark = () => {
    let next: string[];
    if (isSaved) {
      next = bookmarks.filter((x) => x !== p.id);
      toast.info(`Removed ${p.name.split(" ")[0]} from saved profiles`);
    } else {
      next = [...bookmarks, p.id];
      toast.success(`Saved ${p.name.split(" ")[0]}'s profile`);
    }
    setBookmarks(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("misaq_bookmarks", JSON.stringify(next));
    }
  };

  const handleSendProposal = () => {
    if (me.verificationStatus !== "Verified") {
      toast.error("Verification Required: You must be verified by admin before sending proposals.");
      return;
    }
    if (hasSent || hasAccepted) {
      toast.info(`Proposal already active for ${p.name}`);
      return;
    }
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Sending proposal with dignity...",
      success: () => {
        updateProposals({
          ...proposals,
          sent: [...proposals.sent, p],
        });
        return `Proposal sent to ${p.name.split(" ")[0]} successfully!`;
      },
      error: "Error sending proposal.",
    });
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    toast.success("Profile link copied to clipboard!");
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    // Save report to localStorage for Admin visibility
    if (typeof window !== "undefined") {
      const reasonKeyMap: Record<string, string> = {
        "Fake profile": "admin.reports.reasons.fake",
        "Inappropriate language": "admin.reports.reasons.msg",
        Harassment: "admin.reports.reasons.harass",
        Spam: "admin.reports.reasons.spam",
        Other: "admin.reports.reasons.msg",
      };

      const newReport = {
        by: me.name,
        against: p.name,
        reasonKey: reasonKeyMap[reportReason] || "admin.reports.reasons.msg",
        severity: reportReason === "Harassment" || reportReason === "Fake profile" ? "high" : "med",
        time: "Just now",
      };

      try {
        const saved = localStorage.getItem("misaq_reports");
        const current = saved
          ? JSON.parse(saved)
          : [
              {
                by: "Aisha R.",
                against: "unknown@user",
                reasonKey: "admin.reports.reasons.msg",
                severity: "high",
                time: "12m",
              },
              {
                by: "Hamza S.",
                against: "user_2183",
                reasonKey: "admin.reports.reasons.fake",
                severity: "med",
                time: "1h",
              },
              {
                by: "Maryam I.",
                against: "user_9812",
                reasonKey: "admin.reports.reasons.harass",
                severity: "high",
                time: "3h",
              },
              {
                by: "Yusuf K.",
                against: "user_4409",
                reasonKey: "admin.reports.reasons.spam",
                severity: "low",
                time: "1d",
              },
            ];
        localStorage.setItem("misaq_reports", JSON.stringify([newReport, ...current]));
      } catch (err) {
        console.error("Failed to save report", err);
      }
    }

    toast.success("Thank you. Your report has been submitted to Misaq administrators for review.");
    setReportOpen(false);
    setReportReason("");
    setReportDesc("");
  };

  const handleLockedFieldClick = () => {
    if (isMatchedPartner) {
      if (activeChat.finalProposalStatus === "wali_approved") {
        toast.info(
          "Wali Approved: Click the bottom-bar Upgrade link or go to Settings to purchase Premium Rs. 5,000 and reveal info.",
        );
      } else {
        toast.warning(
          "Locked Couple Info: You must complete the 7-day chat, send a Final Proposal, get Wali approval, and upgrade to Premium to view.",
        );
      }
    } else {
      toast.error(
        "Privacy Restriction: Contact details are only visible to your matched spouse after mutual Wali approval & Premium purchase.",
      );
    }
  };

  return (
    <div className="pb-28">
      <PhotoBg person={p} className="relative h-80">
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />

        {!hasAccess && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-6 text-center space-y-3 z-10">
            <Lock className="h-7 w-7 text-white" />
            <p className="font-semibold text-xs">Profile photo is private.</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                if (reqStatus === "pending") return;
                handleRequestPhotoAccess(p);
              }}
              className={cn(
                "rounded-full px-4 py-1.5 text-[11px] font-semibold shadow-md transition-all cursor-pointer",
                reqStatus === "pending"
                  ? "bg-white/20 text-white/60 cursor-not-allowed border border-white/10"
                  : "bg-primary text-primary-foreground hover:bg-primary/95",
              )}
              disabled={reqStatus === "pending"}
            >
              {reqStatus === "pending" ? "Photo Access Requested" : "Request Photo Access"}
            </button>
          </div>
        )}
        <TopBar
          back
          tone="light"
          transparent
          right={
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                aria-label="share"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setReportOpen(true)}
                aria-label="report"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white cursor-pointer"
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>
          }
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="truncate font-display text-3xl leading-tight">{p.name}</h1>
              {p.verified && <span className="text-[color:var(--color-gold)] text-lg">✓</span>}
            </div>
            <p className="mt-1 flex items-center gap-2 text-xs text-white/85">
              <span>
                {p.age} {t("common.yrs")}
              </span>
              ·
              <span className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 shrink-0" /> {p.city}, {p.country}
              </span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.verified && <VerifiedBadge />}
              {p.premium && <PremiumBadge />}
            </div>
          </div>
          <CompatibilityRing value={p.compatibility} size={64} tone="light" />
        </div>
      </PhotoBg>

      <div className="px-6 pt-6">
        <div className="ornament mb-4 text-[11px] uppercase tracking-[0.25em]">
          <span>{t("profile.about")}</span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90" dir="auto">
          {p.bio}
        </p>

        {/* Contact Details (conditional revealing) */}
        <Section title="Contact Information" icon={<ShieldCheck className="h-4 w-4" />}>
          <Row
            label="Phone Number"
            value={
              isMatchedPartner && isPremiumUnlocked ? p.phone || "+92 321 4455667" : "••••••••••"
            }
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
          <Row
            label="WhatsApp Number"
            value={
              isMatchedPartner && isPremiumUnlocked ? p.phone || "+92 321 4455667" : "••••••••••"
            }
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
          <Row
            label="Email Address"
            value={
              isMatchedPartner && isPremiumUnlocked
                ? p.email || "aisha.rahman@gmail.com"
                : "••••••••••"
            }
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
          <Row
            label="Exact Address"
            value={
              isMatchedPartner && isPremiumUnlocked
                ? p.address || "12-A Block H, DHA Phase 5, Lahore"
                : "••••••••••"
            }
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
        </Section>

        <Section title={t("profile.eduProf")} icon={<GraduationCap className="h-4 w-4" />}>
          <Row label={t("profile.education")} value={p.education} />
          <Row
            label={t("profile.profession")}
            value={p.profession}
            icon={<Briefcase className="h-3.5 w-3.5" />}
          />
          <Row label={t("profile.height")} value={p.height} />
        </Section>

        <Section title={t("profile.religion")} icon={<BookOpen className="h-4 w-4" />}>
          <Row label="Religion" value="Islam" />
          <Row label="Maslak / Sect" value={p.sect} />
          <Row label={p.gender === "male" ? "Prayer in Masjid" : "Prayer"} value={p.prayer} />
          <Row label={t("profile.quran")} value={p.quran} />
          {p.religiousPractice && <Row label="Religious Practice" value={p.religiousPractice} />}
          {p.religiousEnvironment && <Row label="Religious Environment" value={p.religiousEnvironment} />}
          {p.hijab && <Row label="Hijab / Niqab" value={p.hijab} />}
          {p.beard && <Row label="Beard" value={p.beard} />}
        </Section>

        <Section title={t("profile.family")} icon={<HomeIcon className="h-4 w-4" />}>
          <Row
            label={t("profile.father")}
            value={isMatchedPartner && isPremiumUnlocked ? "Alive · Retired teacher" : "••••••••••"}
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
          <Row
            label={t("profile.mother")}
            value={isMatchedPartner && isPremiumUnlocked ? "Alive · Homemaker" : "••••••••••"}
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
          <Row
            label={t("profile.siblings")}
            value={isMatchedPartner && isPremiumUnlocked ? "2 brothers · 1 sister" : "••••••••••"}
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
          <Row
            label={t("profile.familyType")}
            value={isMatchedPartner && isPremiumUnlocked ? "Separate" : "••••••••••"}
            icon={
              !isMatchedPartner || !isPremiumUnlocked ? (
                <Lock className="h-3.5 w-3.5 text-gold shrink-0" />
              ) : undefined
            }
            onClick={!isMatchedPartner || !isPremiumUnlocked ? handleLockedFieldClick : undefined}
          />
        </Section>

        {hasAccess && (
          <Section title="Hidden Gallery" icon={<Lock className="h-4 w-4" />}>
            {isMatchedPartner && isPremiumUnlocked ? (
              <div className="grid grid-cols-3 gap-2 p-2">
                <img
                  src={p.photo}
                  alt="Gallery 1"
                  className="h-20 w-full object-cover rounded-xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop"
                  alt="Gallery 2"
                  className="h-20 w-full object-cover rounded-xl"
                />
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop"
                  alt="Gallery 3"
                  className="h-20 w-full object-cover rounded-xl"
                />
              </div>
            ) : (
              <Row
                label="Private Photos"
                value="••••••••••"
                icon={<Lock className="h-3.5 w-3.5 text-gold shrink-0" />}
                onClick={handleLockedFieldClick}
              />
            )}
          </Section>
        )}

        <Section title={t("profile.wali")} icon={<ShieldCheck className="h-4 w-4" />}>
          <Row label={t("profile.waliName")} value="Abdullah Rahman" />
          <Row label={t("profile.verified")} value="CNIC & selfie confirmed" />
        </Section>

        <Section title={t("profile.dowry")}>
          <Row
            label={p.gender === "male" ? "Groom" : "Bride"}
            value={p.gender === "male" ? "Does not accept dowry" : "Prefer not to answer"}
          />
        </Section>

        <div className="mt-8">
          <div className="ornament mb-4 text-[11px] uppercase tracking-[0.25em]">
            <span>{t("profile.compat")}</span>
          </div>
          <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
            {people
              .filter((x) => x.id !== p.id)
              .slice(0, 6)
              .map((s) => (
                <Link
                  key={s.id}
                  to="/app/profile/$id"
                  params={{ id: s.id }}
                  className="w-32 shrink-0 overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <PhotoBg person={s} className="h-24" />
                  <div className="p-2">
                    <p className="truncate text-xs font-medium">{s.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">
                      {s.age} · {s.city}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[420px] gap-3 border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        <button
          onClick={toggleBookmark}
          aria-label={t("profile.save")}
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer",
            isSaved ? "bg-primary/10 border-primary text-primary" : "border-border text-foreground",
          )}
        >
          <Bookmark className={cn("h-4 w-4", isSaved && "fill-current")} />
        </button>
        <button
          onClick={handleSendProposal}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-medium text-primary-foreground shadow-elegant transition-colors cursor-pointer",
            hasSent || hasAccepted
              ? "bg-gold text-[color:var(--color-gold-foreground)]"
              : "bg-primary",
          )}
        >
          <Heart className={cn("h-4 w-4", (hasSent || hasAccepted) && "fill-current")} />
          {hasSent || hasAccepted ? "Proposal Sent" : t("profile.sendProposal")}
        </button>
      </div>

      {/* Report Member Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
          <DialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-2">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="font-display text-lg text-primary">Report Profile</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Help keep Misaq safe. Explain what is inappropriate on this profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReportSubmit} className="space-y-4 text-left mt-2">
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                Reason
              </label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                required
              >
                <option value="">Select a reason</option>
                <option value="Fake profile">Fake profile or fake photos</option>
                <option value="Inappropriate language">Inappropriate message or details</option>
                <option value="Harassment">Harassment or disrespect</option>
                <option value="Spam">Spam or commercial marketing</option>
                <option value="Other">Other policy violation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                Additional details (Optional)
              </label>
              <textarea
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
                placeholder="Provide details of the policy violation..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-destructive py-3 font-semibold text-white shadow-soft transition-colors"
            >
              Submit Report
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8">
      <h3 className="mb-3 flex items-center gap-2 font-display text-lg">
        {icon && <span className="text-primary">{icon}</span>}
        {title}
      </h3>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card">
        {children}
      </div>
    </div>
  );
}
function Row({
  label,
  value,
  icon,
  onClick,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between gap-3 px-4 py-3 text-sm",
        onClick && "cursor-pointer hover:bg-muted/10 transition-colors",
      )}
    >
      <span className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="min-w-0 truncate text-end font-medium">{value}</span>
    </div>
  );
}
