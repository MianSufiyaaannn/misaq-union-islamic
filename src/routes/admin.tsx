import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { LayoutDashboard, Users, ShieldCheck, MessageSquare, CreditCard, Sparkles, BarChart3, Settings, FileText, UserCog, Flag, Phone, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/misaq/providers";
import { isAdminAuthed, clearAdminAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({ component: AdminShell });

function AdminShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const t = useT();

  const isLogin = path === "/admin/login";

  // Mock auth guard: any /admin/* route other than /admin/login requires a session flag.
  useEffect(() => {
    if (!isLogin && !isAdminAuthed()) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [isLogin, path, navigate]);

  // Render the login page in complete isolation — no header, no nav, no dashboard chrome.
  if (isLogin) {
    return <Outlet />;
  }

  // Block a flash of admin content during the redirect above.
  if (!isAdminAuthed()) {
    return null;
  }

  const nav: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
    { to: "/admin", label: t("admin.nav.dashboard"), icon: LayoutDashboard, exact: true },
    { to: "/admin/members", label: t("admin.nav.members"), icon: Users },
    { to: "/admin/walis", label: t("admin.nav.walis"), icon: ShieldCheck },
    { to: "/admin/verification", label: t("admin.nav.verify"), icon: ShieldCheck },
    { to: "/admin/reports", label: t("admin.nav.reports"), icon: Flag },
    { to: "/admin/chats", label: t("admin.nav.chats"), icon: MessageSquare },
    { to: "/admin/calls", label: t("admin.nav.calls"), icon: Phone },
    { to: "/admin/payments", label: t("admin.nav.payments"), icon: CreditCard },
    { to: "/admin/premium", label: t("admin.nav.plans"), icon: Sparkles },
    { to: "/admin/analytics", label: t("admin.nav.analytics"), icon: BarChart3 },
    { to: "/admin/admins", label: t("admin.nav.admins"), icon: UserCog },
    { to: "/admin/cms", label: t("admin.nav.cms"), icon: FileText },
    { to: "/admin/settings", label: t("admin.nav.settings"), icon: Settings },
  ];

  const handleSignOut = () => {
    clearAdminAuth();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-royal text-white font-display">M</div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm leading-none">{t("admin.header")}</p>
            <p className="truncate text-[10px] text-muted-foreground">{t("admin.restricted")}</p>
          </div>
          <span className="shrink-0 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--color-gold-foreground)]">{t("admin.super")}</span>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            className="ms-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/40"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </header>
        <nav className="scrollbar-none flex snap-x snap-mandatory gap-1.5 overflow-x-auto border-b border-border bg-surface px-3 py-2" style={{ scrollPaddingInline: "0.75rem" }}>
          {nav.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as "/admin"} className={cn("flex shrink-0 snap-start items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow-soft" : "border border-border text-muted-foreground hover:border-primary/40")}>
                <n.icon className="h-3 w-3 shrink-0" /> <span className="truncate">{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex-1 overflow-y-auto"><Outlet /></div>
      </div>
    </PhoneFrame>
  );
}
