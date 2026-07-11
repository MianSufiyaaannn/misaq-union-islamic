import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { LayoutDashboard, Users, ShieldCheck, MessageSquare, CreditCard, Sparkles, BarChart3, Settings, FileText, UserCog, Flag, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminShell });

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/members", label: "Members", icon: Users },
  { to: "/admin/walis", label: "Walis", icon: ShieldCheck },
  { to: "/admin/verification", label: "Verify", icon: ShieldCheck },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/chats", label: "Chats", icon: MessageSquare },
  { to: "/admin/calls", label: "Calls", icon: Phone },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/premium", label: "Plans", icon: Sparkles },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/admins", label: "Admins", icon: UserCog },
  { to: "/admin/cms", label: "CMS", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-royal text-white font-display">M</div>
          <div className="flex-1">
            <p className="font-display text-sm leading-none">Misaq Admin</p>
            <p className="text-[10px] text-muted-foreground">Restricted console</p>
          </div>
          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-gold-foreground)]">SUPER</span>
        </header>
        <nav className="flex gap-1.5 overflow-x-auto border-b border-border bg-surface px-3 py-2">
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as any} className={cn("flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium", active ? "bg-primary text-primary-foreground shadow-soft" : "border border-border text-muted-foreground")}>
                <n.icon className="h-3 w-3" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1 overflow-y-auto"><Outlet /></div>
      </div>
    </PhoneFrame>
  );
}
