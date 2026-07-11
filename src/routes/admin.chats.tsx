import { createFileRoute } from "@tanstack/react-router";
import { chats, findPerson, meMember } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { Eye, Flag } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/chats")({ component: AdminChats });

function AdminChats() {
  const t = useT();
  return (
    <div className="p-4 pb-8 space-y-2">
      <p className="text-xs text-muted-foreground">2,104 {t("admin.chats.summary")} · 12 {t("admin.chats.flagged")}</p>
      {chats.map((c) => {
        const p = findPerson(c.personId);
        return (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="flex -space-x-3 shrink-0 rtl:space-x-reverse">
              <Avatar person={meMember} size={32} />
              <Avatar person={p} size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{meMember.name.split(" ")[0]} ↔ {p.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{c.messages.length} {t("admin.chats.msgs")} · {t("admin.chats.last")}: {c.lastAt}</p>
            </div>
            <button aria-label={t("common.view")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted"><Eye className="h-3.5 w-3.5" /></button>
            <button aria-label={t("wali.chats.report")} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive"><Flag className="h-3.5 w-3.5" /></button>
          </div>
        );
      })}
    </div>
  );
}
