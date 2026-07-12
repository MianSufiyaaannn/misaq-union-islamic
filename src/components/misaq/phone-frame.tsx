import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * PhoneFrame: legacy wrapper — now renders children full-bleed as a real
 * responsive app (no device mockup, no simulator chrome).
 */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen w-full bg-background text-foreground", className)}>
      {children}
    </div>
  );
}

export function StatusBar(_: { tone?: "dark" | "light" }) {
  return null;
}
