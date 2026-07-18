import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/misaq/logo";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/")({ component: Splash });

function Splash() {
  const navigate = useNavigate();
  const t = useT();
  useEffect(() => {
    const tm = setTimeout(() => navigate({ to: "/onboarding/theme" }), 2200);
    return () => clearTimeout(tm);
  }, [navigate]);

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-royal text-white"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 60%, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }}
      />
      <div className="relative flex flex-col items-center gap-8 animate-fade-up">
        <div className="relative">
          <div className="absolute inset-0 rounded-full animate-pulse-ring" />
          <div className="rounded-full bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/20">
            <Logo size={96} />
          </div>
        </div>
        <div className="text-center">
          <h1 className="font-display text-5xl tracking-wide">Misaq</h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.4em] text-white/70">مِیثاق</p>
          <p className="mt-4 max-w-[280px] font-display text-sm italic text-white/80" dir="auto">
            {t("splash.tagline")}
          </p>
        </div>
        <Link
          to="/onboarding/theme"
          className="mt-6 text-xs uppercase tracking-[0.3em] text-white/70 underline underline-offset-4"
        >
          {t("splash.skip")}
        </Link>
      </div>
    </div>
  );
}
