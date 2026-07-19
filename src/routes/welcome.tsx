import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Logo } from "@/components/misaq/logo";
import { ShieldCheck, Users, HeartHandshake } from "lucide-react";
import { useT } from "@/components/misaq/providers";

import { useCmsConfig } from "@/lib/cms-config";

export const Route = createFileRoute("/welcome")({ component: Welcome });

function Welcome() {
  const t = useT();
  const [config] = useCmsConfig();
  const pillars = [
    { icon: ShieldCheck, title: t("welcome.pillar1.t"), desc: t("welcome.pillar1.d") },
    { icon: Users, title: t("welcome.pillar2.t"), desc: t("welcome.pillar2.d") },
    { icon: HeartHandshake, title: t("welcome.pillar3.t"), desc: t("welcome.pillar3.d") },
  ];
  return (
    <PhoneFrame>
      <div className="flex h-full flex-col overflow-y-auto scrollbar-none">
        <div
          style={{
            backgroundImage: config.heroBgImage ? `url(${config.heroBgImage})` : undefined,
          }}
          className="relative overflow-hidden bg-gradient-royal px-6 pb-8 pt-[calc(1.5rem+env(safe-area-inset-top))] text-white shrink-0 bg-cover bg-center"
        >
          <div className="absolute inset-0 bg-gradient-royal/85" />
          <div className="relative z-10">
            <Logo size={44} withWord tone="light" />
            <h1 className="mt-8 font-display text-4xl leading-tight">
              {config.welcomeScreenText || t("welcome.title")}
            </h1>
            <p className="mt-3 max-w-[300px] text-sm text-white/75">
              {config.appTagline || t("welcome.subtitle")}
            </p>
          </div>
        </div>

        <div className="flex-1 px-6 pt-6">
          <div className="ornament mb-4 text-[11px] uppercase tracking-[0.25em]">
            <span>بِسْمِ ٱللَّٰهِ</span>
          </div>
          <div className="grid gap-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg leading-none">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
          className="grid gap-3 px-6 pt-6 shrink-0"
        >
          <Link
            to="/auth/register"
            className="w-full rounded-full bg-primary py-4 text-center font-medium text-primary-foreground shadow-elegant"
          >
            {t("welcome.create")}
          </Link>
          <Link
            to="/auth/login"
            className="w-full rounded-full border border-border bg-card py-4 text-center font-medium text-foreground"
          >
            {t("welcome.have")}
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}
