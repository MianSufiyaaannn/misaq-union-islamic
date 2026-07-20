import { useState } from "react";
import { type Person, usePeople, useMe, chatsData, findPerson } from "@/lib/mock";
import { setReadOnlySession } from "@/lib/admin-auth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Eye,
  UserCheck,
  Ban,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  FileText,
  MessageSquare,
  X,
  Check,
  AlertTriangle,
  Lock,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  BookOpen,
  User,
  Phone,
  Mail,
  Home,
  ShieldCheck,
  ImageIcon,
  ZoomIn,
  Play,
} from "lucide-react";

interface AdminProfileModalProps {
  person: Person | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "overview" | "documents" | "reports" | "chats";
}

export function AdminProfileModal({
  person,
  open,
  onOpenChange,
  initialTab = "overview",
}: AdminProfileModalProps) {
  const navigate = useNavigate();
  const [people, updatePeople] = usePeople();
  const [me, updateMe] = useMe();

  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "reports" | "chats">(
    initialTab,
  );
  const [lightboxImage, setLightboxImage] = useState<{ title: string; src: string } | null>(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReasonText, setRejectionReasonText] = useState("");

  if (!person) return null;

  // Compute reports associated with this person
  let userReports: Array<{ by: string; against: string; reasonKey: string; time: string; severity: string }> = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("misaq_reports");
      const list = saved ? JSON.parse(saved) : [];
      userReports = list.filter((r: any) => r.against === person.name || r.against === person.email);
    } catch {
      userReports = [];
    }
  }

  // Compute chats associated with this person
  const userChats = chatsData.filter((c) => c.personId === person.id || c.matchId.includes(person.id));

  // Handlers for Admin Management Buttons
  const handleReadOnlyLogin = () => {
    setReadOnlySession(person.id);
    onOpenChange(false);
    toast.success(`Entered Read-Only Admin session as ${person.name}`);
    navigate({ to: "/app" });
  };

  const handleVerify = () => {
    const next = people.map((p) =>
      p.id === person.id ? { ...p, verified: true, verificationStatus: "Verified" as const } : p,
    );
    updatePeople(next);
    if (me.id === person.id || person.id === "me") {
      updateMe({ ...me, verified: true, verificationStatus: "Verified" as const });
    }
    toast.success(`${person.name} has been verified successfully!`);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReasonText.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }
    const next = people.map((p) =>
      p.id === person.id
        ? {
            ...p,
            verified: false,
            verificationStatus: "Rejected" as const,
            rejectionReason: rejectionReasonText,
          }
        : p,
    );
    updatePeople(next);
    toast.error(`Verification rejected for ${person.name}.`);
    setRejectDialogOpen(false);
    setRejectionReasonText("");
  };

  const handleToggleSuspend = () => {
    const isCurrentlySuspended = person.verificationStatus === "Suspended";
    const nextStatus = isCurrentlySuspended ? ("Verified" as const) : ("Suspended" as const);
    const nextPeople = people.map((p) =>
      p.id === person.id ? { ...p, verificationStatus: nextStatus } : p,
    );
    updatePeople(nextPeople);
    toast.info(`${person.name} account status changed to ${nextStatus}.`);
  };

  const handleTogglePremium = () => {
    const nextPeople = people.map((p) =>
      p.id === person.id ? { ...p, premium: !p.premium } : p,
    );
    updatePeople(nextPeople);
    toast.success(`${person.name} is now ${!person.premium ? "Premium Member" : "Standard Member"}.`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[540px] max-h-[90vh] rounded-3xl bg-background p-0 overflow-hidden flex flex-col border border-border shadow-2xl">
          {/* Header Banner */}
          <div className="relative bg-gradient-royal p-5 text-white shrink-0">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-4">
              <img
                src={person.photo}
                alt={person.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-white/30 shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-xl font-bold truncate leading-tight">
                    {person.name}
                  </h2>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                      person.verificationStatus === "Verified"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : person.verificationStatus === "Rejected"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : person.verificationStatus === "Suspended"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-white/10 text-white/80 border border-white/20",
                    )}
                  >
                    {person.verificationStatus || "Submitted"}
                  </span>
                  {person.premium && (
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-400/30">
                      ✦ Premium
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/80 mt-1 truncate">
                  {person.age} yrs · {person.gender} · {person.city}, {person.country} · {person.profession}
                </p>
                <p className="text-[10px] text-white/60 mt-0.5">ID: {person.id}</p>
              </div>
            </div>

            {/* Quick Management Buttons Row */}
            <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/10">
              <button
                onClick={handleReadOnlyLogin}
                className="flex items-center gap-1.5 rounded-full bg-white text-primary px-3 py-1.5 text-[11px] font-bold shadow hover:bg-white/90 cursor-pointer transition-all"
              >
                <Eye className="h-3.5 w-3.5" /> Login as User (Read Only)
              </button>

              <button
                onClick={handleVerify}
                className="flex items-center gap-1 rounded-full bg-emerald-600/90 text-white px-2.5 py-1.5 text-[10px] font-semibold hover:bg-emerald-600 cursor-pointer transition-all"
              >
                <Check className="h-3 w-3" /> Verify
              </button>

              <button
                onClick={() => setRejectDialogOpen(true)}
                className="flex items-center gap-1 rounded-full bg-rose-600/90 text-white px-2.5 py-1.5 text-[10px] font-semibold hover:bg-rose-600 cursor-pointer transition-all"
              >
                <X className="h-3 w-3" /> Reject
              </button>

              <button
                onClick={handleToggleSuspend}
                className="flex items-center gap-1 rounded-full bg-amber-600/90 text-white px-2.5 py-1.5 text-[10px] font-semibold hover:bg-amber-600 cursor-pointer transition-all"
              >
                <Ban className="h-3 w-3" />
                {person.verificationStatus === "Suspended" ? "Activate" : "Suspend"}
              </button>

              <button
                onClick={handleTogglePremium}
                className="flex items-center gap-1 rounded-full bg-amber-400/30 text-amber-200 border border-amber-300/40 px-2.5 py-1.5 text-[10px] font-semibold hover:bg-amber-400/40 cursor-pointer transition-all"
              >
                <Sparkles className="h-3 w-3" />
                {person.premium ? "Revoke Premium" : "Grant Premium"}
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-surface px-4 py-2 gap-2 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition-colors shrink-0",
                activeTab === "overview"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              📄 Full Profile
            </button>
            <button
              onClick={() => setActiveTab("documents")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition-colors shrink-0",
                activeTab === "documents"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              📁 Documents & CNICs
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition-colors shrink-0 flex items-center gap-1",
                activeTab === "reports"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              🚩 Reports ({userReports.length})
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium cursor-pointer transition-colors shrink-0 flex items-center gap-1",
                activeTab === "chats"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              💬 Chat History ({userChats.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === "overview" && (
              <div className="space-y-5 text-left">
                {/* Direct Lightbox Shortcuts */}
                <div className="rounded-2xl border border-border bg-card p-3 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Document Viewers & Lightboxes
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() =>
                        setLightboxImage({
                          title: `${person.name}'s CNIC Front & Back`,
                          src: person.cnicFront || person.photo,
                        })
                      }
                      className="flex items-center gap-2 rounded-xl border border-border p-2 hover:bg-muted/40 transition-all font-medium text-left"
                    >
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">View Member CNIC</span>
                    </button>

                    <button
                      onClick={() =>
                        setLightboxImage({
                          title: `${person.waliName || "Wali"}'s CNIC Front & Back`,
                          src: person.waliCnicFront || person.waliPhoto || person.photo,
                        })
                      }
                      className="flex items-center gap-2 rounded-xl border border-border p-2 hover:bg-muted/40 transition-all font-medium text-left"
                    >
                      <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">View Wali CNIC</span>
                    </button>

                    <button
                      onClick={() =>
                        setLightboxImage({
                          title: `${person.name}'s Verification Selfie`,
                          src: person.selfie || person.photo,
                        })
                      }
                      className="flex items-center gap-2 rounded-xl border border-border p-2 hover:bg-muted/40 transition-all font-medium text-left"
                    >
                      <User className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">View Selfie</span>
                    </button>

                    <button
                      onClick={() =>
                        setLightboxImage({
                          title: `${person.name}'s Photo Gallery`,
                          src: person.gallery?.[0] || person.photo,
                        })
                      }
                      className="flex items-center gap-2 rounded-xl border border-border p-2 hover:bg-muted/40 transition-all font-medium text-left"
                    >
                      <ImageIcon className="h-4 w-4 text-primary shrink-0" />
                      <span className="truncate">View Gallery ({person.gallery?.length || 1})</span>
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <Section title="Personal Information" icon={<User className="h-4 w-4" />}>
                  <Row label="Full Name" value={person.name} />
                  <Row label="Father Name" value={person.fatherName || `${person.name.split(" ")[1] || "Wali"} Senior`} />
                  <Row label="Date of Birth" value={person.dateOfBirth || "1995-06-15"} />
                  <Row label="Age" value={`${person.age} years`} />
                  <Row label="Gender" value={person.gender} />
                  <Row label="Marital Status" value={person.maritalStatus || "Never Married"} />
                  <Row label="Height" value={person.height} />
                  <Row label="Weight" value={person.weight || "60 kg"} />
                  <Row label="Country" value={person.country} />
                  <Row label="City" value={person.city} />
                  <Row label="Nationality" value={person.nationality || "Pakistani"} />
                  <Row label="Phone Number" value={person.phone || "+92 300 1234567"} />
                  <Row label="Email Address" value={person.email || "user@example.com"} />
                  <Row label="Address" value={person.address || "House 12, Gulberg, Lahore"} />
                </Section>

                {/* Education & Profession */}
                <Section title="Education & Profession" icon={<GraduationCap className="h-4 w-4" />}>
                  <Row label="Education" value={person.education} />
                  <Row label="Profession" value={person.profession} />
                  <Row label="Company" value={person.company || "Private Sector"} />
                  <Row label="Monthly Income" value={person.monthlyIncome || "150k - 300k"} />
                </Section>

                {/* About & Interests */}
                <Section title="About Me & Interests" icon={<Heart className="h-4 w-4" />}>
                  <div className="p-3 border-b border-border text-xs">
                    <p className="font-semibold text-muted-foreground uppercase text-[10px] mb-1">
                      Bio / About Me
                    </p>
                    <p className="text-foreground leading-relaxed">{person.bio}</p>
                  </div>
                  <Row label="Hobbies" value={person.hobbies?.join(", ") || "Reading, Sports"} />
                  <Row label="Interests" value={person.interests?.join(", ") || "Islamic History, Travel"} />
                  <Row label="Profile Visibility" value={person.photoPrivacy || person.profileVisibility || "VerifiedOnly"} />
                </Section>

                {/* Religious Information */}
                <Section title="Religious Information" icon={<BookOpen className="h-4 w-4" />}>
                  <Row label="Religion" value={person.religion || "Islam"} />
                  <Row label="Sect / Maslak" value={person.sect} />
                  <Row label="Religious Practice" value={person.religiousPractice || "Practising"} />
                  <Row label="Prayer Details" value={person.prayer} />
                  <Row label="Quran Reading" value={person.quran} />
                  <Row label="Islamic Knowledge" value={person.islamicKnowledge || "Intermediate"} />
                  <Row label="Beard / Hijab" value={person.beard || person.hijab || "Sunnah"} />
                  <Row label="Islamic Goals" value={person.islamicGoals || "Build a pious family"} />
                  <Row label="Dowry Preference" value={person.dowryPreference || "No dowry / Sunnah"} />
                </Section>

                {/* Wali Information */}
                <Section title="Wali Information" icon={<ShieldCheck className="h-4 w-4" />}>
                  <Row label="Wali Name" value={person.waliName || "Abdullah Wali"} />
                  <Row label="Wali Relationship" value={person.waliRelationship || "Father"} />
                  <Row label="Wali Phone" value={person.waliPhone || "+92 300 5000000"} />
                  <Row label="Wali Email" value={person.waliEmail || "wali@gmail.com"} />
                </Section>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4 text-left">
                <p className="text-xs text-muted-foreground">
                  Click on any document preview to open full high-resolution lightbox inspector.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Member CNIC Front */}
                  <div
                    onClick={() =>
                      setLightboxImage({
                        title: `${person.name} — CNIC Front`,
                        src: person.cnicFront || person.photo,
                      })
                    }
                    className="rounded-2xl border border-border p-3 bg-card hover:border-primary cursor-pointer transition-all space-y-2"
                  >
                    <p className="font-semibold text-xs text-muted-foreground uppercase text-[10px]">
                      Member CNIC Front
                    </p>
                    <div className="relative h-28 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={person.cnicFront || person.photo}
                        alt="CNIC Front"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Member CNIC Back */}
                  <div
                    onClick={() =>
                      setLightboxImage({
                        title: `${person.name} — CNIC Back`,
                        src: person.cnicBack || person.photo,
                      })
                    }
                    className="rounded-2xl border border-border p-3 bg-card hover:border-primary cursor-pointer transition-all space-y-2"
                  >
                    <p className="font-semibold text-xs text-muted-foreground uppercase text-[10px]">
                      Member CNIC Back
                    </p>
                    <div className="relative h-28 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={person.cnicBack || person.photo}
                        alt="CNIC Back"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Wali CNIC Front */}
                  <div
                    onClick={() =>
                      setLightboxImage({
                        title: `${person.waliName || "Wali"} — CNIC Front`,
                        src: person.waliCnicFront || person.waliPhoto || person.photo,
                      })
                    }
                    className="rounded-2xl border border-border p-3 bg-card hover:border-primary cursor-pointer transition-all space-y-2"
                  >
                    <p className="font-semibold text-xs text-muted-foreground uppercase text-[10px]">
                      Wali CNIC Front
                    </p>
                    <div className="relative h-28 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={person.waliCnicFront || person.waliPhoto || person.photo}
                        alt="Wali CNIC Front"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Wali CNIC Back */}
                  <div
                    onClick={() =>
                      setLightboxImage({
                        title: `${person.waliName || "Wali"} — CNIC Back`,
                        src: person.waliCnicBack || person.waliPhoto || person.photo,
                      })
                    }
                    className="rounded-2xl border border-border p-3 bg-card hover:border-primary cursor-pointer transition-all space-y-2"
                  >
                    <p className="font-semibold text-xs text-muted-foreground uppercase text-[10px]">
                      Wali CNIC Back
                    </p>
                    <div className="relative h-28 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={person.waliCnicBack || person.waliPhoto || person.photo}
                        alt="Wali CNIC Back"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Member Selfie */}
                  <div
                    onClick={() =>
                      setLightboxImage({
                        title: `${person.name} — Live Verification Selfie`,
                        src: person.selfie || person.photo,
                      })
                    }
                    className="rounded-2xl border border-border p-3 bg-card hover:border-primary cursor-pointer transition-all space-y-2"
                  >
                    <p className="font-semibold text-xs text-muted-foreground uppercase text-[10px]">
                      Verification Selfie
                    </p>
                    <div className="relative h-28 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={person.selfie || person.photo}
                        alt="Selfie"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-6 w-6" />
                      </div>
                    </div>
                  </div>

                  {/* Wali Photo */}
                  <div
                    onClick={() =>
                      setLightboxImage({
                        title: `${person.waliName || "Wali"} — Profile Photo`,
                        src: person.waliPhoto || person.photo,
                      })
                    }
                    className="rounded-2xl border border-border p-3 bg-card hover:border-primary cursor-pointer transition-all space-y-2"
                  >
                    <p className="font-semibold text-xs text-muted-foreground uppercase text-[10px]">
                      Wali Portrait
                    </p>
                    <div className="relative h-28 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
                      <img
                        src={person.waliPhoto || person.photo}
                        alt="Wali Photo"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
                        <ZoomIn className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Member Gallery Photos */}
                <div className="mt-4 rounded-2xl border border-border bg-card p-4 space-y-3">
                  <p className="font-display font-semibold text-sm">
                    Gallery Photos ({person.gallery?.length || 1})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(person.gallery || [person.photo]).map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          setLightboxImage({
                            title: `${person.name} — Gallery Photo #${idx + 1}`,
                            src: url,
                          })
                        }
                        className="h-24 bg-muted rounded-xl overflow-hidden cursor-pointer relative group"
                      >
                        <img src={url} alt={`Gallery ${idx + 1}`} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <ZoomIn className="h-5 w-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-3 text-left">
                {userReports.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground bg-muted/20 rounded-2xl border border-border">
                    <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-2 opacity-60" />
                    No safety reports filed against {person.name}.
                  </div>
                ) : (
                  userReports.map((r, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card p-3 space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Policy Violation Report
                        </span>
                        <span className="text-[10px] text-muted-foreground">{r.time}</span>
                      </div>
                      <p className="text-xs text-foreground font-medium">By: {r.by}</p>
                      <p className="text-xs text-muted-foreground">{r.reasonKey}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "chats" && (
              <div className="space-y-3 text-left">
                {userChats.length === 0 ? (
                  <div className="text-center py-12 text-xs text-muted-foreground bg-muted/20 rounded-2xl border border-border">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2 opacity-60" />
                    No active chat threads found for {person.name}.
                  </div>
                ) : (
                  userChats.map((c) => {
                    const partner = findPerson(c.personId === person.id ? "me" : c.personId);
                    return (
                      <div key={c.id} className="rounded-2xl border border-border bg-card p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={partner.photo}
                              alt={partner.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-xs">{partner.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {c.messages.length} messages · Last: {c.lastAt}
                              </p>
                            </div>
                          </div>
                          <span className="text-[9px] rounded-full bg-primary/10 text-primary font-bold px-2 py-0.5 uppercase">
                            {c.finalProposalStatus || "active"}
                          </span>
                        </div>
                        <div className="max-h-36 overflow-y-auto space-y-1 bg-surface p-2 rounded-xl text-[11px] border border-border">
                          {c.messages.slice(-4).map((m, idx) => (
                            <div key={idx} className="flex justify-between gap-2 text-muted-foreground">
                              <span className="font-medium text-foreground truncate">
                                {m.from === "me" ? person.name.split(" ")[0] : partner.name.split(" ")[0]}: {m.text || "[Voice note]"}
                              </span>
                              <span className="text-[9px] shrink-0">{m.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* High-Resolution Document Lightbox Modal */}
      {lightboxImage && (
        <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
          <DialogContent className="max-w-[500px] rounded-3xl bg-background p-4 text-center">
            <DialogHeader className="items-start text-left mb-2">
              <DialogTitle className="font-display text-base font-bold">
                {lightboxImage.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                High-resolution administrative inspection
              </DialogDescription>
            </DialogHeader>
            <div className="relative max-h-[65vh] overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-border">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <button
              onClick={() => setLightboxImage(null)}
              className="w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground mt-3"
            >
              Close Inspector
            </button>
          </DialogContent>
        </Dialog>
      )}

      {/* Reject Reason Dialog */}
      {rejectDialogOpen && (
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="max-w-[360px] rounded-3xl bg-background p-5">
            <DialogHeader>
              <DialogTitle className="font-display text-base text-destructive font-bold">
                Reject Verification
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Provide a reason for rejecting {person.name}'s verification request.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRejectSubmit} className="space-y-3 mt-2">
              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="E.g., CNIC document photo is blurry or selfie match failed..."
                rows={3}
                required
                className="w-full rounded-2xl border border-input bg-surface p-3 text-xs outline-none focus:border-primary resize-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectDialogOpen(false)}
                  className="flex-1 rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-destructive py-2 text-xs font-semibold text-white shadow"
                >
                  Submit Rejection
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </>
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
    <div>
      <h3 className="mb-2 flex items-center gap-1.5 font-display text-sm font-semibold text-primary">
        {icon} {title}
      </h3>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs">
      <span className="text-muted-foreground uppercase text-[10px] tracking-wider shrink-0 font-medium">
        {label}
      </span>
      <span className="font-medium text-foreground truncate text-right min-w-0">{value}</span>
    </div>
  );
}
