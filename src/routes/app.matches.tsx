import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { proposals } from "@/lib/mock";
import { Avatar, CompatibilityRing, VerifiedBadge } from "@/components/misaq/bits";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";
import { Inbox } from "lucide-react";

export const Route = createFileRoute("/app/matches")({ component: Matches });

type TabKey = "received" | "sent" | "accepted";

function Matches() {
  const t = useT();
  const [tab, setTab] = useState<TabKey>("received");
  const list = tab === "received" ? proposals.received : tab === "sent" ? proposals.sent : proposals.accepted;
  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "received", label: t("matches.received") },
    { key: "sent", label: t("matches.sent") },
    { key: "accepted", label: t("matches.accepted") },
  ];
  return (
    <div className="pb-8">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 pb-3 pt-14 backdrop-blur">
        <h1 className="font-display text-2xl">{t("matches.title")}</h1>
        <div className="mt-3 flex gap-1 rounded-full bg-muted p-1">
          {tabs.map((it) => (
            <button key={it.key} onClick={() => setTab(it.key)} className={cn("flex-1 rounded-full py-2 text-xs font-medium transition-all", tab === it.key ? "bg-background text-foreground shadow-soft" : "text-muted-foreground")}>{it.label}</button>
          ))}
        </div>
      </header>
      {list.length === 0 ? (
        <EmptyState label={t("matches.empty")} />
      ) : (
        <div className="space-y-2 p-4">
          {list.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <Avatar person={p} size={56} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="truncate font-display text-base leading-none">{p.name}</p>
                  {p.verified && <VerifiedBadge />}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">{p.age} • {p.city} • {p.profession}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link to="/app/profile/$id" params={{ id: p.id }} className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">{t("matches.view")}</Link>
                  {tab === "received" && (
                    <>
                      <button className="rounded-full border border-border px-3 py-1 text-[11px]">{t("matches.accept")}</button>
                      <button className="rounded-full border border-border px-3 py-1 text-[11px] text-destructive">{t("matches.decline")}</button>
                    </>
                  )}
                  {tab === "accepted" && <Link to="/app/chats" className="rounded-full border border-border px-3 py-1 text-[11px]">{t("matches.openChat")}</Link>}
                </div>
              </div>
              <CompatibilityRing value={p.compatibility} size={44} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted"><Inbox className="h-6 w-6" /></div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
