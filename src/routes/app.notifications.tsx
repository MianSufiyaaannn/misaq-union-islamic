import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { Avatar } from "@/components/misaq/bits";
import { findPerson, notifications, type NotifBucket } from "@/lib/mock";
import { Heart, MessageCircle, ShieldCheck, Sparkles, BadgeCheck, Crown } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/app/notifications")({ component: Notifications });

const iconFor = {
  proposal: Heart, message: MessageCircle, wali: ShieldCheck,
  compat: Sparkles, verify: BadgeCheck, premium: Crown,
} as const;

function Notifications() {
  const t = useT();
  const buckets: NotifBucket[] = ["today", "yesterday", "earlier"];
  const label: Record<NotifBucket, string> = {
    today: t("common.today"),
    yesterday: t("common.yesterday"),
    earlier: t("common.earlier"),
  };
  return (
    <div className="pb-8">
      <TopBar title={t("notif.title")} right={<button className="text-[11px] font-medium text-primary">{t("notif.markAllRead")}</button>} />
      {notifications.length === 0 ? (
        <div className="p-12 text-center text-sm text-muted-foreground">{t("notif.empty")}</div>
      ) : (
        buckets.map((b) => {
          const rows = notifications.filter((n) => n.bucket === b);
          if (!rows.length) return null;
          return (
            <section key={b}>
              <h2 className="px-5 pb-1 pt-4 text-[10px] uppercase tracking-widest text-muted-foreground">{label[b]}</h2>
              <ul className="divide-y divide-border">
                {rows.map((n) => {
                  const Icon = iconFor[n.kind];
                  const p = n.personId ? findPerson(n.personId) : null;
                  const tint = n.kind === "message" || n.kind === "compat" || n.kind === "premium" ? "gold" : "primary";
                  return (
                    <li key={n.id} className={`flex items-start gap-3 px-5 py-4 ${!n.read ? "bg-primary/5" : ""}`}>
                      <div className="relative shrink-0">
                        {p ? <Avatar person={p} size={44} /> : (
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-muted"><Icon className="h-5 w-5 text-primary" /></div>
                        )}
                        {p && (
                          <span className={`absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full text-white ${tint === "gold" ? "bg-gradient-gold" : "bg-gradient-primary"}`}>
                            <Icon className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground" dir="auto">{n.desc}</p>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                      {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
