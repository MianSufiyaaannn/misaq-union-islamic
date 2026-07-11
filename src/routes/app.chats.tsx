import { createFileRoute, Link } from "@tanstack/react-router";
import { chats, findPerson } from "@/lib/mock";
import { Avatar, VerifiedBadge } from "@/components/misaq/bits";
import { Search, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/app/chats")({ component: Chats });

function Chats() {
  return (
    <div className="pb-8">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-6 pb-3 pt-14 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl">Chats</h1>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><Search className="h-4 w-4" /></button>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-primary/5 px-3 py-2 text-[11px] text-primary">
          <ShieldCheck className="h-3.5 w-3.5" /> Your Wali sees every conversation.
        </div>
      </header>
      <ul className="divide-y divide-border">
        {chats.map((c) => {
          const p = findPerson(c.personId);
          const last = c.messages[c.messages.length - 1];
          return (
            <li key={c.id}>
              <Link to="/app/chats/$id" params={{ id: c.id }} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50">
                <Avatar person={p} size={52} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{p.name}</p>
                      {p.verified && <span className="text-[color:var(--color-gold)]">✓</span>}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{c.lastAt}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{last?.text ?? (last?.voice ? `🎙 Voice · ${last.voice.seconds}s` : "")}</p>
                    {c.unread > 0 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">{c.unread}</span>}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
