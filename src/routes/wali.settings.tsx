import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { User, ShieldCheck, Bell, Globe, Palette, LogOut, ChevronRight } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/wali/settings")({ component: WaliSettings });

function WaliSettings() {
  const t = useT();
  const navigate = useNavigate();
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  const items = [
    {
      i: User,
      l: t("wali.set.profile") || "Wali Profile",
      d: "Manage your guardian personal information and verified phone number.",
    },
    {
      i: Bell,
      l: t("wali.set.notif") || "Alerts & Notifications",
      d: "Toggle SMS, email, and push notifications for new matrimonial requests.",
    },
    {
      i: Globe,
      l: t("wali.set.lang") || "Language Preference",
      d: "Switch the application language interface.",
    },
    {
      i: Palette,
      l: t("wali.set.theme") || "Interface Theme",
      d: "Choose a light background or a serene dark theme layout.",
    },
  ];

  const handleLogout = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Signing out Wali console...",
      success: () => {
        navigate({ to: "/welcome" });
        return "Logged out successfully!";
      },
      error: "Logout failed.",
    });
  };

  const activeItem = items.find((it) => it.l === selectedSetting);

  return (
    <div className="h-full overflow-y-auto pb-24">
      <TopBar title={t("wali.settings.title")} back={false} />
      <div className="p-4 text-left">
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {items.map((it) => (
            <li
              key={it.l}
              onClick={() => setSelectedSetting(it.l)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <it.i className="h-4 w-4" />
              </span>
              <span className="flex-1 text-sm min-w-0 truncate font-medium">{it.l}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3 text-sm font-medium text-destructive cursor-pointer hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-4 w-4" /> {t("settings.logout")}
        </button>
      </div>

      {/* Wali Settings Dialog */}
      <Dialog open={!!selectedSetting} onOpenChange={(open) => !open && setSelectedSetting(null)}>
        <DialogContent className="max-w-[360px] rounded-3xl bg-background p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-lg text-primary text-left">
              {activeItem?.l}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1 text-left">
              {activeItem?.d}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border border-dashed border-border rounded-2xl p-4 bg-surface text-center">
            <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">Local/Mock Demo Console Only</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Wali settings updates are disabled in this mock application. Real settings require
              backend credentials.
            </p>
          </div>
          <button
            onClick={() => setSelectedSetting(null)}
            className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground mt-4 shadow-soft"
          >
            Dismiss
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
