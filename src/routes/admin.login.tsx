import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { TopBar } from "@/components/misaq/top-bar";
import { ShieldAlert, Lock, Mail } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const t = useT();
  return (
    <PhoneFrame>
      <TopBar title={t("admin.login.title")} subtitle={t("admin.login.subtitle")} />
      <div className="flex flex-1 flex-col px-6 pb-10 pt-4">
        <div className="flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-[color:var(--color-gold-foreground)]">
          <ShieldAlert className="h-5 w-5 shrink-0 text-gold" />
          <p className="text-xs">{t("admin.login.notice")}</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Field label={t("admin.login.email")} icon={<Mail className="h-4 w-4" />} type="email" placeholder={t("admin.login.emailPh")} />
          <Field label={t("admin.login.pw")} icon={<Lock className="h-4 w-4" />} type="password" placeholder={t("admin.login.pwPh")} />
          <Field label={t("admin.login.otp")} icon={<ShieldAlert className="h-4 w-4" />} placeholder={t("admin.login.otpPh")} />
          <Link to="/admin" className="mt-2 flex w-full items-center justify-center rounded-full bg-primary py-4 font-medium text-primary-foreground shadow-elegant">
            {t("admin.login.enter")}
          </Link>
        </form>

        <Link to="/auth/login" className="mt-auto pt-10 text-center text-xs text-muted-foreground">{t("admin.login.back")}</Link>
      </div>
    </PhoneFrame>
  );
}

function Field({ label, icon, ...rest }: { label: string; icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <span className="flex items-center gap-3 rounded-2xl border border-input bg-surface px-4 py-3 focus-within:border-primary">
        <span className="shrink-0 text-muted-foreground">{icon}</span>
        <input {...rest} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" />
      </span>
    </label>
  );
}
