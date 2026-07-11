import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Onboarding",
    links: [
      { to: "/", l: "Splash" },
      { to: "/onboarding/theme", l: "Theme" },
      { to: "/onboarding/language", l: "Language" },
      { to: "/welcome", l: "Welcome" },
    ],
  },
  {
    title: "Auth",
    links: [
      { to: "/auth/login", l: "Login" },
      { to: "/auth/register", l: "Register" },
      { to: "/auth/register/steps", l: "Registration wizard" },
    ],
  },
  {
    title: "Member",
    links: [
      { to: "/app", l: "Home" },
      { to: "/app/discover", l: "Discover" },
      { to: "/app/matches", l: "Matches" },
      { to: "/app/chats", l: "Chats" },
      { to: "/app/chats/c1", l: "Chat thread" },
      { to: "/app/profile", l: "My profile" },
      { to: "/app/profile/aisha", l: "Profile detail" },
      { to: "/app/premium", l: "Premium" },
      { to: "/app/notifications", l: "Notifications" },
      { to: "/app/settings", l: "Settings" },
      { to: "/app/call/voice", l: "Voice call" },
      { to: "/app/call/video", l: "Video call" },
    ],
  },
  {
    title: "Wali",
    links: [
      { to: "/wali", l: "Overview" },
      { to: "/wali/proposals", l: "Proposals" },
      { to: "/wali/chats", l: "Chat monitoring" },
      { to: "/wali/chats/c1", l: "Chat view" },
      { to: "/wali/profile/aisha", l: "Profile review" },
      { to: "/wali/settings", l: "Settings" },
    ],
  },
  {
    title: "Admin",
    links: [
      { to: "/admin/login", l: "Login" },
      { to: "/admin", l: "Dashboard" },
      { to: "/admin/members", l: "Members" },
      { to: "/admin/walis", l: "Walis" },
      { to: "/admin/verification", l: "Verification" },
      { to: "/admin/reports", l: "Reports" },
      { to: "/admin/chats", l: "Chats" },
      { to: "/admin/calls", l: "Calls" },
      { to: "/admin/payments", l: "Payments" },
      { to: "/admin/premium", l: "Plans" },
      { to: "/admin/analytics", l: "Analytics" },
      { to: "/admin/admins", l: "Admins" },
      { to: "/admin/cms", l: "CMS" },
      { to: "/admin/settings", l: "Settings" },
    ],
  },
];

export function PreviewNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-72 overflow-y-auto border-l border-border bg-background/95 p-4 backdrop-blur md:block">
      <div className="pointer-events-auto">
        <p className="mb-1 font-display text-lg text-primary">Misaq · Design Preview</p>
        <p className="mb-4 text-[10px] text-muted-foreground">All screens are static UI/UX. Jump between account types below.</p>
        {sections.map((s) => (
          <div key={s.title} className="mb-4">
            <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">{s.title}</p>
            <ul className="space-y-0.5">
              {s.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to as any} className={cn("block rounded-md px-2 py-1 text-xs transition-colors", path === l.to ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted")}>{l.l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
