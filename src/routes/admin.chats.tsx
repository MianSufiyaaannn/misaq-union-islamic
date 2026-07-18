import { createFileRoute } from "@tanstack/react-router";
import { useChats, findPerson, meMember, type ChatThread } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { Eye, Flag, ShieldCheck } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/chats")({ component: AdminChats });

function AdminChats() {
  const t = useT();
  const [chats, updateChats] = useChats();
  const [activeAuditChat, setActiveAuditChat] = useState<ChatThread | null>(null);

  // Track flagged chats locally
  const [flaggedIds, setFlaggedIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("misaq_flagged_chats");
      return saved ? JSON.parse(saved) : ["c1"]; // c1 is flagged by default
    }
    return ["c1"];
  });

  const handleToggleFlag = (chatId: string) => {
    let next: string[];
    if (flaggedIds.includes(chatId)) {
      next = flaggedIds.filter((id) => id !== chatId);
      toast.success("Chat unflagged successfully.");
    } else {
      next = [...flaggedIds, chatId];
      toast.error("Chat flagged for moderator inspection.");
    }
    setFlaggedIds(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("misaq_flagged_chats", JSON.stringify(next));
    }
  };

  return (
    <div className="p-4 pb-8 space-y-2">
      <p className="text-xs text-muted-foreground">
        2,104 {t("admin.chats.summary")} · {flaggedIds.length} {t("admin.chats.flagged")}
      </p>

      {chats.map((c) => {
        const p = findPerson(c.personId);
        const isFlagged = flaggedIds.includes(c.id);
        return (
          <div
            key={c.id}
            className={cn(
              "flex items-center gap-3 rounded-2xl border bg-card p-3 transition-colors",
              isFlagged ? "border-destructive/35 bg-destructive/5" : "border-border",
            )}
          >
            <div className="flex -space-x-3 shrink-0 rtl:space-x-reverse">
              <Avatar person={meMember} size={32} />
              <Avatar person={p} size={36} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">
                {meMember.name.split(" ")[0]} ↔ {p.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {c.messages.length} {t("admin.chats.msgs")} · {t("admin.chats.last")}: {c.lastAt}
              </p>
            </div>
            <button
              onClick={() => setActiveAuditChat(c)}
              aria-label={t("common.view")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted cursor-pointer hover:bg-muted/75"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleToggleFlag(c.id)}
              aria-label={t("wali.chats.report")}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full cursor-pointer transition-colors",
                isFlagged
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-destructive/15 text-destructive",
              )}
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}

      {/* Admin Chat Log Audit Dialog */}
      <Dialog open={!!activeAuditChat} onOpenChange={(open) => !open && setActiveAuditChat(null)}>
        {activeAuditChat && (
          <DialogContent className="max-w-[400px] rounded-3xl bg-background p-6">
            <DialogHeader className="items-center text-center">
              <ShieldCheck className="h-8 w-8 text-primary mb-1" />
              <DialogTitle className="font-display text-lg text-primary">
                Chat Audit Log
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Read-only conversation between {meMember.name.split(" ")[0]} and{" "}
                {findPerson(activeAuditChat.personId).name}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-3 flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1 border border-border rounded-2xl bg-surface p-3 text-left">
              {activeAuditChat.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "text-xs rounded-xl p-2 max-w-[85%]",
                    m.from === "me"
                      ? "bg-primary/10 text-primary self-end"
                      : "bg-muted text-foreground self-start",
                  )}
                >
                  <p className="font-semibold text-[9px] text-muted-foreground uppercase">
                    {m.from === "me"
                      ? meMember.name.split(" ")[0]
                      : findPerson(activeAuditChat.personId).name.split(" ")[0]}
                  </p>
                  <p className="mt-0.5">{m.text || `🎙 [Voice Note ${m.voice?.seconds}s]`}</p>
                  <p className="text-right text-[8px] opacity-60 mt-0.5">{m.time}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveAuditChat(null)}
              className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground mt-4 shadow-soft"
            >
              Close Audit
            </button>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
