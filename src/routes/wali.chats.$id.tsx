import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { useChats, findPerson, meMember } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { ShieldCheck, Ban, Flag, Trash2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/wali/chats/$id")({ component: WaliThread });

function WaliThread() {
  const { id } = Route.useParams();
  const t = useT();
  const [chats] = useChats();
  const chat = chats.find((c) => c.id === id) || chats[0];
  const other = findPerson(chat.personId);
  return (
    <div className="flex min-h-full flex-col bg-gradient-cream">
      <TopBar
        title={`${meMember.name.split(" ")[0]} ↔ ${other.name.split(" ")[0]}`}
        subtitle={t("wali.thread.readOnly")}
        right={
          <div className="flex gap-1.5">
            <button
              onClick={() => toast.success(`Wali block request sent for ${other.name}`)}
              aria-label={t("wali.chats.block")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted cursor-pointer hover:bg-muted/75"
            >
              <Ban className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => toast.error(`Report filed against ${other.name} for admin review.`)}
              aria-label={t("wali.chats.report")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted cursor-pointer hover:bg-muted/75"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => toast.info(`Wali chat deletion request submitted.`)}
              aria-label={t("wali.chats.delete")}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-muted cursor-pointer hover:bg-muted/75"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        }
      />
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-2xl border border-gold/40 bg-gold/10 p-3 text-[11px] text-[color:var(--color-gold-foreground)]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-gold" />{" "}
        <span className="min-w-0">{t("wali.thread.notice")}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        {chat.messages.map((m) => {
          const speaker = m.from === "me" ? meMember : other;
          return (
            <div
              key={m.id}
              className={cn("flex items-end gap-2", m.from === "me" ? "flex-row-reverse" : "")}
            >
              <Avatar person={speaker} size={28} />
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-soft",
                  m.from === "me"
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-card",
                )}
                dir="auto"
              >
                {m.text && <p>{m.text}</p>}
                {m.voice && (
                  <div className="flex items-center gap-2">
                    <button
                      aria-label={t("chats.voice")}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        m.from === "me" ? "bg-primary-foreground/20" : "bg-primary/10",
                      )}
                    >
                      <Play className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] opacity-70">
                      {t("chats.voice")} · 0:{String(m.voice.seconds).padStart(2, "0")}
                    </span>
                  </div>
                )}
                <p className="mt-1 text-end text-[9px] opacity-60">{m.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
