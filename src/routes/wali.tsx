import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Home, MessageSquare, ShieldCheck, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wali")({ component: WaliShell });

const items = [
  { to: "/wali", label: "Overview", icon: Home, exact: true },
  { to: "/wali/proposals", label: "Proposals", icon: ShieldCheck },
  { to: "/wali/chats", label: "Chats", icon: MessageSquare },
  { to: "/wali/settings", label: "Settings", icon: Settings },
];

function WaliShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hide = path.match(/^\/wali\/chats\/[^/]+$/);
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
                    <Link to={it.to as any} className={cn("flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
                      <span className={cn("flex h-8 w-8 items-center justify-center rounded-full", active && "bg-primary/10")}>
                        <it.icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                      </span>
                      {it.label}
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
