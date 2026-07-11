import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { proposals } from "@/lib/mock";
import { Avatar, CompatibilityRing, VerifiedBadge } from "@/components/misaq/bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/matches")({ component: Matches });

const tabs = ["Received", "Sent", "Accepted"] as const;

function Matches() {
  const [t, setT] = useState<(typeof tabs)[number]>("Received");
  const list = t === "Received" ? proposals.received : t === "Sent" ? proposals.sent : proposals.accepted;
  return (
    <div className="pb-8">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 pb-3 pt-14 backdrop-blur">
        <h1 className="font-display text-2xl">Matches & proposals</h1>
        <div className="mt-3 flex gap-1 rounded-full bg-muted p-1">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setT(tab)} className={cn("flex-1 rounded-full py-2 text-xs font-medium transition-all", t === tab ? "bg-background text-foreground shadow-soft" : "text-muted-foreground")}>{tab}</button>
          ))}
        </div>
      </header>
      <div className="space-y-2 p-4">
        {list.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <Avatar person={p} size={56} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-display text-base leading-none">{p.name}</p>
                {p.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">{p.age} • {p.city} • {p.profession}</p>
              <div className="mt-2 flex gap-2">
                <Link to="/app/profile/$id" params={{ id: p.id }} className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">View</Link>
                {t === "Received" && (
                  <>
                    <button className="rounded-full border border-border px-3 py-1 text-[11px]">Accept</button>
                    <button className="rounded-full border border-border px-3 py-1 text-[11px] text-destructive">Decline</button>
                  </>
                )}
                {t === "Accepted" && <Link to="/app/chats" className="rounded-full border border-border px-3 py-1 text-[11px]">Open chat</Link>}
              </div>
            </div>
            <CompatibilityRing value={p.compatibility} size={44} />
          </div>
        ))}
      </div>
    </div>
  );
}
