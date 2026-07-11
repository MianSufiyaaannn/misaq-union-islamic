import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Home, MessageSquare, ShieldCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/wali")({ component: WaliShell });

function WaliShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const t = useT();
  const hide = path.match(/^\/wali\/chats\/[^/]+$/);
  const items = [
    { to: "/wali", label: t("wali.overview") || t("wali.dashboard"), icon: Home, exact: true },
    { to: "/wali/proposals", label: t("wali.proposals.title"), icon: ShieldCheck },
    { to: "/wali/chats", label: t("nav.chats"), icon: MessageSquare },
    { to: "/wali/settings", label: t("settings.title"), icon: Settings },
  ] as const;
  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col">
        <div className="flex-1"><Outlet /></div>
        {!hide && (
          <nav className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-2 pb-3 pt-2 backdrop-blur">
            <ul className="flex items-center justify-between">
              {items.map((it) => {
                const active = it.exact ? path === it.to : path.startsWith(it.to);
                return (
                  <li key={it.to} className="flex-1">
                    <Link to={it.to} className={cn("flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
                      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", active && "bg-primary/10")}>
                        <it.icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                      </span>
                      <span className="truncate max-w-full">{it.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </PhoneFrame>
  );
}
