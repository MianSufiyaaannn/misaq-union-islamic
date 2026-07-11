import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * PhoneFrame: renders a mobile viewport inside a phone chrome on desktop.
 * On small viewports it collapses to full-bleed.
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen w-full bg-gradient-cream text-foreground">
      {/* Desktop chrome */}
      <div className="mx-auto flex min-h-screen max-w-[420px] items-stretch md:min-h-0 md:max-w-none md:items-center md:justify-center md:py-10">
        <div
          className={cn(
            "relative flex w-full flex-col overflow-hidden bg-background",
            "min-h-screen md:min-h-0",
            "md:h-[860px] md:w-[400px] md:rounded-[46px] md:border md:border-border md:shadow-luxury",
            className,
          )}
        >
          {/* Notch on desktop only */}
          <div className="hidden md:absolute md:left-1/2 md:top-2 md:z-50 md:block md:h-6 md:w-32 md:-translate-x-1/2 md:rounded-full md:bg-black" />
          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-thin">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatusBar({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className={cn("flex h-6 items-center justify-between px-6 pt-1 text-[11px] font-medium md:pt-3", tone === "light" ? "text-white/90" : "text-foreground/80")}>
      <span>9:41</span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        <span className="ml-2">100%</span>
      </span>
    </div>
  );
}
