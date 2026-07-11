import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";

const items: Array<{ to: string; key: string; icon: typeof Home; exact?: boolean }> = [
  { to: "/app", key: "nav.home", icon: Home, exact: true },
  { to: "/app/discover", key: "nav.discover", icon: Search },
  { to: "/app/matches", key: "nav.matches", icon: Heart },
  { to: "/app/chats", key: "nav.chats", icon: MessageCircle },
  { to: "/app/profile", key: "nav.profile", icon: User },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const t = useT();
  return (
    <nav className="sticky bottom-0 z-30 border-t border-border bg-background/95 px-2 pb-3 pt-2 backdrop-blur">
      <ul className="flex items-center justify-between">
        {items.map((it) => {
          const active = it.exact ? path === it.to : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <li key={it.to} className="flex-1">
              <Link
                to={it.to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-all", active && "bg-primary/10")}>
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.4 : 1.8} />
                </span>
                {t(it.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
