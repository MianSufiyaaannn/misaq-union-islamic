import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { people, meMember } from "@/lib/mock";
import { Avatar, CompatibilityRing } from "@/components/misaq/bits";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/wali/proposals")({ component: WaliProposals });

function WaliProposals() {
  return (
    <div className="pb-8">
      <TopBar title="Proposals" subtitle={`For ${meMember.name}`} back={false} />
      <div className="space-y-3 p-4">
        {people.slice(0, 5).map((p) => (
          <div key={p.id} className="rounded-3xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Avatar person={p} size={56} />
              <div className="flex-1">
                <p className="font-display text-lg leading-none">{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.age} · {p.city} · {p.profession}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">Sect: {p.sect}</p>
              </div>
              <CompatibilityRing value={p.compatibility} size={48} tone="gold" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Link to="/wali/profile/$id" params={{ id: p.id }} className="rounded-full border border-border py-2 text-center">Review profile</Link>
              <Link to="/wali/chats" className="rounded-full border border-border py-2 text-center">Wali's Wali chat</Link>
            </div>
            <div className="mt-2 flex gap-2">
              <button className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary py-2 text-xs font-medium text-primary-foreground"><Check className="h-3.5 w-3.5" /> Approve</button>
              <button className="flex flex-1 items-center justify-center gap-1 rounded-full border border-destructive/40 py-2 text-xs font-medium text-destructive"><X className="h-3.5 w-3.5" /> Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
