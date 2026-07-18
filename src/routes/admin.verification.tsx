import { createFileRoute } from "@tanstack/react-router";
import { usePeople, useMe, addNotification, type Person } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import {
  Check,
  X,
  Eye,
  Inbox,
  ArrowLeft,
  ZoomIn,
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  User,
} from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/verification")({ component: AdminVerify });

function AdminVerify() {
  const t = useT();
  const [people, updatePeople] = usePeople();
  const [me, updateMe] = useMe();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // States for review actions
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState("");
  const [requestDocOpen, setRequestDocOpen] = useState(false);
  const [requestDocText, setRequestDocText] = useState("");
  const [notesText, setNotesText] = useState("");

  // Queue lists profiles that are Submitted or Under Review
  const pending = people.filter(
    (p) =>
      p.verificationStatus === "Submitted" ||
      p.verificationStatus === "Under Review" ||
      (!p.verified && !p.verificationStatus),
  );

  const startReview = (person: Person) => {
    // Automatically transition from Submitted to Under Review when opened
    const next = people.map((p) =>
      p.id === person.id ? { ...p, verificationStatus: "Under Review" as const } : p,
    );
    updatePeople(next);

    const updatedPerson = { ...person, verificationStatus: "Under Review" as const };
    setSelectedPerson(updatedPerson);
    setNotesText(person.internalNotes || "");
  };

  const handleApprove = (person: Person) => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Approving CNIC and selfie...",
      success: () => {
        const next = people.map((p) =>
          p.id === person.id
            ? {
                ...p,
                verified: true,
                verificationStatus: "Verified" as const,
                internalNotes: notesText,
              }
            : p,
        );
        updatePeople(next);

        // If the current logged-in user got approved, sync their profile too
        if (person.id === "me" || person.id === me.id) {
          updateMe({
            ...me,
            verified: true,
            verificationStatus: "Verified" as const,
            internalNotes: notesText,
          });
        }

        // Send notifications
        addNotification({
          kind: "verify",
          title: "Verification Approved",
          desc: "Congratulations! Your profile has been verified.",
        });

        setSelectedPerson(null);
        return `Verification approved for ${person.name}!`;
      },
      error: "Verification failed.",
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReasonText.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    if (!selectedPerson) return;
    const person = selectedPerson;

    const next = people.map((p) =>
      p.id === person.id
        ? {
            ...p,
            verified: false,
            verificationStatus: "Rejected" as const,
            rejectionReason: rejectReasonText,
            internalNotes: notesText,
          }
        : p,
    );
    updatePeople(next);

    if (person.id === "me" || person.id === me.id) {
      updateMe({
        ...me,
        verified: false,
        verificationStatus: "Rejected" as const,
        rejectionReason: rejectReasonText,
        internalNotes: notesText,
      });
    }

    // Send notifications
    addNotification({
      kind: "verify",
      title: "Verification Rejected",
      desc: `Verification rejected: ${rejectReasonText}`,
    });

    toast.error(`Verification rejected for ${person.name}.`);
    setRejectOpen(false);
    setSelectedPerson(null);
  };

  const handleRequestDocsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestDocText.trim()) {
      toast.error("Please explain what additional documents are needed.");
      return;
    }

    if (!selectedPerson) return;
    const person = selectedPerson;

    const next = people.map((p) =>
      p.id === person.id
        ? {
            ...p,
            verificationStatus: "Draft" as const,
            rejectionReason: `Additional documents requested: ${requestDocText}`,
            internalNotes: notesText,
          }
        : p,
    );
    updatePeople(next);

    if (person.id === "me" || person.id === me.id) {
      updateMe({
        ...me,
        verificationStatus: "Draft" as const,
        rejectionReason: `Additional documents requested: ${requestDocText}`,
        internalNotes: notesText,
      });
    }

    // Send notifications
    addNotification({
      kind: "verify",
      title: "Documents Requested",
      desc: `Additional documents requested: ${requestDocText}`,
    });

    toast.info(`Documents requested from ${person.name}.`);
    setRequestDocOpen(false);
    setSelectedPerson(null);
  };

  const handleSuspend = (person: Person) => {
    const next = people.map((p) =>
      p.id === person.id
        ? {
            ...p,
            verificationStatus: "Suspended" as const,
            verified: false,
            internalNotes: notesText,
          }
        : p,
    );
    updatePeople(next);

    if (person.id === "me" || person.id === me.id) {
      updateMe({
        ...me,
        verificationStatus: "Suspended" as const,
        verified: false,
        internalNotes: notesText,
      });
    }

    // Send notifications
    addNotification({
      kind: "verify",
      title: "Profile Suspended",
      desc: "Your profile has been suspended by administration.",
    });

    toast.warning(`${person.name} profile suspended.`);
    setSelectedPerson(null);
  };

  const handleBan = (person: Person) => {
    const next = people.map((p) =>
      p.id === person.id
        ? { ...p, verificationStatus: "Banned" as const, verified: false, internalNotes: notesText }
        : p,
    );
    updatePeople(next);

    if (person.id === "me" || person.id === me.id) {
      updateMe({
        ...me,
        verificationStatus: "Banned" as const,
        verified: false,
        internalNotes: notesText,
      });
    }

    // Send notifications
    addNotification({
      kind: "verify",
      title: "Profile Banned",
      desc: "Your profile has been banned by administration due to policy violations.",
    });

    toast.error(`${person.name} has been permanently BANNED.`);
    setSelectedPerson(null);
  };

  // Render Full-Screen Document Review Component
  if (selectedPerson) {
    const p = selectedPerson;
    return (
      <div className="min-h-full bg-background flex flex-col animate-fade-in pb-10">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card px-4 py-3 shadow-sm">
          <button
            onClick={() => setSelectedPerson(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted border border-border cursor-pointer"
            aria-label="Back to queue"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="font-display font-semibold text-sm truncate">Reviewing {p.name}</h2>
            <p className="text-[10px] text-muted-foreground">ID: {p.id}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary uppercase">
            {p.verificationStatus || "Submitted"}
          </span>
        </header>

        <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* COLUMN 1: Visual Document Comparison */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-4 space-y-3 text-left">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Identity & Wali Photos
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 text-center">
                  <p className="text-[10px] text-muted-foreground">Profile Photo</p>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted">
                    <img src={p.photo} alt="Profile" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[10px] text-muted-foreground">Selfie Verification</p>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted group">
                    <img
                      src={p.selfie || p.photo}
                      alt="Selfie"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => setZoomImage(p.selfie || p.photo)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[10px] text-muted-foreground">Wali Photo</p>
                  <div className="relative aspect-square overflow-hidden rounded-2xl border bg-muted group">
                    <img
                      src={p.waliPhoto || p.waliPhotoSelf || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"}
                      alt="Wali"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() => setZoomImage(p.waliPhoto || p.waliPhotoSelf || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150")}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> CNIC Identification Documents
              </h3>
              <p className="text-[10px] text-muted-foreground leading-normal">
                CNIC Number:{" "}
                <span className="font-semibold text-foreground">{p.cnicNumber || "N/A"}</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 text-center">
                  <p className="text-[9px] text-muted-foreground">CNIC Front</p>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl border bg-muted group">
                    <img
                      src={
                        p.cnicFront ||
                        "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300"
                      }
                      alt="CNIC Front"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setZoomImage(
                          p.cnicFront ||
                            "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
                        )
                      }
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-[9px] text-muted-foreground">CNIC Back</p>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-xl border bg-muted group">
                    <img
                      src={
                        p.cnicBack ||
                        "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300"
                      }
                      alt="CNIC Back"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setZoomImage(
                          p.cnicBack ||
                            "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300",
                        )
                      }
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {p.gallery && p.gallery.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-4 space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Gallery Photos
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {p.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setZoomImage(imgUrl)}
                      className="h-16 w-16 shrink-0 rounded-lg overflow-hidden border bg-muted cursor-pointer relative group"
                    >
                      <img src={imgUrl} alt="Gallery" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
                        <ZoomIn className="h-3 w-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 2: Text details and Actions */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-4 space-y-3 text-xs">
              <h3 className="font-semibold text-muted-foreground uppercase tracking-wider">
                Member Details
              </h3>
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 border-b border-border pb-3">
                <div>
                  <p className="text-[10px] text-muted-foreground">Full Name</p>
                  <p className="font-medium text-foreground">{p.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Age / Gender</p>
                  <p className="font-medium text-foreground capitalize">
                    {p.age} Yrs · {p.gender}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground">
                    {p.city}, {p.country}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Education</p>
                  <p className="font-medium text-foreground">{p.education}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Profession</p>
                  <p className="font-medium text-foreground">{p.profession}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Income</p>
                  <p className="font-medium text-foreground">{p.monthlyIncome || "150k — 300k"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Religion</p>
                  <p className="font-medium text-foreground">Islam</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Maslak / Sect</p>
                  <p className="font-medium text-foreground">{p.sect || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{p.gender === "male" ? "Prayer in Masjid" : "Prayer"}</p>
                  <p className="font-medium text-foreground">{p.prayer}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Quran Reading</p>
                  <p className="font-medium text-foreground">{p.quran}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Religious Practice</p>
                  <p className="font-medium text-foreground">{p.religiousPractice || "Intermediate"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Religious Environment</p>
                  <p className="font-medium text-foreground">{p.religiousEnvironment || "Moderate"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Hijab / Beard</p>
                  <p className="font-medium text-foreground">{p.hijab || p.beard || "N/A"}</p>
                </div>
              </div>

              <h3 className="font-semibold text-muted-foreground uppercase tracking-wider pt-1">
                Wali Information
              </h3>
              <div className="flex items-center gap-3">
                <Avatar
                  person={{ name: p.waliName || "Wali", photo: p.waliPhoto || undefined }}
                  size={40}
                />
                <div className="min-w-0 flex-1 grid grid-cols-2 gap-y-1 gap-x-2">
                  <div>
                    <p className="text-[9px] text-muted-foreground">Wali Name</p>
                    <p className="font-medium truncate">{p.waliName || "Abdullah Raza"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">Relationship</p>
                    <p className="font-medium truncate">{p.waliRelationship || "Father"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">Phone</p>
                    <p className="font-medium truncate">{p.waliPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground">Email</p>
                    <p className="font-medium truncate">{p.waliEmail || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Timeline Graph */}
            <div className="rounded-3xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Verification Timeline
              </h3>
              <div className="flex items-center justify-between text-xs px-2">
                {[
                  { label: "Draft", completed: true },
                  { label: "Submitted", completed: true },
                  {
                    label: "In Review",
                    completed:
                      p.verificationStatus === "Under Review" ||
                      p.verificationStatus === "Verified",
                  },
                  { label: "Verified", completed: p.verificationStatus === "Verified" },
                ].map((s, idx, arr) => (
                  <div key={idx} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          s.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s.completed ? "✓" : idx + 1}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{s.label}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 -mt-4 ${
                          arr[idx + 1].completed ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            <div className="rounded-3xl border border-border bg-card p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Administrative Internal Notes
              </h3>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Add internal verification notes here (e.g. verified ID via WhatsApp call, wali phone checked)..."
                rows={3}
                className="w-full rounded-2xl border border-input bg-surface p-3 text-xs outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Review actions */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleApprove(p)}
                className="flex items-center justify-center gap-1.5 rounded-full bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/95 transition-all shadow-soft cursor-pointer"
              >
                <Check className="h-4 w-4" /> Approve Profile
              </button>
              <button
                onClick={() => setRejectOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-full border border-destructive/40 py-3 font-semibold text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" /> Reject Profile
              </button>
              <button
                onClick={() => setRequestDocOpen(true)}
                className="flex items-center justify-center gap-1 rounded-full border border-border py-2.5 font-medium hover:bg-muted/50 cursor-pointer"
              >
                Request Documents
              </button>
              <button
                onClick={() => handleSuspend(p)}
                className="flex items-center justify-center gap-1 rounded-full border border-border py-2.5 font-medium hover:bg-muted/50 cursor-pointer text-amber-600 border-amber-200"
              >
                Suspend Profile
              </button>
              <button
                onClick={() => handleBan(p)}
                className="col-span-2 flex items-center justify-center gap-1.5 rounded-full bg-destructive text-destructive-foreground py-2.5 font-semibold hover:bg-destructive/95 cursor-pointer shadow-sm"
              >
                <ShieldAlert className="h-4 w-4" /> Permanently Ban Profile
              </button>
            </div>
          </div>
        </div>

        {/* Zoom Lightbox Dialog */}
        <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
          <DialogContent className="max-w-[90vw] md:max-w-[70vw] rounded-3xl bg-black p-2 border-none">
            <div className="relative flex items-center justify-center p-2">
              <img
                src={zoomImage || ""}
                alt="Zoomed Document"
                className="max-h-[80vh] max-w-full rounded-2xl object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
            <DialogHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="font-display text-lg text-primary">
                Reject Verification
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Enter the reason for rejection. This will be sent directly to the member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRejectSubmit} className="space-y-4 text-left mt-2">
              <textarea
                value={rejectReasonText}
                onChange={(e) => setRejectReasonText(e.target.value)}
                placeholder="e.g. CNIC Front image is blurred. Selfie photo does not match the CNIC card photo..."
                rows={4}
                className="w-full rounded-2xl border border-input bg-surface p-3 text-xs outline-none focus:border-primary resize-none"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectOpen(false)}
                  className="flex-1 rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-destructive text-white py-2.5 text-xs font-semibold hover:bg-destructive/95 cursor-pointer shadow-soft"
                >
                  Reject & Notify
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Request Documents Dialog */}
        <Dialog open={requestDocOpen} onOpenChange={setRequestDocOpen}>
          <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
            <DialogHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                <FileText className="h-5 w-5" />
              </div>
              <DialogTitle className="font-display text-lg text-primary">
                Request Documents
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Detail exactly what additional documents or files are required from this member.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRequestDocsSubmit} className="space-y-4 text-left mt-2">
              <textarea
                value={requestDocText}
                onChange={(e) => setRequestDocText(e.target.value)}
                placeholder="e.g. Please upload a clear photo of the back of your CNIC card. A live selfie with your CNIC card in hand is requested..."
                rows={4}
                className="w-full rounded-2xl border border-input bg-surface p-3 text-xs outline-none focus:border-primary resize-none"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRequestDocOpen(false)}
                  className="flex-1 rounded-full border border-border py-2.5 text-xs font-semibold hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary text-primary-foreground py-2.5 text-xs font-semibold hover:bg-primary/95 cursor-pointer shadow-soft"
                >
                  Send Request
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Render Verification Queue List
  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-lg font-bold text-primary">Verification Queue</h1>
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
          {pending.length} pending
        </span>
      </div>

      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground bg-card rounded-3xl border border-border">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="font-display text-sm font-semibold">All Verifications Completed</h3>
          <p className="text-xs text-muted-foreground max-w-[200px]">
            No pending submissions. Alhamdulillah!
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {pending.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-border bg-card p-4 animate-fade-in space-y-4"
            >
              <div className="flex items-center gap-3">
                <Avatar person={p} size={48} />
                <div className="flex-1 min-w-0">
                  <p className="truncate font-semibold text-sm">{p.name}</p>
                  <p className="truncate text-[10px] text-muted-foreground">
                    Registered: {p.registrationDate || "Just now"} · {p.city}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] rounded-full bg-amber-500/10 text-amber-500 px-2 py-0.5 font-medium capitalize">
                  {p.verificationStatus || "Submitted"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "CNIC Front", src: p.cnicFront },
                  { label: "CNIC Back", src: p.cnicBack },
                  { label: "Selfie Verify", src: p.selfie },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="aspect-[3/2] rounded-xl overflow-hidden bg-muted border relative text-[9px] text-white flex items-end p-1.5"
                  >
                    <img
                      src={
                        s.src ||
                        "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=200"
                      }
                      className="absolute inset-0 h-full w-full object-cover brightness-[0.8]"
                      alt={s.label}
                    />
                    <span className="relative font-medium drop-shadow-md truncate">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => startReview(p)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary py-2 text-xs text-primary-foreground font-semibold cursor-pointer shadow-soft"
                >
                  <Eye className="h-3.5 w-3.5" /> Start Detailed Review
                </button>
                <button
                  onClick={() => handleApprove(p)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary cursor-pointer hover:bg-primary/10"
                  aria-label="Quick Approve"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
