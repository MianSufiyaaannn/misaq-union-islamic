import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import { usePeople, type Person } from "@/lib/mock";
import { AdminProfileModal } from "@/components/misaq/admin-profile-modal";
import { Eye, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/walis")({ component: AdminWalis });

const initialWalis = [
  { n: "Abdullah Rahman", w: "Aisha Rahman", relKey: "reg.o.rel.father", v: true },
  { n: "Ismail Siddiqui", w: "Hamza Siddiqui", relKey: "reg.o.rel.father", v: true },
  { n: "Amina Iqbal", w: "Maryam Iqbal", relKey: "reg.o.rel.mother", v: true },
  { n: "Omar Khan", w: "Yusuf Khan", relKey: "reg.o.rel.brother", v: false },
];

function AdminWalis() {
  const t = useT();
  const [people] = usePeople();
  const [selectedMember, setSelectedMember] = useState<Person | null>(null);

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

  const handleInspectWaliMember = (w: typeof initialWalis[0]) => {
    const match = people.find((p) => p.name.toLowerCase().includes(w.w.toLowerCase())) || people[0];
    setSelectedMember(match);
  };

  return (
    <div className="p-4 pb-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {waliList.map((w, i) => (
            <li
              key={i}
              onClick={() => handleInspectWaliMember(w)}
              className="flex items-center gap-3 px-3.5 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-royal font-display text-white text-sm shadow-sm">
                {w.n
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">{w.n}</p>
                <p className="truncate text-[10px] text-muted-foreground mt-0.5">
                  {t("admin.walis.of")} {w.w} · {t(w.relKey)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleWaliVerify(i);
                }}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold cursor-pointer transition-colors ${w.v ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"}`}
              >
                {w.v ? t("common.verified") : t("common.pending")}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInspectWaliMember(w);
                }}
                className="shrink-0 text-muted-foreground p-1 hover:bg-muted rounded-full cursor-pointer"
                aria-label="Inspect profile"
              >
                <Eye className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AdminProfileModal
        person={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />
    </div>
  );
}

