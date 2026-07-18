import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMe, Person, useChats, type PhotoPrivacySetting } from "@/lib/mock";
import { Avatar, VerifiedBadge, PremiumBadge, CompatibilityRing } from "@/components/misaq/bits";
import { cn } from "@/lib/utils";
import { Settings, Sparkles, Edit3, Eye, ShieldCheck, X, ShieldAlert } from "lucide-react";
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

export const Route = createFileRoute("/app/profile/")({ component: MyProfile });

function MyProfile() {
  const t = useT();
  const navigate = useNavigate();
  const [me, updateMe] = useMe();
  const [chats] = useChats();

  const [editOpen, setEditOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [viewedOpen, setViewedOpen] = useState(false);
  const [waliOpen, setWaliOpen] = useState(false);

  const [documentEditOpen, setDocumentEditOpen] = useState(false);
  const [cnicNum, setCnicNum] = useState(me.cnicNumber || "35201-1234567-8");
  const [cnicFront, setCnicFront] = useState(
    me.cnicFront ||
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
  );
  const [cnicBack, setCnicBack] = useState(
    me.cnicBack ||
      "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
  );
  const [selfieImg, setSelfieImg] = useState(me.selfie || me.photo);

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMe({
      ...me,
      cnicNumber: cnicNum,
      cnicFront,
      cnicBack,
      selfie: selfieImg,
      verificationStatus: "Submitted",
      verified: false,
    });
    toast.success("Profile resubmitted for verification successfully!");
    setDocumentEditOpen(false);
  };

  // Form states for Edit Profile
  const [name, setName] = useState(me.name);
  const [age, setAge] = useState(me.age);
  const [city, setCity] = useState(me.city);
  const [country, setCountry] = useState(me.country);
  const [profession, setProfession] = useState(me.profession);
  const [education, setEducation] = useState(me.education);
  const [height, setHeight] = useState(me.height);
  const [sect, setSect] = useState(me.sect);
  const [bio, setBio] = useState(me.bio);
  const mapOldPrayer = (p: string) => {
    if (!p) return "Prefer not to say";
    if (p === "Always" || p === "Five Times" || p === "Five Times in Mosque") {
      return "5 Times Daily";
    }
    return p;
  };
  const [prayer, setPrayer] = useState(mapOldPrayer(me.prayer));
  const [quran, setQuran] = useState(me.quran);
  const [beard, setBeard] = useState(me.beard || "Sunnah Beard");
  const [hijab, setHijab] = useState(me.hijab || "Hijab");
  const [photo, setPhoto] = useState(me.photo); // Profile Picture (DP) state
  const [photoPrivacy, setPhotoPrivacy] = useState(me.photoPrivacy || "Public");
  const [religiousPractice, setReligiousPractice] = useState(me.religiousPractice || "Intermediate");
  const [religiousEnvironment, setReligiousEnvironment] = useState(me.religiousEnvironment || "Moderate");

  // Wali details states
  const [waliName, setWaliName] = useState("Abdullah Rahman");
  const [waliRel, setWaliRel] = useState("Father");
  const [waliPhone, setWaliPhone] = useState("+92 300 1234567");

  const hasWaliApproval = chats.some((c) => c.finalProposalStatus === "wali_approved");
  const isEligibleForPremium = me.gender === "male" && hasWaliApproval;

  const avatarOptions =
    me.gender === "male"
      ? [
          "https://randomuser.me/api/portraits/men/32.jpg",
          "https://randomuser.me/api/portraits/men/12.jpg",
          "https://randomuser.me/api/portraits/men/22.jpg",
          "https://randomuser.me/api/portraits/men/46.jpg",
          "https://randomuser.me/api/portraits/men/82.jpg",
        ]
      : [
          "https://randomuser.me/api/portraits/women/12.jpg",
          "https://randomuser.me/api/portraits/women/24.jpg",
          "https://randomuser.me/api/portraits/women/45.jpg",
          "https://randomuser.me/api/portraits/women/62.jpg",
          "https://randomuser.me/api/portraits/women/88.jpg",
        ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    updateMe({
      ...me,
      name,
      age: Number(age),
      city,
      country,
      profession,
      education,
      height,
      sect: sect || "Barelvi",
      bio,
      prayer,
      quran,
      photo, // Save profile picture selection
      photoPrivacy, // Save photo privacy setting
      religion: "Islam",
      religiousPractice,
      religiousEnvironment,
      ...(me.gender === "male" ? { beard } : { hijab }),
    });
    toast.success("Profile updated successfully!");
    setEditOpen(false);
  };

  const approvedChat = chats.find(
    (c) => c.finalProposalStatus === "wali_approved" || c.finalProposalStatus === "purchased",
  );
  const handleUpgrade = () => {
    navigate({ to: "/app/premium", search: { chatId: approvedChat?.id } });
  };

  const handleSaveWali = (e: React.FormEvent) => {
    e.preventDefault();
    if (waliPhone.length < 10 || waliPhone.length > 15) {
      toast.error("Wali phone number must be a valid number of 10-15 digits.");
      return;
    }
    toast.success("Wali information updated!");
    setWaliOpen(false);
  };

  return (
    <div className="pb-8">
      <div
        className="relative overflow-hidden bg-gradient-royal px-6 pb-16 text-white"
        style={{ paddingTop: "max(3.5rem, calc(env(safe-area-inset-top) + 1rem))" }}
      >
        <div className="pointer-events-none absolute -start-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[11px] uppercase tracking-[0.3em] text-white/60">
              {t("profile.myTitle")}
            </p>
            <h1 className="mt-1 truncate font-display text-2xl">{t("profile.mashAllah")}</h1>
          </div>
          <Link
            to="/app/settings"
            aria-label={t("settings.title")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {me.verificationStatus === "Rejected" && (
        <div className="mx-4 mt-4 rounded-3xl border border-destructive/20 bg-destructive/5 p-4 animate-fade-in text-left sm:mx-6">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="font-semibold text-sm">Verification Rejected</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-normal">
            Reason: {me.rejectionReason || "Documents unclear"}. Please update your verification
            documents to resubmit.
          </p>
          <button
            onClick={() => setDocumentEditOpen(true)}
            className="mt-3 w-full rounded-xl bg-primary py-2 text-center text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all cursor-pointer"
          >
            Update Documents & Resubmit
          </button>
        </div>
      )}

      {me.verificationStatus === "Submitted" && (
        <div className="mx-4 mt-4 rounded-3xl border border-primary/20 bg-primary/5 p-4 animate-fade-in text-left sm:mx-6">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-4 w-4 shrink-0 animate-pulse" />
            <span className="font-semibold text-sm">Under Verification</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground leading-normal">
            Your profile is currently under review by our administration. We will notify you as soon
            as the review is complete.
          </p>
        </div>
      )}

      <div
        className={cn(
          "mx-4 rounded-3xl border border-border bg-card p-5 shadow-elegant sm:mx-6",
          me.verificationStatus !== "Verified" ? "mt-4" : "-mt-12",
        )}
      >
        <div className="flex items-center gap-4">
          <Avatar person={me} size={72} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl leading-tight">{me.name}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {me.age} {t("common.yrs")} • {me.profession}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {me.verificationStatus === "Verified" && <VerifiedBadge />}
              {chats.some((c) => c.finalProposalStatus === "purchased") && <PremiumBadge />}
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
          <div>
            <p className="font-display text-lg text-primary">128</p>
            <p className="truncate text-[10px] text-muted-foreground uppercase tracking-wider">
              {t("profile.views")}
            </p>
          </div>
          <div>
            <p className="font-display text-lg text-primary">14</p>
            <p className="truncate text-[10px] text-muted-foreground uppercase tracking-wider">
              {t("home.proposals")}
            </p>
          </div>
          <div>
            <p className="font-display text-lg text-primary">92%</p>
            <p className="truncate text-[10px] text-muted-foreground uppercase tracking-wider">
              {t("profile.complete")}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-2 px-4 sm:px-6">
        {me.gender === "male" &&
          (chats.some((c) => c.finalProposalStatus === "purchased") || isEligibleForPremium) && (
            <Row
              onClick={() => setUpgradeOpen(true)}
              title="Misaq Premium"
              desc={
                chats.some((c) => c.finalProposalStatus === "purchased")
                  ? "Premium Subscription is Active"
                  : "Upgrade to Premium to unlock match contact details"
              }
              icon={<Sparkles className="h-4 w-4" />}
              gold={!chats.some((c) => c.finalProposalStatus === "purchased")}
            />
          )}
        <Row
          onClick={() => setEditOpen(true)}
          title={t("profile.edit")}
          desc={t("profile.editDesc")}
          icon={<Edit3 className="h-4 w-4" />}
        />
        <Row
          onClick={() => setViewedOpen(true)}
          title={t("profile.viewed")}
          desc={t("profile.viewedDesc")}
          icon={<Eye className="h-4 w-4" />}
        />
        <Row
          onClick={() => setWaliOpen(true)}
          title={t("profile.myWali")}
          desc={`${waliName} · ${waliRel} · Verified`}
          icon={<ShieldCheck className="h-4 w-4" />}
        />
      </div>

      <div className="mx-4 mt-6 rounded-3xl border border-border bg-card p-5 sm:mx-6">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-display text-lg">{t("profile.strength")}</p>
          <CompatibilityRing value={92} size={48} tone="gold" />
        </div>
        <div className="mt-4 space-y-2 text-xs">
          {[
            { label: t("profile.strengthPersonal"), pct: 100 },
            { label: t("profile.strengthReligious"), pct: 100 },
            { label: t("profile.strengthFamily"), pct: 80 },
            { label: `${t("profile.strengthPhotos")} (2/5)`, pct: 60 },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex justify-between gap-2">
                <span className="min-w-0 truncate text-muted-foreground">{s.label}</span>
                <span className="shrink-0 font-medium">{s.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-[420px] rounded-3xl bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary">
              {t("profile.edit")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modify your profile details. Changes are saved locally.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSaveProfile}
            className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 mt-2 text-left"
          >
            <div>
              <label className="block text-xs font-semibold mb-2 text-muted-foreground">
                Select Profile Picture (DP)
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {avatarOptions.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhoto(url)}
                    className={cn(
                      "relative h-14 w-14 shrink-0 rounded-full border-2 overflow-hidden transition-all cursor-pointer",
                      photo === url
                        ? "border-primary scale-110 shadow-soft"
                        : "border-transparent opacity-75",
                    )}
                  >
                    <img
                      src={url}
                      alt={`Avatar ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {photo === url && (
                      <span className="absolute inset-0 bg-primary/25 flex items-center justify-center text-white text-xs font-semibold">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  Or upload a new custom image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPhoto(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-xs text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {photo && !avatarOptions.includes(photo) && (
                  <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-muted/10 p-2.5">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Preview Custom Image:
                    </span>
                    <img
                      src={photo}
                      alt="Custom DP Preview"
                      className="h-12 w-12 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                Full name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Age
                </label>
                <input
                  type="number"
                  min={18}
                  max={70}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Height
                </label>
                <input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  City
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Country
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Profession
                </label>
                <input
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Education
                </label>
                <input
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Maslak / Sect
                </label>
                <select
                  value={sect}
                  onChange={(e) => setSect(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="Barelvi">Barelvi</option>
                  <option value="Deobandi (Hayati)">Deobandi (Hayati)</option>
                  <option value="Deobandi (Mamati)">Deobandi (Mamati)</option>
                  <option value="Ahle Hadith / Salafi">Ahle Hadith / Salafi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  {me.gender === "male" ? "Prayer in Masjid" : "Prayer"}
                </label>
                <select
                  value={prayer}
                  onChange={(e) => setPrayer(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="5 Times Daily">5 Times Daily</option>
                  <option value="Usually">Usually</option>
                  <option value="Sometimes">Sometimes</option>
                  <option value="Rarely">Rarely</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Quran Reading
                </label>
                <select
                  value={quran}
                  onChange={(e) => setQuran(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Rarely">Rarely</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Islamic Knowledge
                </label>
                <select
                  value={religiousPractice}
                  onChange={(e) => setReligiousPractice(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Scholar">Scholar</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Religious Environment
                </label>
                <select
                  value={religiousEnvironment}
                  onChange={(e) => setReligiousEnvironment(e.target.value)}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="Very Religious">Very Religious</option>
                  <option value="Religious">Religious</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Learning">Learning</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div>
                {me.gender === "male" ? (
                  <>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Beard
                    </label>
                    <select
                      value={beard}
                      onChange={(e) => setBeard(e.target.value)}
                      className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      <option value="Sunnah Beard">Sunnah Beard</option>
                      <option value="Short Beard">Short Beard</option>
                      <option value="Clean Shaven">Clean Shaven</option>
                    </select>
                  </>
                ) : (
                  <>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Hijab / Niqab
                    </label>
                    <select
                      value={hijab}
                      onChange={(e) => setHijab(e.target.value)}
                      className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                    >
                      <option value="Niqab">Niqab</option>
                      <option value="Hijab">Hijab</option>
                      <option value="Modest Dress">Modest Dress</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                Bio / About You
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground">
                Profile Photo Privacy
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    key: "Public",
                    label: "🔓 Public",
                    desc: "Everyone can view my profile photo.",
                  },
                  {
                    key: "Hidden",
                    label: "🔒 Hidden",
                    desc: "Blur or lock my profile photo for everyone.",
                  },
                  {
                    key: "VerifiedOnly",
                    label: "👤 Verified Members Only",
                    desc: "Only verified members can view my photo.",
                  },
                  {
                    key: "MatchesOnly",
                    label: "❤️ Matches Only (Recommended)",
                    desc: "Only members who have an accepted match with me can view my photo.",
                  },
                  {
                    key: "FinalProposalAccepted",
                    label: "💍 Final Proposal Accepted",
                    desc: "Photo becomes visible only after the Final Proposal has been accepted.",
                  },
                  {
                    key: "PremiumMatchOnly",
                    label: "⭐ Premium Match Only",
                    desc: "Photo becomes visible only after Final Proposal, Wali Approval, and Premium purchase.",
                  },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPhotoPrivacy(opt.key as PhotoPrivacySetting)}
                    className={cn(
                      "w-full rounded-2xl border p-3 text-left transition-all hover:bg-muted/30 cursor-pointer",
                      photoPrivacy === opt.key
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card",
                    )}
                  >
                    <p className="text-xs font-bold text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-soft transition-colors mt-2"
            >
              {t("common.save")}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Premium Upgrade Dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
          <DialogHeader className="items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <DialogTitle className="font-display text-xl text-primary">
              {t("premium.title")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              {t("premium.subtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-gold/40 bg-gold/5 p-4 text-left">
              <p className="text-sm font-semibold text-primary">Misaq Premium Upgrade</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Unlock voice/video/audio calling, photo sharing, and exchange contact details
                directly with your Wali-approved match.
              </p>
              <p className="text-lg font-display text-primary mt-2">
                ₨ 5,000{" "}
                <span className="text-xs font-sans text-muted-foreground">One-time payment</span>
              </p>
            </div>
            <button
              onClick={handleUpgrade}
              className="w-full rounded-full bg-gradient-gold py-3 font-semibold text-[color:var(--color-gold-foreground)] shadow-soft cursor-pointer"
            >
              {chats.some((c) => c.finalProposalStatus === "purchased")
                ? "Premium Active"
                : "Upgrade Now"}
            </button>
            <p className="text-[10px] text-muted-foreground text-center">{t("premium.footer")}</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Viewed Profile Dialog */}
      <Dialog open={viewedOpen} onOpenChange={setViewedOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary">
              {t("profile.viewed")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              See who recently viewed your profile
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <p className="text-xs text-muted-foreground">
              Viewing profile views is a Premium feature. You have 42 views this week.
            </p>
            <div className="space-y-2">
              {[
                { name: "Aisha R.", time: "2h ago", match: "84%" },
                { name: "Fatima N.", time: "1d ago", match: "91%" },
                { name: "Maryam I.", time: "3d ago", match: "78%" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface p-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-primary">{item.match} match</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setViewedOpen(false);
                setUpgradeOpen(true);
              }}
              className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-soft"
            >
              Get Premium to see all views
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Wali Dialog */}
      <Dialog open={waliOpen} onOpenChange={setWaliOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-primary">
              {t("profile.myWali")}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Manage your guardian or Wali details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveWali} className="mt-3 space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                Wali's Full Name
              </label>
              <input
                value={waliName}
                onChange={(e) => setWaliName(e.target.value)}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                Relationship
              </label>
              <select
                value={waliRel}
                onChange={(e) => setWaliRel(e.target.value)}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="Father">Father</option>
                <option value="Brother">Brother</option>
                <option value="Uncle">Uncle</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground flex justify-between">
                <span>Contact Phone</span>
                {waliPhone && (waliPhone.length < 10 || waliPhone.length > 15) && (
                  <span className="text-[10px] text-destructive font-semibold">
                    Must be 10-15 digits
                  </span>
                )}
              </label>
              <input
                value={waliPhone}
                onChange={(e) => setWaliPhone(e.target.value.replace(/\D/g, ""))}
                className={cn(
                  "w-full rounded-2xl border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary",
                  waliPhone && (waliPhone.length < 10 || waliPhone.length > 15)
                    ? "border-destructive/60"
                    : "border-input",
                )}
                required
              />
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-primary flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>This Wali is CNIC-verified and linked to your matrimonial matches.</span>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-soft"
            >
              Save Wali Settings
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Document Resubmission Dialog */}
      <Dialog open={documentEditOpen} onOpenChange={setDocumentEditOpen}>
        <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
          <DialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <DialogTitle className="font-display text-lg text-primary">
              Verification Documents
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Upload clear scanned documents for verification review.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResubmit} className="space-y-4 text-left mt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">
                CNIC Number
              </label>
              <input
                type="text"
                value={cnicNum}
                onChange={(e) => setCnicNum(e.target.value)}
                placeholder="35201-XXXXXXX-X"
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">
                CNIC Front Image (Mock)
              </label>
              <select
                value={cnicFront}
                onChange={(e) => setCnicFront(e.target.value)}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300">
                  CNIC Card - Scan 1 (Clear)
                </option>
                <option value="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=200">
                  CNIC Card - Scan 2 (Small)
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">
                CNIC Back Image (Mock)
              </label>
              <select
                value={cnicBack}
                onChange={(e) => setCnicBack(e.target.value)}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300">
                  CNIC Card - Back Scan 1 (Clear)
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-muted-foreground">
                Selfie Verification (Mock)
              </label>
              <select
                value={selfieImg}
                onChange={(e) => setSelfieImg(e.target.value)}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="https://randomuser.me/api/portraits/men/32.jpg">
                  Selfie Photo 1 (Match)
                </option>
                <option value="https://randomuser.me/api/portraits/women/12.jpg">
                  Selfie Photo 2 (Alternative)
                </option>
              </select>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setDocumentEditOpen(false)}
                className="flex-1 rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 cursor-pointer shadow-soft"
              >
                Resubmit for Review
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({
  title,
  desc,
  icon,
  gold,
  onClick,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  gold?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="text-start w-full cursor-pointer focus:outline-none">
      <div
        className={`flex items-center gap-3 rounded-2xl border p-4 ${gold ? "border-gold/40 bg-gradient-gold text-[color:var(--color-gold-foreground)] animate-pulse" : "border-border bg-card"}`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${gold ? "bg-white/30" : "bg-primary/10 text-primary"}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{title}</p>
          <p
            className={`truncate text-[11px] ${gold ? "text-[color:var(--color-gold-foreground)]/80" : "text-muted-foreground"}`}
          >
            {desc}
          </p>
        </div>
        <span className="shrink-0 text-lg rtl:rotate-180">›</span>
      </div>
    </button>
  );
}
