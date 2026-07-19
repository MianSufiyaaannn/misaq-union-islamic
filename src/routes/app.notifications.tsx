import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { Avatar } from "@/components/misaq/bits";
import {
  findPerson,
  useNotifications,
  type NotifBucket,
  setPhotoPermission,
  setPhotoRequest,
  addNotification,
  useMe,
  type Notif,
} from "@/lib/mock";
import { Heart, MessageCircle, ShieldCheck, Sparkles, BadgeCheck, Crown } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/app/notifications")({ component: Notifications });

const iconFor = {
  proposal: Heart,
  message: MessageCircle,
  wali: ShieldCheck,
  compat: Sparkles,
  verify: BadgeCheck,
  premium: Crown,
} as const;

function Notifications() {
  const t = useT();
  const [me] = useMe();
  const [notifications, updateNotifications] = useNotifications();

  const handleApprovePhotoRequest = (n: Notif) => {
    const matchId = n.photoRequest?.matchId || "";
    setPhotoPermission(matchId, true);
    setPhotoRequest(matchId, "approved");

    const next = notifications.map((notif) => {
      if (notif.id === n.id) {
        return {
          ...notif,
          read: true,
          photoRequest: notif.photoRequest
            ? { ...notif.photoRequest, status: "approved" as const }
            : undefined,
        };
      }
      return notif;
    });
    updateNotifications(next);

    addNotification({
      kind: "verify",
      title: "Photo Access Granted",
      desc: `${me.name} has approved your photo access request!`,
      personId: me.id,
      recipientId: n.photoRequest?.requesterId,
    });

    toast.success("Photo access request approved!");
  };

  const handleDeclinePhotoRequest = (n: Notif) => {
    const matchId = n.photoRequest?.matchId || "";
    setPhotoRequest(matchId, "declined");

    const next = notifications.map((notif) => {
      if (notif.id === n.id) {
        return {
          ...notif,
          read: true,
          photoRequest: notif.photoRequest
            ? { ...notif.photoRequest, status: "declined" as const }
            : undefined,
        };
      }
      return notif;
    });
    updateNotifications(next);

    toast.info("Photo access request declined.");
  };

  const myNotifications = notifications.filter(
    (n) => !n.recipientId || n.recipientId === me.id || (n.recipientId === "me" && me.id === "me"),
  );

  const buckets: NotifBucket[] = ["today", "yesterday", "earlier"];
  const label: Record<NotifBucket, string> = {
    today: t("common.today"),
    yesterday: t("common.yesterday"),
    earlier: t("common.earlier"),
  };

  const handleMarkAllRead = () => {
    const next = notifications.map((n) => ({ ...n, read: true }));
    updateNotifications(next);
    toast.success("All notifications marked as read");
  };

  const handleMarkRead = (id: string) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    updateNotifications(next);
  };

  return (
    <div className="h-full overflow-y-auto pb-24">
      <TopBar
        title={t("notif.title")}
        right={
          myNotifications.some((n) => !n.read) ? (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-medium text-primary cursor-pointer"
            >
              {t("notif.markAllRead")}
            </button>
          ) : null
        }
      />
      {myNotifications.length === 0 ? (
        <div className="p-12 text-center text-sm text-muted-foreground">{t("notif.empty")}</div>
      ) : (
        buckets.map((b) => {
          const rows = myNotifications.filter((n) => n.bucket === b);
          if (!rows.length) return null;
          return (
            <section key={b}>
              <h2 className="px-5 pb-1 pt-4 text-[10px] uppercase tracking-widest text-muted-foreground">
                {label[b]}
              </h2>
              <ul className="divide-y divide-border">
                {rows.map((n) => {
                  const Icon = iconFor[n.kind as keyof typeof iconFor] || Heart;
                  const p = n.personId ? findPerson(n.personId) : null;
                  const tint =
                    n.kind === "message" || n.kind === "compat" || n.kind === "premium"
                      ? "gold"
                      : "primary";
                  return (
                    <li
                      key={n.id}
                      onClick={() => handleMarkRead(n.id)}
                      className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-muted/10 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                    >
                      <div className="relative shrink-0">
                        {p ? (
                          <Avatar person={p} size={44} />
                        ) : (
                          <div className="grid h-11 w-11 place-items-center rounded-full bg-muted">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        {p && (
                          <span
                            className={`absolute -bottom-1 -end-1 flex h-6 w-6 items-center justify-center rounded-full text-white ${tint === "gold" ? "bg-gradient-gold" : "bg-gradient-primary"}`}
                          >
                            <Icon className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-medium">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground font-normal" dir="auto">
                          {n.desc}
                        </p>

                        {n.photoRequest && n.photoRequest.status === "pending" && (
                          <div
                            className="mt-2 flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleApprovePhotoRequest(n)}
                              className="rounded-full bg-primary px-3.5 py-1 text-[10px] font-semibold text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDeclinePhotoRequest(n)}
                              className="rounded-full border border-border bg-card px-3.5 py-1 text-[10px] font-semibold text-muted-foreground hover:bg-muted transition-all cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {n.photoRequest && n.photoRequest.status === "approved" && (
                          <p className="mt-1 text-[10px] text-primary font-semibold flex items-center gap-0.5">
                            ✓ Approved
                          </p>
                        )}

                        {n.photoRequest && n.photoRequest.status === "declined" && (
                          <p className="mt-1 text-[10px] text-destructive font-semibold flex items-center gap-0.5">
                            ✗ Declined
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                      {!n.read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
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
