import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { TopBar } from "@/components/misaq/top-bar";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useT } from "@/components/misaq/providers";
import { useMe, usePeople, type Person } from "@/lib/mock";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, ShieldAlert } from "lucide-react";
import {
  validateRealEmail,
  setPendingVerification,
  verifyEmailOTP,
  markEmailAsVerified,
} from "@/lib/email-validator";

const search = z.object({ role: z.enum(["member", "wali"]).catch("member") });

export const Route = createFileRoute("/auth/register/steps")({
  component: Wizard,
  validateSearch: search,
});

type Gender = "male" | "female" | null;


function Wizard() {
  const { role } = Route.useSearch();
  const t = useT();
  const navigate = useNavigate();
  const [me, updateMe] = useMe();
  const [peopleList, updatePeople] = usePeople();

  const memberSteps = [
    t("reg.s.personal"),
    t("reg.s.education"),
    t("reg.s.religious"),
    t("reg.s.dowry"),
    t("reg.s.family"),
    t("reg.s.wali"),
  ];
  const waliSteps = [t("reg.s.aboutYou"), t("reg.s.relationship"), t("reg.s.verification")];
  const steps = role === "wali" ? waliSteps : memberSteps;
  const [i, setI] = useState(0);

  const [pendingVerificationOpen, setPendingVerificationOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  // Unified persistent form state for stability and back/forward navigation
  const [formData, setFormData] = useState<Record<string, any>>({
    fullName: "",
    email: "",
    dob: "",
    height: "",
    gender: null,
    country: "",
    city: "",
    nationality: "",
    education: "",
    profession: "",
    income: "",
    prayer: "",
    quran: "",
    knowledge: "",
    beard: "",
    hijab: "",
    dress: "",
    environment: "",
    goals: [] as string[],
    dowry: "",
    fatherAlive: "",
    motherAlive: "",
    familyType: "",
    brothers: "",
    sisters: "",
    waliName: "",
    waliRel: "",
    waliPhone: "",
    waliWhatsapp: "",
    waliEmail: "",
    waliCnic: "",
    cnicFront: "",
    cnicBack: "",
    selfie: "",
    waliPhoto: "",
    waliPhotoSelf: "",
    religion: "Islam",
    sect: "",
    photoPrivacy: "Public",

    // Wali fields
    waliFullName: "",
    waliPhoneSelf: "",
    waliEmailSelf: "",
    waliCountry: "",
    waliCity: "",
    memberName: "",
    memberId: "",
    waliRelSelf: "",
    waliCnicSelf: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setGender = (g: Gender) => {
    updateField("gender", g);
  };

  const isLast = i === steps.length - 1;

  // Step validation
  const errors: Record<string, string> = {};
  if (role === "member") {
    if (i === 0) {
      if (!formData.fullName?.trim()) errors.fullName = "Required";
      if (!formData.email?.trim()) {
        errors.email = "Required";
      } else {
        const emailRes = validateRealEmail(formData.email);
        if (!emailRes.valid) errors.email = emailRes.error || "Invalid email format";
      }
      if (!formData.dob?.trim()) errors.dob = "Required";
      if (!formData.height?.trim()) errors.height = "Required";
      if (!formData.gender) errors.gender = "Required";
      if (!formData.country?.trim()) errors.country = "Required";
      if (!formData.city?.trim()) errors.city = "Required";
      if (!formData.nationality) errors.nationality = "Required";
    } else if (i === 1) {
      if (!formData.education) errors.education = "Required";
      if (!formData.profession) errors.profession = "Required";
      if (!formData.income) errors.income = "Required";
    } else if (i === 2) {
      if (!formData.sect) errors.sect = "Required";
      if (!formData.prayer) errors.prayer = "Required";
      if (!formData.quran) errors.quran = "Required";
      if (!formData.knowledge) errors.knowledge = "Required";
      if (formData.gender === "male" && !formData.beard) errors.beard = "Required";
      if (formData.gender === "female" && !formData.hijab) errors.hijab = "Required";
      if (!formData.dress) errors.dress = "Required";
      if (!formData.environment) errors.environment = "Required";
      if (!formData.goals || formData.goals.length === 0) errors.goals = "Required";
    } else if (i === 3) {
      if (!formData.dowry) errors.dowry = "Required";
    } else if (i === 4) {
      if (!formData.fatherAlive) errors.fatherAlive = "Required";
      if (!formData.motherAlive) errors.motherAlive = "Required";
      if (!formData.familyType) errors.familyType = "Required";
      if (!formData.brothers?.trim()) {
        errors.brothers = "Required";
      } else if (isNaN(Number(formData.brothers))) {
        errors.brothers = "Must be a number";
      }
      if (!formData.sisters?.trim()) {
        errors.sisters = "Required";
      } else if (isNaN(Number(formData.sisters))) {
        errors.sisters = "Must be a number";
      }
    } else if (i === 5) {
      if (!formData.waliName?.trim()) errors.waliName = "Required";
      if (!formData.waliRel) errors.waliRel = "Required";
      if (!formData.waliPhone?.trim()) {
        errors.waliPhone = "Required";
      } else if (formData.waliPhone.length < 10 || formData.waliPhone.length > 15) {
        errors.waliPhone = "Must be 10-15 digits";
      }
      if (!formData.waliWhatsapp?.trim()) {
        errors.waliWhatsapp = "Required";
      } else if (formData.waliWhatsapp.length < 10 || formData.waliWhatsapp.length > 15) {
        errors.waliWhatsapp = "Must be 10-15 digits";
      }
      if (!formData.waliEmail?.trim()) {
        errors.waliEmail = "Required";
      } else {
        const waliEmailRes = validateRealEmail(formData.waliEmail);
        if (!waliEmailRes.valid) errors.waliEmail = waliEmailRes.error || "Invalid email format";
      }
      if (!formData.waliCnic?.trim()) {
        errors.waliCnic = "Required";
      } else if (formData.waliCnic.length !== 13) {
        errors.waliCnic = "Must be exactly 13 digits";
      }
      if (!formData.waliPhoto) errors.waliPhoto = "Required";
      if (!formData.cnicFront) errors.cnicFront = "Required";
      if (!formData.cnicBack) errors.cnicBack = "Required";
      if (!formData.selfie) errors.selfie = "Required";
    }
  } else {
    // Wali steps validation
    if (i === 0) {
      if (!formData.waliFullName?.trim()) errors.waliFullName = "Required";
      if (!formData.waliPhoneSelf?.trim()) {
        errors.waliPhoneSelf = "Required";
      } else if (formData.waliPhoneSelf.length < 10 || formData.waliPhoneSelf.length > 15) {
        errors.waliPhoneSelf = "Must be 10-15 digits";
      }
      if (!formData.waliEmailSelf?.trim()) {
        errors.waliEmailSelf = "Required";
      } else {
        const waliSelfRes = validateRealEmail(formData.waliEmailSelf);
        if (!waliSelfRes.valid) errors.waliEmailSelf = waliSelfRes.error || "Invalid email format";
      }
      if (!formData.waliCountry?.trim()) errors.waliCountry = "Required";
      if (!formData.waliCity?.trim()) errors.waliCity = "Required";
    } else if (i === 1) {
      if (!formData.memberName?.trim()) errors.memberName = "Required";
      if (!formData.memberId?.trim()) errors.memberId = "Required";
      if (!formData.waliRelSelf) errors.waliRelSelf = "Required";
    } else if (i === 2) {
      if (!formData.waliCnicSelf?.trim()) {
        errors.waliCnicSelf = "Required";
      } else if (formData.waliCnicSelf.length !== 13) {
        errors.waliCnicSelf = "Must be exactly 13 digits";
      }
      if (!formData.waliPhotoSelf) errors.waliPhotoSelf = "Required";
      if (!formData.cnicFront) errors.cnicFront = "Required";
      if (!formData.cnicBack) errors.cnicBack = "Required";
      if (!formData.selfie) errors.selfie = "Required";
    }
  }

  const isValid = Object.keys(errors).length === 0;

  const next = () => {
    if (isValid && i < steps.length - 1) setI(i + 1);
  };

  const prev = () => {
    if (i > 0) setI(i - 1);
  };

  const finish = () => {
    if (!isValid) return;

    const emailToVerify = role === "wali" ? formData.waliEmailSelf : (formData.email || "user@misaq.app");

    if (role === "wali") {
      const payload = { role: "wali", formData };
      const otp = setPendingVerification(emailToVerify, payload);
      setTargetEmail(emailToVerify);
      setGeneratedOTP(otp);
      setPendingPayload(payload);
      setPendingVerificationOpen(true);
    } else {
      const newMe: Person = {
        id: "me",
        name: formData.fullName,
        age: 26,
        city: formData.city,
        country: formData.country,
        profession: formData.profession || "Software Engineer",
        education: formData.education || "Bachelor's",
        height: formData.height || "5'8\"",
        sect: formData.sect || "Barelvi",
        compatibility: 98,
        verified: false,
        photo:
          formData.selfie ||
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
        avatar: "linear-gradient(135deg,#8A1A2B,#C9A24C)",
        bio: `Seeking a partner who values deen and family. Striving to build a home rooted in taqwa.`,
        prayer: formData.prayer || "Always",
        quran: formData.quran || "Daily",
        hijab: formData.hijab || undefined,
        beard: formData.beard || undefined,
        gender: formData.gender || "male",
        premium: false,

        // Production Workflow Fields
        verificationStatus: "Pending Email Verification",
        cnicNumber: formData.waliCnic || "35201-1234567-8",
        cnicFront: formData.cnicFront,
        cnicBack: formData.cnicBack,
        selfie: formData.selfie,
        waliPhoto: formData.waliPhoto,
        waliName: formData.waliName || "Abdullah Raza",
        waliRelationship: formData.waliRel || "Father",
        waliPhone: formData.waliPhone || "+92 300 1234567",
        waliEmail: formData.waliEmail || "wali@gmail.com",
        registrationDate: new Date().toLocaleDateString(),
        monthlyIncome: formData.income || "150k – 300k",
        religiousPractice: formData.knowledge || "Intermediate",
        religiousEnvironment: formData.environment || "Moderate",
        religion: formData.religion || "Islam",
        maritalStatus: "Never Married",
        children: "No Children",
        familyType: formData.familyType || "Nuclear",
        hobbies: ["Reading", "Islamic Lectures"],
        interests: ["Hiking", "Charity"],
        gallery: [
          formData.selfie ||
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
        ],
        photoPrivacy: formData.photoPrivacy || "Public",
      };

      const otp = setPendingVerification(emailToVerify, newMe);
      setTargetEmail(emailToVerify);
      setGeneratedOTP(otp);
      setPendingPayload(newMe);
      setPendingVerificationOpen(true);
    }
  };

  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyEmailOTP(targetEmail, otpInput)) {
      toast.success("Email verified successfully! Account activated.");
      setPendingVerificationOpen(false);

      if (role === "wali") {
        navigate({ to: "/wali" });
      } else {
        const activatedUser = { ...pendingPayload, verificationStatus: "Submitted" as const };
        updateMe(activatedUser);
        updatePeople([activatedUser, ...peopleList]);
        navigate({ to: "/app" });
      }
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  return (
    <PhoneFrame>
      <TopBar
        title={role === "wali" ? t("reg.title.wali") : t("reg.title.member")}
        subtitle={`${t("reg.step")} ${i + 1} ${t("reg.of")} ${steps.length} — ${steps[i]}`}
      />
      <div className="px-6">
        <Progress current={i} total={steps.length} />
      </div>
      <div className="flex-1 px-6 pb-6 pt-4 overflow-y-auto">
        {role === "wali" ? (
          <WaliStep step={i} formData={formData} updateField={updateField} errors={errors} />
        ) : (
          <MemberStep
            step={i}
            gender={formData.gender}
            setGender={setGender}
            formData={formData}
            updateField={updateField}
            errors={errors}
          />
        )}

        {!isValid && (
          <p className="text-xs text-destructive font-semibold text-center mt-6">
            ⚠️ Complete all required fields to continue.
          </p>
        )}
      </div>
      <div
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
        className="sticky bottom-0 flex gap-3 border-t border-border bg-background/95 px-6 pt-4 backdrop-blur shrink-0"
      >
        {i > 0 && (
          <button
            type="button"
            onClick={prev}
            className="flex-1 rounded-full border border-border py-3 font-medium cursor-pointer hover:bg-muted/30"
          >
            {t("reg.back")}
          </button>
        )}
        {!isLast ? (
          <button
            type="button"
            onClick={next}
            disabled={!isValid}
            className={cn(
              "flex-[2] rounded-full py-3 font-medium text-primary-foreground transition-all cursor-pointer",
              isValid
                ? "bg-primary shadow-elegant"
                : "bg-muted text-muted-foreground/60 cursor-not-allowed opacity-70",
            )}
          >
            {t("reg.continue")}
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={!isValid}
            className={cn(
              "flex-[2] rounded-full py-3 font-medium text-primary-foreground transition-all cursor-pointer",
              isValid
                ? "bg-primary shadow-elegant"
                : "bg-muted text-muted-foreground/60 cursor-not-allowed opacity-70",
            )}
          >
            {t("reg.finish")}
          </button>
        )}
      </div>

      {/* Email Verification OTP Modal */}
      {pendingVerificationOpen && (
        <Dialog open={pendingVerificationOpen} onOpenChange={setPendingVerificationOpen}>
          <DialogContent className="max-w-[360px] rounded-3xl bg-background p-6 text-center">
            <DialogHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <DialogTitle className="font-display text-lg text-primary font-bold">
                Pending Email Verification
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Account registered! Please verify your email before activating. Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-foreground">{targetEmail}</span>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirmVerification} className="space-y-4 mt-2 text-left">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                  placeholder={`E.g. ${generatedOTP || "123456"}`}
                  className="w-full text-center font-mono text-lg tracking-widest rounded-2xl border border-input bg-surface py-3 outline-none focus:border-primary"
                  required
                />
                <p className="text-[10px] text-muted-foreground text-center mt-1">
                  Demo code: <span className="font-mono font-bold text-primary">{generatedOTP || "123456"}</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/95 transition-all cursor-pointer"
              >
                Verify Email & Activate Account
              </button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </PhoneFrame>
  );
}


function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mt-2 flex gap-1.5">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "h-1.5 flex-1 rounded-full transition-colors",
            idx <= current ? "bg-primary" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-left">
      <h2 className="font-display text-2xl">{title}</h2>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function TextInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  numbersOnly,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  numbersOnly?: boolean;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (numbersOnly) {
      val = val.replace(/\D/g, "");
    }
    onChange(val);
  };
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground flex justify-between">
        <span>{label}</span>
        {error && <span className="text-[10px] text-destructive font-semibold">{error}</span>}
      </span>
      <input
        value={value || ""}
        onChange={handleChange}
        placeholder={placeholder}
        dir="auto"
        className={cn(
          "w-full rounded-2xl border bg-surface px-4 py-3 text-sm outline-none focus:border-primary transition-all",
          error ? "border-destructive/60 focus:border-destructive" : "border-input",
        )}
      />
    </label>
  );
}

function Chips({
  label,
  options,
  multi = false,
  value,
  onChange,
  error,
}: {
  label: string;
  options: string[];
  multi?: boolean;
  value?: string[];
  onChange?: (next: string[]) => void;
  error?: string;
}) {
  const [internal, setInternal] = useState<string[]>([]);
  const sel = value ?? internal;
  const toggle = (o: string) => {
    const next = multi
      ? sel.includes(o)
        ? sel.filter((x) => x !== o)
        : [...sel, o]
      : sel[0] === o
        ? []
        : [o];
    if (onChange) onChange(next);
    else setInternal(next);
  };
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground flex justify-between">
        <span>{label}</span>
        {error && <span className="text-[10px] text-destructive font-semibold">{error}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => toggle(o)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              sel.includes(o)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface hover:border-primary/40",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function DocumentUpload({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  error?: string;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionSelect = (option: "camera" | "gallery") => {
    setShowOptions(false);
    if (option === "gallery") {
      fileInputRef?.click();
    } else {
      const mockCNICBase64 =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'><rect width='100%' height='100%' fill='%23e0e0e0'/><text x='50%' y='50%' font-family='sans-serif' font-size='14' fill='%23666' dominant-baseline='middle' text-anchor='middle'>📷 Mock CNIC / Selfie Photo</text></svg>";
      onChange(mockCNICBase64);
      toast.success(`Mock photo captured for: ${label}`);
    }
  };

  return (
    <div className="relative text-left space-y-1">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={(el) => setFileInputRef(el)}
        onChange={handleFileChange}
      />

      <div
        className={cn(
          "w-full aspect-[3/2] rounded-2xl border border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all bg-card",
          error
            ? "border-destructive bg-destructive/5"
            : value
              ? "border-primary/40 bg-primary/5"
              : "border-border hover:bg-muted/10",
        )}
      >
        {value ? (
          <div className="w-full h-full relative group">
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-200">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="w-16 rounded-full bg-white/20 hover:bg-white/30 text-[9px] font-bold text-white py-1 transition-all cursor-pointer border border-white/10"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => setShowOptions(true)}
                className="w-16 rounded-full bg-primary hover:bg-primary/90 text-[9px] font-bold text-white py-1 transition-all cursor-pointer"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="w-16 rounded-full bg-destructive hover:bg-destructive/90 text-[9px] font-bold text-white py-1 transition-all cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowOptions(true)}
            className="w-full h-full flex flex-col items-center justify-center p-3 cursor-pointer"
          >
            <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Plus className="h-3.5 w-3.5" />
            </div>
            <p className="truncate text-[10px] font-semibold text-foreground">{label}</p>
            <p className="truncate text-[8px] text-muted-foreground">Tap to upload</p>
          </button>
        )}
      </div>
      {error && <p className="text-[9px] text-destructive font-medium mt-0.5">{error}</p>}

      {showOptions && (
        <Dialog open={showOptions} onOpenChange={setShowOptions}>
          <DialogContent className="max-w-[280px] rounded-3xl bg-background p-5 text-center">
            <DialogHeader>
              <DialogTitle className="font-display text-sm font-semibold text-primary mb-2 text-center">
                Upload {label}
              </DialogTitle>
              <DialogDescription className="text-[10px] text-muted-foreground text-center">
                Select how you want to upload the photo.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <button
                type="button"
                onClick={() => handleOptionSelect("camera")}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border py-2.5 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors"
              >
                📷 Take Photo
              </button>
              <button
                type="button"
                onClick={() => handleOptionSelect("gallery")}
                className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border py-2.5 text-xs font-semibold cursor-pointer hover:bg-muted transition-colors"
              >
                📁 Choose from Gallery
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowOptions(false)}
              className="mt-3 text-xs text-muted-foreground hover:underline cursor-pointer"
            >
              Cancel
            </button>
          </DialogContent>
        </Dialog>
      )}

      {previewOpen && (
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-[320px] rounded-3xl bg-background p-4 text-center">
            <DialogHeader>
              <DialogTitle className="font-display text-sm font-semibold text-primary text-center mb-2 animate-fade-in">
                Preview: {label}
              </DialogTitle>
            </DialogHeader>
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card">
              <img src={value} alt={label} className="w-full h-full object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="mt-4 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/95 transition-all cursor-pointer"
            >
              Close Preview
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function MemberStep({
  step,
  gender,
  setGender,
  formData,
  updateField,
  errors,
}: {
  step: number;
  gender: Gender;
  setGender: (g: Gender) => void;
  formData: any;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}) {
  const t = useT();
  const male = t("reg.o.male") || "Male";
  const female = t("reg.o.female") || "Female";

  if (step === 0)
    return (
      <Section title={t("reg.sec.personal")} hint={t("reg.sec.personalHint")}>
        <TextInput
          label={t("reg.l.fullName")}
          placeholder={t("reg.ph.name")}
          value={formData.fullName}
          onChange={(v) => updateField("fullName", v)}
          error={errors.fullName}
        />
        <TextInput
          label="Email Address (Required for Verification)"
          placeholder="e.g. user@gmail.com"
          value={formData.email}
          onChange={(v) => updateField("email", v)}
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label={t("reg.l.dob")}
            placeholder={t("reg.ph.dob")}
            value={formData.dob}
            onChange={(v) => updateField("dob", v)}
            error={errors.dob}
          />
          <TextInput
            label={t("reg.l.height")}
            placeholder={t("reg.ph.height")}
            value={formData.height}
            onChange={(v) => updateField("height", v)}
            error={errors.height}
          />
        </div>
        <Chips
          label={t("reg.l.gender")}
          options={[male, female]}
          value={gender === "male" ? [male] : gender === "female" ? [female] : []}
          onChange={(next) => {
            const v = next[0];
            setGender(v === male ? "male" : v === female ? "female" : null);
          }}
          error={errors.gender}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label={t("reg.l.country")}
            placeholder={t("reg.ph.country")}
            value={formData.country}
            onChange={(v) => updateField("country", v)}
            error={errors.country}
          />
          <TextInput
            label={t("reg.l.city")}
            placeholder={t("reg.ph.city")}
            value={formData.city}
            onChange={(v) => updateField("city", v)}
            error={errors.city}
          />
        </div>
        <Chips
          label={t("reg.l.nationality")}
          options={[
            t("reg.o.nat.pk"),
            t("reg.o.nat.in"),
            t("reg.o.nat.uk"),
            t("reg.o.nat.us"),
            t("reg.o.nat.ae"),
            t("reg.o.nat.other"),
          ]}
          value={formData.nationality ? [formData.nationality] : []}
          onChange={(next) => updateField("nationality", next[0] || "")}
          error={errors.nationality}
        />
      </Section>
    );

  if (step === 1)
    return (
      <Section title={t("reg.sec.eduProf")}>
        <Chips
          label={t("reg.l.education")}
          options={[
            t("reg.o.ed.matric"),
            t("reg.o.ed.inter"),
            t("reg.o.ed.diploma"),
            t("reg.o.ed.bach"),
            t("reg.o.ed.mast"),
            t("reg.o.ed.mphil"),
            t("reg.o.ed.phd"),
          ]}
          value={formData.education ? [formData.education] : []}
          onChange={(next) => updateField("education", next[0] || "")}
          error={errors.education}
        />
        <Chips
          label={t("reg.l.profession")}
          options={[
            t("reg.o.pr.student"),
            t("reg.o.pr.teacher"),
            t("reg.o.pr.doctor"),
            t("reg.o.pr.engineer"),
            t("reg.o.pr.business"),
            t("reg.o.pr.govt"),
            t("reg.o.pr.private"),
            t("reg.o.pr.freelance"),
            t("common.other"),
          ]}
          value={formData.profession ? [formData.profession] : []}
          onChange={(next) => updateField("profession", next[0] || "")}
          error={errors.profession}
        />
        <Chips
          label={t("reg.l.income")}
          options={[
            t("reg.o.inc.a"),
            t("reg.o.inc.b"),
            t("reg.o.inc.c"),
            t("reg.o.inc.d"),
            t("reg.o.inc.e"),
          ]}
          value={formData.income ? [formData.income] : []}
          onChange={(next) => updateField("income", next[0] || "")}
          error={errors.income}
        />
      </Section>
    );

  if (step === 2)
    return (
      <Section title="Religious Information" hint="Please complete all religious details.">
        <Chips
          label="Maslak / Sect"
          options={["Barelvi", "Deobandi (Hayati)", "Deobandi (Mamati)", "Ahle Hadith / Salafi"]}
          value={formData.sect ? [formData.sect] : []}
          onChange={(next) => updateField("sect", next[0] || "")}
          error={errors.sect}
        />
        <Chips
          label={gender === "male" ? "Prayer in Masjid" : "Prayer"}
          options={["5 Times Daily", "Usually", "Sometimes", "Rarely", "Prefer not to say"]}
          value={formData.prayer ? [formData.prayer] : []}
          onChange={(next) => updateField("prayer", next[0] || "")}
          error={errors.prayer}
        />
        <Chips
          label="Quran Reading"
          options={["Daily", "Weekly", "Occasionally", "Rarely"]}
          value={formData.quran ? [formData.quran] : []}
          onChange={(next) => updateField("quran", next[0] || "")}
          error={errors.quran}
        />
        <Chips
          label="Islamic Knowledge"
          options={["Beginner", "Intermediate", "Advanced", "Scholar"]}
          value={formData.knowledge ? [formData.knowledge] : []}
          onChange={(next) => updateField("knowledge", next[0] || "")}
          error={errors.knowledge}
        />
        {gender === "male" && (
          <Chips
            label="Beard"
            options={["Sunnah Beard", "Short Beard", "Clean Shaven"]}
            value={formData.beard ? [formData.beard] : []}
            onChange={(next) => updateField("beard", next[0] || "")}
            error={errors.beard}
          />
        )}
        {gender === "female" && (
          <Chips
            label="Hijab / Niqab"
            options={["Niqab", "Hijab", "Modest Dress", "Prefer not to say"]}
            value={formData.hijab ? [formData.hijab] : []}
            onChange={(next) => updateField("hijab", next[0] || "")}
            error={errors.hijab}
          />
        )}
        <Chips
          label={t("reg.l.dress")}
          options={[
            t("reg.o.dr.modern"),
            t("reg.o.dr.modest"),
            t("reg.o.dr.trad"),
            t("reg.o.dr.sunnah"),
          ]}
          value={formData.dress ? [formData.dress] : []}
          onChange={(next) => updateField("dress", next[0] || "")}
          error={errors.dress}
        />
        <Chips
          label="Religious Environment"
          options={["Very Religious", "Religious", "Moderate", "Learning"]}
          value={formData.environment ? [formData.environment] : []}
          onChange={(next) => updateField("environment", next[0] || "")}
          error={errors.environment}
        />
        <Chips
          label={t("reg.l.goals")}
          multi
          options={[
            t("reg.o.g.hajj"),
            t("reg.o.g.umrah"),
            t("reg.o.g.hifz"),
            t("reg.o.g.ed"),
            t("reg.o.g.family"),
          ]}
          value={formData.goals}
          onChange={(next) => updateField("goals", next)}
          error={errors.goals}
        />
      </Section>
    );

  if (step === 3)
    return (
      <Section title={t("reg.sec.dowry")} hint={t("reg.sec.dowryHint")}>
        {gender === null && (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
            {t("reg.dowry.needGender")}
          </p>
        )}
        {gender === "male" && (
          <Chips
            label={t("reg.l.forGroom")}
            options={[t("reg.o.dw.mAccept"), t("reg.o.dw.mNo"), t("reg.o.dw.mDont")]}
            value={formData.dowry ? [formData.dowry] : []}
            onChange={(next) => updateField("dowry", next[0] || "")}
            error={errors.dowry}
          />
        )}
        {gender === "female" && (
          <Chips
            label={t("reg.l.forBride")}
            options={[t("reg.o.dw.fGive"), t("reg.o.dw.fNo"), t("reg.o.dw.fPref")]}
            value={formData.dowry ? [formData.dowry] : []}
            onChange={(next) => updateField("dowry", next[0] || "")}
            error={errors.dowry}
          />
        )}
      </Section>
    );

  if (step === 4)
    return (
      <Section title={t("reg.sec.family")}>
        <Chips
          label={t("reg.l.fatherAlive")}
          options={[t("common.yes"), t("common.no")]}
          value={formData.fatherAlive ? [formData.fatherAlive] : []}
          onChange={(next) => updateField("fatherAlive", next[0] || "")}
          error={errors.fatherAlive}
        />
        <Chips
          label={t("reg.l.motherAlive")}
          options={[t("common.yes"), t("common.no")]}
          value={formData.motherAlive ? [formData.motherAlive] : []}
          onChange={(next) => updateField("motherAlive", next[0] || "")}
          error={errors.motherAlive}
        />
        <Chips
          label={t("reg.l.familyType")}
          options={[t("reg.o.ft.joint"), t("reg.o.ft.sep")]}
          value={formData.familyType ? [formData.familyType] : []}
          onChange={(next) => updateField("familyType", next[0] || "")}
          error={errors.familyType}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label={t("reg.l.brothers")}
            placeholder={t("reg.ph.zero")}
            value={formData.brothers}
            onChange={(v) => updateField("brothers", v)}
            error={errors.brothers}
            numbersOnly
          />
          <TextInput
            label={t("reg.l.sisters")}
            placeholder={t("reg.ph.zero")}
            value={formData.sisters}
            onChange={(v) => updateField("sisters", v)}
            error={errors.sisters}
            numbersOnly
          />
        </div>
      </Section>
    );

  return (
    <Section title={t("reg.sec.waliInfo")} hint={t("reg.sec.waliInfoHint")}>
      <TextInput
        label={t("reg.l.waliName")}
        value={formData.waliName}
        onChange={(v) => updateField("waliName", v)}
        error={errors.waliName}
      />
      <Chips
        label={t("reg.l.rel")}
        options={[
          t("reg.o.rel.father"),
          t("reg.o.rel.mother"),
          t("reg.o.rel.brother"),
          t("reg.o.rel.sister"),
          t("reg.o.rel.uncle"),
          t("reg.o.rel.aunt"),
          t("reg.o.rel.guardian"),
          t("common.other"),
        ]}
        value={formData.waliRel ? [formData.waliRel] : []}
        onChange={(next) => updateField("waliRel", next[0] || "")}
        error={errors.waliRel}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput
          label={t("reg.l.phone")}
          placeholder={t("reg.ph.phone")}
          value={formData.waliPhone}
          onChange={(v) => updateField("waliPhone", v)}
          error={errors.waliPhone}
          numbersOnly
        />
        <TextInput
          label={t("reg.l.whatsapp")}
          placeholder={t("reg.ph.phone")}
          value={formData.waliWhatsapp}
          onChange={(v) => updateField("waliWhatsapp", v)}
          error={errors.waliWhatsapp}
          numbersOnly
        />
      </div>
      <TextInput
        label={t("reg.l.email")}
        placeholder={t("reg.ph.emailWali")}
        value={formData.waliEmail}
        onChange={(v) => updateField("waliEmail", v)}
        error={errors.waliEmail}
      />
      <TextInput
        label={t("reg.l.cnic")}
        placeholder={t("reg.ph.cnic")}
        value={formData.waliCnic}
        onChange={(v) => updateField("waliCnic", v)}
        error={errors.waliCnic}
        numbersOnly
      />

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground text-left">
          Required Documents
        </p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <DocumentUpload
            label="Wali Photo"
            value={formData.waliPhoto}
            onChange={(val) => updateField("waliPhoto", val)}
            error={errors.waliPhoto}
          />
          <DocumentUpload
            label="Selfie Verification"
            value={formData.selfie}
            onChange={(val) => updateField("selfie", val)}
            error={errors.selfie}
          />
          <DocumentUpload
            label="CNIC Front"
            value={formData.cnicFront}
            onChange={(val) => updateField("cnicFront", val)}
            error={errors.cnicFront}
          />
          <DocumentUpload
            label="CNIC Back"
            value={formData.cnicBack}
            onChange={(val) => updateField("cnicBack", val)}
            error={errors.cnicBack}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Profile Photo Privacy
        </p>
        <p className="text-[10px] text-muted-foreground leading-normal">
          Control who can view your profile photo. You can change this anytime in your profile
          settings.
        </p>

        <div className="grid grid-cols-1 gap-2 mt-2">
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
              onClick={() => updateField("photoPrivacy", opt.key)}
              className={cn(
                "w-full rounded-2xl border p-3 text-left transition-all hover:bg-muted/30 cursor-pointer",
                (formData.photoPrivacy || "Public") === opt.key
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
    </Section>
  );
}

function WaliStep({
  step,
  formData,
  updateField,
  errors,
}: {
  step: number;
  formData: any;
  updateField: (field: string, value: any) => void;
  errors: Record<string, string>;
}) {
  const t = useT();

  if (step === 0)
    return (
      <Section title={t("reg.sec.aboutYou")}>
        <TextInput
          label={t("reg.l.fullName")}
          value={formData.waliFullName}
          onChange={(v) => updateField("waliFullName", v)}
          error={errors.waliFullName}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label={t("reg.l.phone")}
            placeholder={t("reg.ph.phone")}
            value={formData.waliPhoneSelf}
            onChange={(v) => updateField("waliPhoneSelf", v)}
            error={errors.waliPhoneSelf}
            numbersOnly
          />
          <TextInput
            label={t("reg.l.email")}
            placeholder={t("reg.ph.emailWali")}
            value={formData.waliEmailSelf}
            onChange={(v) => updateField("waliEmailSelf", v)}
            error={errors.waliEmailSelf}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label={t("reg.l.country")}
            placeholder={t("reg.ph.country")}
            value={formData.waliCountry}
            onChange={(v) => updateField("waliCountry", v)}
            error={errors.waliCountry}
          />
          <TextInput
            label={t("reg.l.city")}
            placeholder={t("reg.ph.city")}
            value={formData.waliCity}
            onChange={(v) => updateField("waliCity", v)}
            error={errors.waliCity}
          />
        </div>
      </Section>
    );

  if (step === 1)
    return (
      <Section title={t("reg.sec.linkedMember")} hint={t("reg.sec.linkedMemberHint")}>
        <TextInput
          label={t("reg.l.memberName")}
          value={formData.memberName}
          onChange={(v) => updateField("memberName", v)}
          error={errors.memberName}
        />
        <TextInput
          label={t("reg.l.memberId")}
          value={formData.memberId}
          onChange={(v) => updateField("memberId", v)}
          error={errors.memberId}
        />
        <Chips
          label={t("reg.l.rel")}
          options={[
            t("reg.o.rel.father"),
            t("reg.o.rel.mother"),
            t("reg.o.rel.brother"),
            t("reg.o.rel.sister"),
            t("reg.o.rel.uncle"),
            t("reg.o.rel.aunt"),
            t("reg.o.rel.guardian"),
            t("common.other"),
          ]}
          value={formData.waliRelSelf ? [formData.waliRelSelf] : []}
          onChange={(next) => updateField("waliRelSelf", next[0] || "")}
          error={errors.waliRelSelf}
        />
      </Section>
    );

  return (
    <Section title={t("reg.sec.verify")} hint={t("reg.sec.verifyHint")}>
      <TextInput
        label={t("reg.l.cnic")}
        placeholder={t("reg.ph.cnic")}
        value={formData.waliCnicSelf}
        onChange={(v) => updateField("waliCnicSelf", v)}
        error={errors.waliCnicSelf}
        numbersOnly
      />

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground text-left">
          Required Documents
        </p>
        <div className="grid grid-cols-2 gap-3 text-center">
          <DocumentUpload
            label="Wali Photo"
            value={formData.waliPhotoSelf}
            onChange={(val) => updateField("waliPhotoSelf", val)}
            error={errors.waliPhotoSelf}
          />
          <DocumentUpload
            label="Selfie Verification"
            value={formData.selfie}
            onChange={(val) => updateField("selfie", val)}
            error={errors.selfie}
          />
          <DocumentUpload
            label="CNIC Front"
            value={formData.cnicFront}
            onChange={(val) => updateField("cnicFront", val)}
            error={errors.cnicFront}
          />
          <DocumentUpload
            label="CNIC Back"
            value={formData.cnicBack}
            onChange={(val) => updateField("cnicBack", val)}
            error={errors.cnicBack}
          />
        </div>
      </div>
    </Section>
  );
}
