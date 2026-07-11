import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { Avatar } from "@/components/misaq/bits";
import { findPerson } from "@/lib/mock";
import { Heart, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/notifications")({ component: Notifications });

const items = [
  { icon: Heart, tint: "primary", personId: "aisha", title: "New proposal received", desc: "Aisha's family sent a proposal.", time: "Just now" },
  { icon: MessageCircle, tint: "gold", personId: "hamza", title: "New message", desc: "\"Jazak Allah khair for the proposal.\"", time: "1h" },
  { icon: ShieldCheck, tint: "primary", personId: "maryam", title: "Wali confirmed", desc: "Your Wali approved conversation with Maryam.", time: "3h" },
  { icon: Sparkles, tint: "gold", personId: "khadija", title: "Highly compatible", desc: "96% compatibility with Khadija Malik.", time: "Yesterday" },
];

function Notifications() {
  return (
    <div className="pb-8">
      <TopBar title="Notifications" />
      <ul className="divide-y divide-border">
        {items.map((n, i) => {
          const p = findPerson(n.personId);
          return (
            <li key={i} className="flex items-start gap-3 px-5 py-4">
              <div className="relative">
                <Avatar person={p} size={44} />
                <span className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-white ${n.tint === "gold" ? "bg-gradient-gold" : "bg-gradient-primary"}`}>
                  <n.icon className="h-3 w-3" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{n.time}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
