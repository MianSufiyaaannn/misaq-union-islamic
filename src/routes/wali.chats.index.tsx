import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { useChats, findPerson, meMember } from "@/lib/mock";
import { Avatar, CompatibilityRing } from "@/components/misaq/bits";
import { Ban, Trash2, Flag, Eye } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/wali/chats/")({ component: WaliChats });

function WaliChats() {
  const t = useT();
  const [chats] = useChats();
  return (
    <div className="pb-8">
      <TopBar
        title={t("wali.chats.title")}
        subtitle={`${meMember.name} · ${chats.length} ${t("wali.chats.for")}`}
        back={false}
      />
      <div className="space-y-3 p-4">
        {chats.map((c) => {
          const p = findPerson(c.personId);
          const last = c.messages[c.messages.length - 1];
          return (
            <div key={c.id} className="rounded-3xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  <Avatar person={meMember} size={40} />
                  <Avatar person={p} size={44} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground truncate">
                    {meMember.name.split(" ")[0]} ↔
                  </p>
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {last?.text ?? `🎙 ${t("chats.voice")}`}
                  </p>
                </div>
                <CompatibilityRing value={p.compatibility} size={42} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/wali/chats/$id"
                  params={{ id: c.id }}
                  className="flex items-center justify-center gap-1 rounded-full bg-primary py-2 text-primary-foreground"
                >
                  <Eye className="h-3.5 w-3.5" /> {t("wali.chats.viewChat")}
                </Link>
                <Link
                  to="/wali/profile/$id"
                  params={{ id: p.id }}
                  className="flex items-center justify-center gap-1 rounded-full border border-border py-2"
                >
                  {t("wali.chats.viewProfile")}
                </Link>
              </div>
              <div className="mt-2 flex gap-2 text-[11px] text-muted-foreground">
                <button
                  onClick={() => toast.success(`Wali block request sent for ${p.name}`)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5 cursor-pointer hover:bg-muted/30"
                >
                  <Ban className="h-3 w-3" /> {t("wali.chats.block")}
                </button>
                <button
                  onClick={() => toast.info(`Wali chat deletion request submitted for ${p.name}`)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5 cursor-pointer hover:bg-muted/30"
                >
                  <Trash2 className="h-3 w-3" /> {t("wali.chats.delete")}
                </button>
                <button
                  onClick={() =>
                    toast.error(`Report filed against ${p.name} for admin moderation.`)
                  }
                  className="flex flex-1 items-center justify-center gap-1 rounded-full border border-border py-1.5 cursor-pointer hover:bg-muted/30"
                >
                  <Flag className="h-3 w-3" /> {t("wali.chats.report")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
