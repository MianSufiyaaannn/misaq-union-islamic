import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMisaq } from "@/components/misaq/providers";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Logo } from "@/components/misaq/logo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/onboarding/theme")({ component: ThemePick });

const langs = [
  { code: "en" as const, name: "English" },
  { code: "ur" as const, name: "Urdu" },
  { code: "ru" as const, name: "Roman Urdu" },
];

function ThemePick() {
  const { theme, setTheme, lang, setLang, t } = useMisaq();
  const navigate = useNavigate();
  const [isSwinging, setIsSwinging] = useState(false);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    setIsSwinging(true);
    // swing duration is 1.6s, reset after animation finishes
    setTimeout(() => setIsSwinging(false), 1600);
  };

  return (
    <PhoneFrame className="overflow-hidden">
      <motion.div
        animate={{
          backgroundColor: theme === "light" ? "#FCF8F2" : "#14080B",
          color: theme === "light" ? "#2E1416" : "#FDFBF7",
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="relative flex min-h-screen flex-col px-6 pb-10 pt-4 overflow-hidden"
      >
        {/* Background radial glow when Lamp is ON */}
        <AnimatePresence>
          {theme === "light" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-[-50px] left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full pointer-events-none z-0"
              style={{
                background:
                  "radial-gradient(circle, rgba(201, 162, 76, 0.28) 0%, rgba(252, 248, 242, 0) 70%)",
                filter: "blur(24px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* 1. Animated Hanging Lamp */}
        <div className="relative flex flex-col items-center justify-start h-[280px] z-10">
          {/* Hanging Cord */}
          <div className="absolute top-0 w-[2px] h-[70px] bg-[#C9A24C] origin-top" />

          {/* Lamp Body Container */}
          <div className="pt-[70px]">
            <motion.div
              onClick={toggleTheme}
              animate={
                isSwinging
                  ? {
                      rotate:
                        theme === "light" ? [0, -15, 12, -8, 4, -2, 0] : [0, 15, -12, 8, -4, 2, 0],
                    }
                  : { rotate: 0 }
              }
              transition={{
                duration: 1.6,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "top center" }}
              className="relative cursor-pointer select-none focus:outline-none flex flex-col items-center"
            >
              {/* Custom Ornate Islamic Lantern SVG */}
              <svg
                width="110"
                height="160"
                viewBox="0 0 110 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
              >
                {/* Top cap connection */}
                <path d="M45 0 H65 L60 10 H50 Z" fill="#C9A24C" />

                {/* Main lantern frame */}
                <path
                  d="M55 10 C30 20 25 65 35 85 C40 95 50 100 55 105 C60 100 70 95 75 85 C85 65 80 20 55 10 Z"
                  fill={theme === "light" ? "rgba(252, 248, 242, 0.95)" : "rgba(32, 22, 26, 0.45)"}
                  stroke="#C9A24C"
                  strokeWidth="2.5"
                  className="transition-colors duration-500"
                />

                {/* Ornate Star pattern (Islamic geometry vibe) */}
                <path
                  d="M55 45 L58 53 L66 53 L60 57 L62 65 L55 60 L48 65 L50 57 L44 53 L52 53 Z"
                  fill={theme === "light" ? "#C9A24C" : "#8A7E72"}
                  className="transition-colors duration-500"
                />

                {/* Bottom details (Ring & tassel) */}
                <circle cx="55" cy="108" r="3.5" fill="#C9A24C" />
                <path d="M55 111 V135" stroke="#C9A24C" strokeWidth="1.5" />
                <path d="M52 135 H58 L55 140 Z" fill="#C9A24C" />
              </svg>

              {/* Soft light glow centered inside the lamp */}
              {theme === "light" && (
                <motion.div
                  layoutId="lampInternalGlow"
                  className="absolute top-[35px] w-8 h-8 rounded-full bg-amber-200/50 blur-[6px] pointer-events-none"
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* 2. App Logo */}
        <div className="mt-auto flex flex-col items-center gap-6 z-10 pb-4">
          <Logo size={52} withWord tone={theme === "light" ? "default" : "light"} />

          <div className="w-full text-center px-4">
            <h2 className="font-display text-xl leading-tight">{t("theme.title")}</h2>
            <p className="mt-1.5 text-xs text-muted-foreground max-w-[280px] mx-auto">
              Tap the hanging lamp to toggle themes.
            </p>
          </div>

          {/* 3. English / Urdu / Roman Urdu selector */}
          <div className="w-full max-w-[320px] mt-2">
            <div className="relative flex rounded-full bg-muted/40 p-1 border border-border/40 backdrop-blur-sm">
              {langs.map((l) => {
                const active = lang === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    className={cn(
                      "relative flex-1 rounded-full py-2.5 text-center text-xs font-semibold transition-all cursor-pointer outline-none select-none",
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeLangIndicator"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Continue button */}
          <button
            onClick={() => navigate({ to: "/welcome" })}
            className="w-full rounded-full bg-primary py-4 font-medium text-primary-foreground shadow-elegant mt-4 hover:brightness-105 transition-all cursor-pointer"
          >
            {t("common.continue")}
          </button>
        </div>
      </motion.div>
    </PhoneFrame>
  );
}
