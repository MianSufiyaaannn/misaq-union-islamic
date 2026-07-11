import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";

export function CompatibilityRing({ value, size = 56, tone = "primary" }: { value: number; size?: number; tone?: "primary" | "gold" | "light" }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const colorClass = tone === "gold" ? "stroke-[color:var(--color-gold)]" : tone === "light" ? "stroke-white" : "stroke-primary";
  const trackClass = tone === "light" ? "stroke-white/25" : "stroke-border";
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} fill="none" className={trackClass} />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} className={cn(colorClass, "transition-all")} />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center font-display text-sm font-semibold", tone === "light" ? "text-white" : "text-foreground")}>{value}</span>
    </div>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  const t = useT();
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary", className)}>
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-primary"><path d="M12 2l2.09 2.26L17 4l1 2.83 2.83 1L20 10.5l1.83 2.83L19 15l-1 2.83-2.91-.26L12 20l-2.09-2.43L6 17.83 5 15l-2.83-1.67L4 10.5 2.17 7.83 5 6l1-2.83 2.91.26z"/></svg>
      {t("profile.verified")}
    </span>
  );
}

export function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-gold px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-gold-foreground)] shadow-gold">
      ✦ Premium
    </span>
  );
}

export function Avatar({ person, size = 56 }: { person: { photo?: string; avatar: string; name: string }; size?: number }) {
  const initials = person.name.split(" ").map(n => n[0]).slice(0,2).join("");
  const [err, setErr] = useState(false);
  const showImage = person.photo && !err;
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display text-white shadow-soft"
      style={{ width: size, height: size, background: person.avatar, fontSize: size * 0.36 }}
      aria-label={person.name}
    >
      {showImage ? (
        <img
          src={person.photo}
          alt={person.name}
          loading="lazy"
          width={size}
          height={size}
          onError={() => setErr(true)}
          className="h-full w-full object-cover"
        />
      ) : initials}
    </div>
  );
}

export function PhotoBg({ person, className, children }: { person: { photo?: string; avatar: string; name: string }; className?: string; children?: React.ReactNode }) {
  const [err, setErr] = useState(false);
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: person.avatar }}>
      {person.photo && !err && (
        <img
          src={person.photo}
          alt={person.name}
          loading="lazy"
          onError={() => setErr(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {children}
    </div>
  );
}
