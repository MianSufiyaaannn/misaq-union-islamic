import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/walis")({ component: AdminWalis });

const initialWalis = [
  { n: "Abdullah Rahman", w: "Aisha Rahman", relKey: "reg.o.rel.father", v: true },
  { n: "Ismail Siddiqui", w: "Hamza Siddiqui", relKey: "reg.o.rel.father", v: true },
  { n: "Amina Iqbal", w: "Maryam Iqbal", relKey: "reg.o.rel.mother", v: true },
  { n: "Omar Khan", w: "Yusuf Khan", relKey: "reg.o.rel.brother", v: false },
];

function AdminWalis() {
  const t = useT();
  const [waliList, setWaliList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("misaq_walis");
      return saved ? JSON.parse(saved) : initialWalis;
    }
    return initialWalis;
  });

  const handleToggleWaliVerify = (index: number) => {
    const next = waliList.map((w, idx) => {
      if (idx === index) {
        const nextState = !w.v;
        toast.success(`Wali ${w.n} is now ${nextState ? "Verified" : "Pending verification"}`);
        return { ...w, v: nextState };
      }
      return w;
    });
    setWaliList(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("misaq_walis", JSON.stringify(next));
    }
  };

  return (
    <div className="p-4 pb-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {waliList.map((w, i) => (
            <li
              key={i}
              className="flex items-center gap-3 px-3 py-3 hover:bg-muted/10 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-royal font-display text-white text-sm">
                {w.n
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{w.n}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {t("admin.walis.of")} {w.w} · {t(w.relKey)}
                </p>
              </div>
              <button
                onClick={() => handleToggleWaliVerify(i)}
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer transition-colors ${w.v ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary"}`}
              >
                {w.v ? t("common.verified") : t("common.pending")}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
