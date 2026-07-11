import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { BottomNav } from "@/components/misaq/bottom-nav";

export const Route = createFileRoute("/app")({ component: AppShell });

function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Hide bottom nav on immersive screens
  const hide = path.startsWith("/app/call") || path.match(/^\/app\/chats\/[^/]+$/) || path.match(/^\/app\/profile\/[^/]+$/);
  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col">
        <div className="flex-1"><Outlet /></div>
        {!hide && <BottomNav />}
      </div>
    </PhoneFrame>
  );
}
