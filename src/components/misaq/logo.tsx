import logo from "@/assets/misaq-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function Logo({ size = 48, withWord = false, tone = "default" }: { size?: number; withWord?: boolean; tone?: "default" | "light" }) {
  return (
    <div className="flex items-center gap-3">
      <img src={logo.url} alt="Misaq" width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
      {withWord && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display text-2xl tracking-wide", tone === "light" ? "text-white" : "text-primary")}>Misaq</span>
          <span className={cn("text-[10px] uppercase tracking-[0.3em]", tone === "light" ? "text-white/70" : "text-muted-foreground")}>مِیثاق</span>
        </div>
      )}
    </div>
  );
}
