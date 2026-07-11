import { createFileRoute, Link } from "@tanstack/react-router";
import { findChat, findPerson } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { TopBar } from "@/components/misaq/top-bar";
import { Phone, Video, Plus, Smile, Mic, Send, Play, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/chats/$id")({ component: Thread });

function Thread() {
  const { id } = Route.useParams();
  const chat = findChat(id);
  const p = findPerson(chat.personId);
  return (
    <div className="flex min-h-full flex-col bg-gradient-cream">
      <TopBar
        title={p.name}
        subtitle="Online • Wali is watching"
        right={
          <div className="flex gap-2">
            <Link to="/app/call/voice" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"><Phone className="h-4 w-4" /></Link>
            <Link to="/app/call/video" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"><Video className="h-4 w-4" /></Link>
          </div>
        }
      />
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-2xl border border-gold/40 bg-gold/10 p-3 text-[11px] text-[color:var(--color-gold-foreground)]">
        <ShieldCheck className="h-4 w-4 text-gold" />
        <p>This conversation is visible to your Wali. Speak with adab.</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="flex justify-center"><span className="rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">Today</span></div>
        {chat.messages.map((m) => (
          <div key={m.id} className={cn("flex items-end gap-2", m.from === "me" ? "flex-row-reverse" : "")}> 
            {m.from === "them" && <Avatar person={p} size={28} />}
            <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-soft", m.from === "me" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-card text-foreground")}>
              {m.text && <p>{m.text}</p>}
              {m.voice && (
                <div className="flex items-center gap-2">
                  <button className={cn("flex h-8 w-8 items-center justify-center rounded-full", m.from === "me" ? "bg-primary-foreground/20" : "bg-primary/10")}><Play className="h-3 w-3" /></button>
                  <div className="flex items-end gap-0.5">
                    {Array.from({ length: 22 }).map((_, i) => (
                      <span key={i} className={cn("w-0.5 rounded-full", m.from === "me" ? "bg-primary-foreground/70" : "bg-primary/60")} style={{ height: 4 + Math.abs(Math.sin(i)) * 14 }} />
                    ))}
                  </div>
                  <span className="text-[10px] opacity-70">0:{String(m.voice.seconds).padStart(2, "0")}</span>
                </div>
              )}
              <p className="mt-1 text-right text-[9px] opacity-60">{m.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-muted"><Plus className="h-4 w-4" /></button>
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
            <input placeholder="Message with adab…" className="flex-1 bg-transparent text-sm outline-none" />
            <Smile className="h-4 w-4 text-muted-foreground" />
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"><Mic className="h-4 w-4" /></button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--color-gold-foreground)]"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
