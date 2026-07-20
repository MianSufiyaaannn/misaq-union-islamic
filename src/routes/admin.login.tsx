import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { ShieldAlert, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { Logo } from "@/components/misaq/logo";
import { setAdminAuth, isAdminAuthed, clearAdminAuth } from "@/lib/admin-auth";

import { validateRealEmail } from "@/lib/email-validator";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const t = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If somehow reached while already authed, go straight to the dashboard.
  useEffect(() => {
    if (isAdminAuthed()) navigate({ to: "/admin", replace: true });
  }, [navigate]);

  const canSubmit = email.trim().length > 0 && pw.trim().length > 0 && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!canSubmit) {
      setError(t("admin.login.error") || "Please enter your email and password.");
      return;
    }
    const valRes = validateRealEmail(email);
    if (!valRes.valid) {
      setError(valRes.error || "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulated authentication delay
    window.setTimeout(() => {
      const role = email.toLowerCase().includes("super") ? "super" : "normal";
      setAdminAuth(role);
      setLoading(false);
      navigate({ to: "/admin", replace: true });
    }, 700);
  };

  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-1 flex-col bg-background">
        <div className="flex items-center justify-between px-4 pt-4">
          <Link
            to="/auth/login"
            aria-label={t("common.back")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Link>
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-gold-foreground)]">
            {t("admin.super")}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-10 pt-6">
          <div className="flex flex-col items-center gap-3 pt-2">
            <Logo size={64} />
            <div className="text-center">
              <h1 className="font-display text-2xl text-primary">{t("admin.login.title")}</h1>
              <p className="mt-1 text-xs text-muted-foreground">{t("admin.login.subtitle")}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-[color:var(--color-gold-foreground)]">
            <ShieldAlert className="h-5 w-5 shrink-0 text-gold" />
            <p className="text-xs">{t("admin.login.notice")}</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Field
              label={t("admin.login.email")}
              icon={<Mail className="h-4 w-4" />}
              type="email"
              autoComplete="email"
              placeholder={t("admin.login.emailPh")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label={t("admin.login.pw")}
              icon={<Lock className="h-4 w-4" />}
              type="password"
              autoComplete="current-password"
              placeholder={t("admin.login.pwPh")}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <Field
              label={`${t("admin.login.otp")} · ${t("common.optional")}`}
              icon={<ShieldAlert className="h-4 w-4" />}
              inputMode="numeric"
              placeholder={t("admin.login.otpPh")}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {error && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end">
              <button type="button" className="text-xs text-muted-foreground hover:text-primary">
                {t("auth.login.forgot")}
              </button>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-medium text-primary-foreground shadow-elegant transition-opacity disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("admin.login.enter")}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              clearAdminAuth();
              navigate({ to: "/auth/login" });
            }}
            className="mt-auto pt-10 text-center text-xs text-muted-foreground hover:text-primary focus:text-primary active:text-primary/80 transition-colors focus:outline-none cursor-pointer"
          >
            {t("admin.login.back")}
          </button>
        </div>
      </div>
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
