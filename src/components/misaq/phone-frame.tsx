import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * PhoneFrame: renders a mobile viewport inside a phone chrome on desktop.
 * On small viewports it collapses to full-bleed.
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen w-full bg-gradient-cream text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[420px] items-stretch md:min-h-screen md:max-w-none md:items-center md:justify-center md:p-[max(env(safe-area-inset-top),1rem)]">
        <div
          className={cn(
            "relative flex w-full flex-col overflow-hidden bg-background",
            "min-h-screen md:min-h-0",
            "md:h-[min(90vh,900px)] md:aspect-[9/19.5] md:w-auto md:rounded-[48px] md:border-[10px] md:border-neutral-900 md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.35),0_20px_40px_-15px_rgba(0,0,0,0.2)]",
            className,
          )}
        >
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
