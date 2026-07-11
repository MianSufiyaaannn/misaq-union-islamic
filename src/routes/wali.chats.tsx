import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { chats, findPerson, meMember } from "@/lib/mock";
import { Avatar, CompatibilityRing } from "@/components/misaq/bits";
import { Ban, Trash2, Flag, Eye } from "lucide-react";

export const Route = createFileRoute("/wali/chats")({ component: WaliChats });

function WaliChats() {
  return (
    <div className="pb-8">
      <TopBar title="Chat monitoring" subtitle={`${meMember.name}'s conversations`} back={false} />
      <div className="space-y-3 p-4">
        {chats.map((c) => {
          const p = findPerson(c.personId);
          const last = c.messages[c.messages.length - 1];
          return (
            <div key={c.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <Avatar person={meMember} size={40} />
                  <Avatar person={p} size={44} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground">{meMember.name.split(" ")[0]} ↔</p>
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{last?.text ?? "🎙 Voice note"}</p>
                </div>
                <CompatibilityRing value={p.compatibility} size={42} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Link to="/wali/chats/$id" params={{ id: c.id }} className="flex items-center justify-center gap-1 rounded-full bg-primary py-2 text-primary-foreground"><Eye className="h-3.5 w-3.5" /> View chat</Link>
                <Link to="/wali/profile/$id" params={{ id: p.id }} className="flex items-center justify-center gap-1 rounded-full border border-border py-2">View profile</Link>
              </div>
              <div className="mt-2 flex gap-2 text-[11px] text-muted-foreground">
                <button className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5"><Ban className="h-3 w-3" /> Block</button>
                <button className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5"><Trash2 className="h-3 w-3" /> Delete</button>
                <button className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5"><Flag className="h-3 w-3" /> Report</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
