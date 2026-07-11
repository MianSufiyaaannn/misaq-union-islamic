import { ChevronLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  subtitle,
  right,
  back = true,
  transparent = false,
  tone = "default",
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  back?: boolean;
  transparent?: boolean;
  tone?: "default" | "light";
}) {
  const router = useRouter();
  return (
    <header
      style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      className={cn("sticky top-0 z-20 flex items-center gap-3 px-5 pb-3", !transparent && "border-b border-border bg-background/90 backdrop-blur", tone === "light" && "text-white")}
    >

      {back ? (
        <button
          onClick={() => router.history.back()}
          className={cn("flex h-9 w-9 items-center justify-center rounded-full border transition-colors", tone === "light" ? "border-white/25 text-white hover:bg-white/10" : "border-border hover:bg-muted")}
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : <span className="w-9" />}
      <div className="flex-1 min-w-0">
        {title && <h1 className="font-display text-lg leading-tight truncate">{title}</h1>}
        {subtitle && <p className={cn("text-[11px] truncate", tone === "light" ? "text-white/70" : "text-muted-foreground")}>{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}

export function Ornament({ children = "بِسْمِ ٱللَّٰهِ" }: { children?: ReactNode }) {
  return (
    <div className="ornament my-4 text-[11px] uppercase tracking-[0.25em]">
      <span>{children}</span>
    </div>
  );
}
