import logo from "@/assets/misaq-logo.png.asset.json";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export function Logo({
  size = 48,
  withWord = false,
  tone = "default",
}: {
  size?: number;
  withWord?: boolean;
  tone?: "default" | "light";
}) {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next >= 7) {
      const current = localStorage.getItem("misaq_dev_mode") === "true";
      localStorage.setItem("misaq_dev_mode", String(!current));
      toast.success(
        !current
          ? "Developer Mode Enabled! Matrimonial simulator unlocked."
          : "Developer Mode Disabled.",
      );
      setClicks(0);
      window.dispatchEvent(new Event("misaq_dev_mode_change"));
    }
  };

  return (
    <div className="flex items-center gap-3 cursor-pointer" onClick={handleClick}>
      <img
        src={logo.url}
        alt="Misaq"
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
      {withWord && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-2xl tracking-wide",
              tone === "light" ? "text-white" : "text-primary",
            )}
          >
            Misaq
          </span>
          <span
            className={cn(
              "text-[10px] uppercase tracking-[0.3em]",
              tone === "light" ? "text-white/70" : "text-muted-foreground",
            )}
          >
            مِیثاق
          </span>
        </div>
      )}
    </div>
  );
}
