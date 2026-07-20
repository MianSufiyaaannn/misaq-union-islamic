import { createFileRoute, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { BottomNav } from "@/components/misaq/bottom-nav";
import { useMe } from "@/lib/mock";
import { ShieldAlert, LogOut, Eye, ArrowLeft } from "lucide-react";
import { isReadOnlySession, clearReadOnlySession } from "@/lib/admin-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({ component: AppShell });

function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [me, updateMe] = useMe();
  const readOnly = isReadOnlySession();

  const handleExitReadOnly = () => {
    clearReadOnlySession();
    toast.success("Exited Read-Only session. Returned to Admin Dashboard.");
    navigate({ to: "/admin/members" });
  };

  // Hide bottom nav on immersive screens
  const hide =
    path.startsWith("/app/call") ||
    path.match(/^\/app\/chats\/[^/]+$/) ||
    path.match(/^\/app\/profile\/[^/]+$/);

  // If user is suspended or banned, block them completely from entering the app unless admin read-only
  const isSuspended = me.verificationStatus === "Suspended";
  const isBanned = me.verificationStatus === "Banned";

  if (!readOnly && (isSuspended || isBanned)) {
    const handleSignOut = () => {
      // Mock logout by resetting me back to a default verified user and going home
      localStorage.removeItem("misaq_me");
      window.location.href = "/welcome";
    };

    return (
      <PhoneFrame>
        <div className="flex min-h-full flex-col items-center justify-center bg-background px-6 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-6 animate-bounce">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-destructive">
            {isSuspended ? "Account Suspended" : "Account Banned"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            {isSuspended
              ? "Your profile has been temporarily suspended by the Misaq administrators for review. Please contact support at support@misaq.com."
              : "Your account has been permanently banned from Misaq due to policy and terms of service violations."}
          </p>
          <button
            onClick={handleSignOut}
            className="mt-8 flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:bg-primary/95 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Return to Welcome Screen
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex h-full w-full flex-col overflow-hidden relative">
        {readOnly && (
          <div className="z-50 flex items-center justify-between gap-2 border-b border-destructive/30 bg-destructive text-destructive-foreground px-3 py-2 text-xs shadow-md shrink-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <Eye className="h-4 w-4 shrink-0 animate-pulse" />
              <div className="min-w-0">
                <p className="font-bold leading-none truncate text-[11px] uppercase tracking-wider">
                  READ ONLY ADMIN SESSION
                </p>
                <p className="text-[10px] opacity-90 truncate mt-0.5">
                  Inspecting: {me.name}
                </p>
              </div>
            </div>
            <button
              onClick={handleExitReadOnly}
              className="shrink-0 rounded-full bg-white text-destructive px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider hover:bg-white/90 cursor-pointer shadow-sm transition-all"
            >
              Return to Admin Dashboard
            </button>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-hidden">
          <Outlet />
        </div>
        {!hide && <BottomNav />}
      </div>
    </PhoneFrame>
  );
}

