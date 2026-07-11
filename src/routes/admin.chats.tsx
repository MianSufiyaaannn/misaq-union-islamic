import { createFileRoute } from "@tanstack/react-router";
import { chats, findPerson, meMember } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { Eye, Flag } from "lucide-react";

export const Route = createFileRoute("/admin/chats")({ component: AdminChats });

function AdminChats() {
  return (
    <div className="p-4 pb-8 space-y-2">
      <p className="text-xs text-muted-foreground">2,104 active conversations · 12 flagged</p>
      {chats.map((c) => {
        const p = findPerson(c.personId);
        return (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="flex -space-x-3">
              <Avatar person={meMember} size={32} />
              <Avatar person={p} size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{meMember.name.split(" ")[0]} ↔ {p.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{c.messages.length} messages · Last: {c.lastAt}</p>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"><Eye className="h-3.5 w-3.5" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/15 text-destructive"><Flag className="h-3.5 w-3.5" /></button>
          </div>
        );
      })}
    </div>
  );
}
