import { createFileRoute } from "@tanstack/react-router";
import { Phone, Video } from "lucide-react";

export const Route = createFileRoute("/admin/calls")({ component: AdminCalls });

const calls = [
  { p1: "Aisha R.", p2: "Ahmed R.", type: "video", dur: "18:24", when: "Now", wali: true },
  { p1: "Hamza S.", p2: "Fatima N.", type: "voice", dur: "06:12", when: "12m", wali: true },
  { p1: "Yusuf K.", p2: "Khadija M.", type: "video", dur: "22:41", when: "1h", wali: false },
];

function AdminCalls() {
  return (
    <div className="p-4 pb-8 space-y-2">
      {calls.map((c, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${c.type === "video" ? "bg-primary/10 text-primary" : "bg-gold/20 text-[color:var(--color-gold-foreground)]"}`}>
            {c.type === "video" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium">{c.p1} ↔ {c.p2}</p>
            <p className="text-[10px] text-muted-foreground">{c.type} · {c.dur} · {c.when}</p>
          </div>
          {c.wali ? <span className="text-[10px] text-primary">Wali present</span> : <span className="text-[10px] text-destructive">No Wali</span>}
        </div>
      ))}
    </div>
  );
}
