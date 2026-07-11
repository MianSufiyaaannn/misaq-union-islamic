import { createFileRoute } from "@tanstack/react-router";
import { Phone, Video } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/calls")({ component: AdminCalls });

const calls = [
  { p1: "Aisha R.", p2: "Ahmed R.", type: "video", dur: "18:24", when: "Now", wali: true },
  { p1: "Hamza S.", p2: "Fatima N.", type: "voice", dur: "06:12", when: "12m", wali: true },
  { p1: "Yusuf K.", p2: "Khadija M.", type: "video", dur: "22:41", when: "1h", wali: false },
];

function AdminCalls() {
  const t = useT();
  return (
    <div className="p-4 pb-8 space-y-2">
      {calls.map((c, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${c.type === "video" ? "bg-primary/10 text-primary" : "bg-gold/20 text-[color:var(--color-gold-foreground)]"}`}>
            {c.type === "video" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{c.p1} ↔ {c.p2}</p>
            <p className="truncate text-[10px] text-muted-foreground">{c.type === "video" ? t("call.video") : t("call.voice")} · {c.dur} · {c.when}</p>
          </div>
          {c.wali
            ? <span className="shrink-0 text-[10px] text-primary">{t("admin.calls.waliPresent")}</span>
            : <span className="shrink-0 text-[10px] text-destructive">{t("admin.calls.noWali")}</span>}
        </div>
      ))}
    </div>
  );
}
