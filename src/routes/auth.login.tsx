import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Logo } from "@/components/misaq/logo";
import { TopBar } from "@/components/misaq/top-bar";
import { Mail, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useCmsConfig } from "@/lib/cms-config";
import {
  validateRealEmail,
  isEmailVerified,
  setPendingVerification,
  verifyEmailOTP,
} from "@/lib/email-validator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const t = useT();
  const navigate = useNavigate();
  const [config] = useCmsConfig();

  const [email, setEmail] = useState("ahmed.raza@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [emailError, setEmailError] = useState("");

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    // 1. Email Format & Domain & Temporary Email Validation
    const validation = validateRealEmail(email);
    if (!validation.valid) {
      setEmailError(validation.error || "Invalid email address");
      toast.error(validation.error || "Invalid email address");
      return;
    }

    // 2. Check if Email is Verified
    if (!isEmailVerified(email)) {
      toast.error("Please verify your email before logging in.");
      setEmailError("Please verify your email before logging in.");

      // Generate verification OTP and prompt user
      const otp = setPendingVerification(email);
      setGeneratedOTP(otp);
      setVerifyModalOpen(true);
      return;
    }

    // 3. Successful Authentication
    toast.success("Welcome back to Misaq!");
    navigate({ to: "/app" });
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyEmailOTP(email, otpInput)) {
      toast.success("Email verified successfully! Account activated.");
      setVerifyModalOpen(false);
      setEmailError("");
      navigate({ to: "/app" });
    } else {
      toast.error("Invalid verification code. Please try again.");
    }
  };

  return (
    <PhoneFrame>
      <TopBar back={false} />
      <div
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        className="flex-1 overflow-y-auto px-6 flex flex-col justify-between"
      >
        <Logo size={40} withWord />
        <div className="mt-8">
          <h1 className="font-display text-3xl">{t("auth.login.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {config.loginScreenText || t("auth.login.subtitle")}
          </p>
        </div>

        <form className="mt-6 space-y-4 text-left" onSubmit={handleLoginSubmit}>
          <div>
            <Field
              label={t("auth.login.email")}
              icon={<Mail className="h-4 w-4" />}
              placeholder={t("auth.login.emailPh")}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
              required
            />
            {emailError && (
              <p className="mt-1 text-xs font-semibold text-destructive">{emailError}</p>
            )}
          </div>

          <Field
            label={t("auth.login.password")}
            icon={<Lock className="h-4 w-4" />}
            placeholder={t("auth.login.passwordPh")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-[color:var(--primary)]" />{" "}
              {t("auth.login.remember")}
            </label>
            <a href="#" className="font-medium text-primary">
              {t("auth.login.forgot")}
            </a>
          </div>

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center rounded-full bg-primary py-4 font-semibold text-primary-foreground shadow-elegant hover:bg-primary/95 cursor-pointer transition-all"
          >
            {t("auth.login.signin")}
          </button>
        </form>

        <div className="my-6 ornament text-[10px] uppercase tracking-[0.3em]">
          <span>{t("auth.login.or")}</span>
        </div>

        <Link
          to="/wali"
          className="w-full rounded-full border border-border py-3 text-center text-sm font-medium hover:bg-muted/30"
        >
          {t("auth.login.wali")}
        </Link>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("auth.login.new")}{" "}
          <Link to="/auth/register" className="font-medium text-primary hover:underline">
            {t("auth.login.create")}
          </Link>
        </p>

        <Link
          to="/admin/login"
          className="mt-auto pt-8 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 hover:text-primary"
        >
          {t("auth.login.admin")}
        </Link>
      </div>

      {/* Email Verification Dialog */}
      {verifyModalOpen && (
        <Dialog open={verifyModalOpen} onOpenChange={setVerifyModalOpen}>
          <DialogContent className="max-w-[360px] rounded-3xl bg-background p-6 text-center">
            <DialogHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 mb-2">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <DialogTitle className="font-display text-lg text-primary font-bold">
                Pending Email Verification
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Please verify your email before logging in. Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-foreground">{email}</span>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleVerifyOTP} className="space-y-4 mt-2 text-left">
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
                className="w-full rounded-full bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/95 transition-all"
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

function Field({
  label,
  icon,
  ...rest
}: { label: string; icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex items-center gap-3 rounded-2xl border border-input bg-surface px-4 py-3 focus-within:border-primary">
        <span className="shrink-0 text-muted-foreground">{icon}</span>
        <input
          {...rest}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </span>
    </label>
  );
}
