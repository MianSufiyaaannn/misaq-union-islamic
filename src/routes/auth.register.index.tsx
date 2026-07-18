import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { TopBar } from "@/components/misaq/top-bar";
import { Heart, ShieldCheck } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { Logo } from "@/components/misaq/logo";

export const Route = createFileRoute("/auth/register/")({ component: Register });

function Register() {
  const t = useT();
  return (
    <PhoneFrame>
      <TopBar back={false} />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-10">
        <Logo size={40} withWord />
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">{t("auth.reg.hint")}</p>
        </div>

        <Link
          to="/auth/register/steps"
          search={{ role: "member" }}
          className="group flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary hover:shadow-elegant"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-white">
            <Heart className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xl">{t("auth.reg.member.t")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("auth.reg.member.d")}</p>
          </div>
        </Link>

        <Link
          to="/auth/register/steps"
          search={{ role: "wali" }}
          className="group flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary hover:shadow-elegant"
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-[color:var(--color-gold-foreground)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xl">{t("auth.reg.wali.t")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("auth.reg.wali.d")}</p>
          </div>
        </Link>

        <div className="mt-6 rounded-2xl bg-primary/5 p-4 text-xs text-muted-foreground">
          {t("auth.reg.adminNote")}
        </div>

        <p className="mt-auto text-center text-sm text-muted-foreground">
          {t("auth.reg.already")}{" "}
          <Link to="/auth/login" className="font-medium text-primary">
            {t("auth.reg.signin")}
          </Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
