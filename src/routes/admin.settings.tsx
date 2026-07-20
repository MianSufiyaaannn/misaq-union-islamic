import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Settings, ShieldCheck, Sliders, Check } from "lucide-react";
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

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

function AdminSettings() {
  const t = useT();
  const [selectedSettingKey, setSelectedSettingKey] = useState<string | null>(null);
  const [toggle2FA, setToggle2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordMinLength, setPasswordMinLength] = useState("8");

  const groups = [
    {
      t: t("admin.set.platform"),
      i: [
        "admin.set.p.branding",
        "admin.set.p.onboarding",
        "admin.set.p.algo",
        "admin.set.p.langs",
      ],
    },
    {
      t: t("admin.set.security"),
      i: ["admin.set.s.pw", "admin.set.s.2fa", "admin.set.s.sess", "admin.set.s.audit"],
    },
    {
      t: t("admin.set.compliance"),
      i: [
        "admin.set.c.retention",
        "admin.set.c.forgotten",
        "admin.set.c.export",
        "admin.set.c.laws",
      ],
    },
  ];

  const handleSaveSetting = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Settings for "${selectedSettingKey ? t(selectedSettingKey) : "Configuration"}" saved successfully!`);
    setSelectedSettingKey(null);
  };

  return (
    <div className="p-4 pb-8 space-y-4 text-left">
      {groups.map((g) => (
        <div key={g.t}>
          <p className="mb-2 px-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {g.t}
          </p>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            {g.i.map((k) => (
              <li
                key={k}
                onClick={() => setSelectedSettingKey(k)}
                className="flex items-center px-4 py-3.5 text-sm hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <span className="flex-1 min-w-0 truncate font-medium">{t(k)}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground rtl:rotate-180" />
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Interactive Setting Modal */}
      {selectedSettingKey && (
        <Dialog open={!!selectedSettingKey} onOpenChange={() => setSelectedSettingKey(null)}>
          <DialogContent className="max-w-[380px] rounded-3xl bg-background p-5 text-left">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold flex items-center gap-1.5 text-primary">
                <Sliders className="h-4 w-4 text-primary" /> {t(selectedSettingKey)}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Configure platform settings & security rules.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveSetting} className="space-y-4 mt-2">
              {selectedSettingKey.includes("s.2fa") && (
                <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-surface">
                  <div>
                    <p className="font-semibold text-xs">Enforce 2FA for Admins</p>
                    <p className="text-[10px] text-muted-foreground">Require OTP on sign in</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={toggle2FA}
                    onChange={(e) => setToggle2FA(e.target.checked)}
                    className="h-4 w-4 accent-primary"
                  />
                </div>
              )}

              {selectedSettingKey.includes("s.sess") && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Session Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
              )}

              {selectedSettingKey.includes("s.pw") && (
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary"
                    required
                  />
                </div>
              )}

              {!selectedSettingKey.includes("s.2fa") &&
                !selectedSettingKey.includes("s.sess") &&
                !selectedSettingKey.includes("s.pw") && (
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Configuration Value
                    </label>
                    <textarea
                      defaultValue="Default system policy rule active."
                      rows={3}
                      className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary resize-none"
                    />
                  </div>
                )}

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedSettingKey(null)}
                  className="flex-1 rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
