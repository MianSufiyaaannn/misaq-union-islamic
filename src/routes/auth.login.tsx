import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Logo } from "@/components/misaq/logo";
import { TopBar } from "@/components/misaq/top-bar";
import { Mail, Lock } from "lucide-react";
import { useT } from "@/components/misaq/providers";

import { useCmsConfig } from "@/lib/cms-config";

export const Route = createFileRoute("/auth/login")({ component: Login });

function Login() {
  const t = useT();
  const [config] = useCmsConfig();
  return (
    <PhoneFrame>
      <TopBar back={false} />
      <div
        style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
        className="flex-1 overflow-y-auto px-6 flex flex-col justify-between"
      >
        <Logo size={40} withWord />
        <div className="mt-10">
          <h1 className="font-display text-3xl">{t("auth.login.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{config.loginScreenText || t("auth.login.subtitle")}</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Field
            label={t("auth.login.email")}
            icon={<Mail className="h-4 w-4" />}
            placeholder={t("auth.login.emailPh")}
            type="email"
          />
          <Field
            label={t("auth.login.password")}
            icon={<Lock className="h-4 w-4" />}
            placeholder={t("auth.login.passwordPh")}
            type="password"
          />
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="accent-[color:var(--primary)]" />{" "}
              {t("auth.login.remember")}
            </label>
            <a href="#" className="font-medium text-primary">
              {t("auth.login.forgot")}
            </a>
          </div>
          <Link
            to="/app"
            className="mt-2 flex w-full items-center justify-center rounded-full bg-primary py-4 font-medium text-primary-foreground shadow-elegant"
          >
            {t("auth.login.signin")}
          </Link>
        </form>

        <div className="my-6 ornament text-[10px] uppercase tracking-[0.3em]">
          <span>{t("auth.login.or")}</span>
        </div>

        <Link
          to="/wali"
          className="w-full rounded-full border border-border py-3 text-center text-sm font-medium"
        >
          {t("auth.login.wali")}
        </Link>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("auth.login.new")}{" "}
          <Link to="/auth/register" className="font-medium text-primary">
            {t("auth.login.create")}
          </Link>
        </p>

        <Link
          to="/admin/login"
          className="mt-auto pt-10 text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 hover:text-primary"
        >
          {t("auth.login.admin")}
        </Link>
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
