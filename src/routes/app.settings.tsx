import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { useMisaq } from "@/components/misaq/providers";
import {
  User,
  Lock,
  Bell,
  Globe,
  Palette,
  Sparkles,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Key,
  Mail,
  Phone,
  Smartphone,
  Monitor,
  ShieldAlert,
  BadgeCheck,
  Eye,
  Trash2,
  ArrowLeft,
  Watch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMe, useChats } from "@/lib/mock";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

type TabKey = "light" | "dark";

const getLocalStorageItem = (key: string, defaultValue: string): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key) || defaultValue;
  }
  return defaultValue;
};

const getLocalStorageBool = (key: string, defaultValue: boolean): boolean => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val !== "false";
  }
  return defaultValue;
};

const getLocalStorageJson = <T,>(key: string, defaultValue: T): T => {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem(key);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (e) {
        return defaultValue;
      }
    }
  }
  return defaultValue;
};

function SettingsPage() {
  const { theme, setTheme, lang, setLang, t } = useMisaq();
  const navigate = useNavigate();
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [me, updateMe] = useMe();
  const [chats] = useChats();

  const hasWaliApproval = chats.some((c) => c.finalProposalStatus === "wali_approved");
  const isEligibleForPremium = me.gender === "male" && hasWaliApproval;

  // --- Sub-View Navigation inside Settings Modal ---
  const [subView, setSubView] = useState<
    "main" | "password" | "email" | "phone" | "blocked" | "reported"
  >("main");

  // ==========================================
  // --- 1. Privacy Settings (Persistent Local State) ---
  // ==========================================
  const [profileVisibility, setProfileVisibility] = useState(() =>
    getLocalStorageItem("misaq_privacy_visibility", "verified"),
  );
  const [hidePhone, setHidePhone] = useState(() =>
    getLocalStorageBool("misaq_privacy_hide_phone", true),
  );
  const [hideEmail, setHideEmail] = useState(() =>
    getLocalStorageBool("misaq_privacy_hide_email", true),
  );
  const [hideAddress, setHideAddress] = useState(() =>
    getLocalStorageBool("misaq_privacy_hide_address", true),
  );
  const [hideFamily, setHideFamily] = useState(() =>
    getLocalStorageBool("misaq_privacy_hide_family", true),
  );
  const [hideGallery, setHideGallery] = useState(() =>
    getLocalStorageBool("misaq_privacy_hide_gallery", true),
  );
  const [onlyVerifiedProposals, setOnlyVerifiedProposals] = useState(() =>
    getLocalStorageBool("misaq_privacy_only_ver_prop", true),
  );
  const [onlyVerifiedMessages, setOnlyVerifiedMessages] = useState(() =>
    getLocalStorageBool("misaq_privacy_only_ver_msg", true),
  );
  const [allowWaliMonitor, setAllowWaliMonitor] = useState(() =>
    getLocalStorageBool("misaq_privacy_wali_monitor", true),
  );
  const [showOnlineStatus, setShowOnlineStatus] = useState(() =>
    getLocalStorageItem("misaq_privacy_online_status", "matches"),
  );
  const [readReceipts, setReadReceipts] = useState(() =>
    getLocalStorageBool("misaq_privacy_read_receipts", true),
  );
  const [lastSeen, setLastSeen] = useState(() =>
    getLocalStorageItem("misaq_privacy_last_seen", "matches"),
  );

  const [blockedUsers, setBlockedUsers] = useState<string[]>(() =>
    getLocalStorageJson("misaq_privacy_blocked_users", ["Kamil Khan", "Sana Ahmed"]),
  );

  const [reportedHistory] = useState([
    { id: "r1", name: "Zahid Mahmood", date: "2026-07-08", status: "Resolved (User Suspended)" },
    { id: "r2", name: "Fake Profile 2026", date: "2026-07-12", status: "Under Review" },
  ]);

  const updatePrivacySetting = (key: string, value: any, setter: (val: any) => void) => {
    setter(value);
    localStorage.setItem(`misaq_privacy_${key}`, String(value));
    toast.success("Privacy preference updated!");
  };

  const handleUnblock = (username: string) => {
    const nextList = blockedUsers.filter((u) => u !== username);
    setBlockedUsers(nextList);
    localStorage.setItem("misaq_privacy_blocked_users", JSON.stringify(nextList));
    toast.success(`${username} unblocked successfully`);
  };

  // ==========================================
  // --- 2. Security & 2FA Settings (Persistent State) ---
  // ==========================================
  const [is2FAEnabled, setIs2FAEnabled] = useState(() =>
    getLocalStorageBool("misaq_sec_2fa_enabled", false),
  );
  const [authMethod, setAuthMethod] = useState(() =>
    getLocalStorageItem("misaq_sec_auth_method", "email"),
  );
  const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(() =>
    getLocalStorageBool("misaq_sec_faceid_enabled", false),
  );
  const [isAppLockEnabled, setIsAppLockEnabled] = useState(() =>
    getLocalStorageBool("misaq_sec_applock_enabled", false),
  );
  const [sessionTimeout, setSessionTimeout] = useState(() =>
    getLocalStorageItem("misaq_sec_session_timeout", "never"),
  );

  const [emailInput, setEmailInput] = useState(me.email || "ahmed.raza@gmail.com");
  const [phoneInput, setPhoneInput] = useState(me.phone || "+923009876543");
  const [emailVerified, setEmailVerified] = useState(true);
  const [phoneVerified, setPhoneVerified] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [activeDevices, setActiveDevices] = useState(() => [
    {
      id: "current",
      name: "iPhone 15 Pro (Current Device)",
      date: "Active Now",
      location: "Lahore, PK",
    },
    {
      id: "d2",
      name: "Windows PC - Chrome",
      date: "Last active: July 12, 10:24 AM",
      location: "Karachi, PK",
    },
  ]);

  const loginHistory = [
    { date: "2026-07-13", time: "09:42 AM", device: "iPhone 15 Pro (Lahore)" },
    { date: "2026-07-12", time: "08:15 PM", device: "Windows PC - Chrome (Karachi)" },
    { date: "2026-07-10", time: "02:11 PM", device: "iPhone 15 Pro (Lahore)" },
  ];

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Updating secure password credentials...",
      success: () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSubView("main");
        return "Password changed successfully! Keep it secure.";
      },
      error: "Failed to update password.",
    });
  };

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Sending OTP code to new email...",
      success: () => {
        updateMe({ ...me, email: emailInput });
        setSubView("main");
        return "Verification code sent! Email updated successfully.";
      },
      error: "Failed to update email.",
    });
  };

  const handleUpdatePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneInput.replace(/\D/g, "");
    if (clean.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
      loading: "Sending SMS verification code...",
      success: () => {
        updateMe({ ...me, phone: phoneInput });
        setSubView("main");
        return "SMS Verification sent! Phone number updated.";
      },
      error: "Failed to update phone number.",
    });
  };

  const handleLogoutOthers = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Terminating other sessions...",
      success: () => {
        setActiveDevices([
          {
            id: "current",
            name: "iPhone 15 Pro (Current Device)",
            date: "Active Now",
            location: "Lahore, PK",
          },
        ]);
        return "All other devices logged out successfully.";
      },
      error: "Failed to log out devices.",
    });
  };

  const handleLogoutAll = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
      loading: "Logging out of all devices...",
      success: () => {
        setSelectedSetting(null);
        navigate({ to: "/welcome" });
        return "Terminated all device sessions. Logged out.";
      },
      error: "Failed to log out.",
    });
  };

  // ==========================================
  // --- Groups and Layout Navigation ---
  // ==========================================
  const groups = [
    {
      title: t("settings.account"),
      items: [
        {
          i: User,
          l: "My account",
          d: "Manage your username, email, phone, and connected accounts.",
        },
        {
          i: ShieldCheck,
          l: "Privacy",
          d: "Control who sees your photos, status, and profile views.",
        },
        {
          i: Lock,
          l: "Security & 2FA",
          d: "Set password policies and enable two-factor authentication.",
        },
        { i: Bell, l: "Notifications", d: "Manage email, push, and Wali alerts settings." },
      ],
    },
    {
      title: t("settings.preferences"),
      items: [
        {
          i: Globe,
          l: t("settings.language"),
          d: "Switch interface language between English, Urdu, and Romanised Urdu.",
        },
        {
          i: Palette,
          l: t("settings.theme"),
          d: "Choose light background or dark serene interface.",
        },
        ...(me.gender === "male" &&
        (chats.some((c) => c.finalProposalStatus === "purchased") || isEligibleForPremium)
          ? [
              {
                i: Sparkles,
                l: "Misaq Premium",
                d: "Upgrade to Premium to unlock matrimonial features.",
              },
            ]
          : []),
      ],
    },
    {
      title: t("settings.support"),
      items: [
        {
          i: HelpCircle,
          l: "Help centre",
          d: "Access tutorials, FAQ, and contact Misaq customer support.",
        },
        {
          i: FileText,
          l: "About Misaq",
          d: "Learn about the mission, values, and features of Misaq.",
        },
        {
          i: FileText,
          l: "Terms of service",
          d: "Read standard legal terms for using our halal platform.",
        },
        { i: FileText, l: "Privacy policy", d: "Read how your private family data is protected." },
      ],
    },
  ];

  const allItems = groups.flatMap((g) => g.items);
  const activeItem = allItems.find((it) => it.l === selectedSetting);

  const handleLogout = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: "Signing out securely...",
      success: () => {
        navigate({ to: "/welcome" });
        return "Logged out successfully!";
      },
      error: "Logout failed.",
    });
  };

  const handleSettingClick = (label: string, desc: string) => {
    if (label === t("settings.theme") || label === t("settings.language")) {
      return;
    }
    if (label === "Misaq Premium") {
      navigate({ to: "/app/premium" });
      return;
    }
    setSubView("main");
    setSelectedSetting(label);
  };

  return (
    <div className="h-full overflow-y-auto pb-24">
      <TopBar title={t("settings.title")} back={false} />
      <div className="px-4 py-4 space-y-6">
        <div className="rounded-3xl border border-border bg-card p-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("settings.theme")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  "rounded-2xl border py-2 text-sm capitalize cursor-pointer transition-colors",
                  theme === t ? "border-primary bg-primary/10 text-primary" : "border-border",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mt-4 mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("settings.language")}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(["en", "ur", "ru"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "rounded-2xl border py-2 text-sm cursor-pointer transition-colors",
                  lang === l ? "border-primary bg-primary/10 text-primary" : "border-border",
                )}
              >
                {l === "en" ? "English" : l === "ur" ? "اُردُو" : "Roman"}
              </button>
            ))}
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <p className="mb-2 px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              {g.title}
            </p>
            <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
              {g.items.map((it) => (
                <li
                  key={it.l}
                  onClick={() => handleSettingClick(it.l, it.d)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <it.i className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-sm">{it.l}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3 text-sm font-medium text-destructive cursor-pointer hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-4 w-4" /> {t("settings.logout")}
        </button>
      </div>

      {/* ==========================================
          --- SETTINGS MODAL INTERFACES ---
          ========================================== */}
      <Dialog open={!!selectedSetting} onOpenChange={(open) => !open && setSelectedSetting(null)}>
        <DialogContent className="max-w-[420px] rounded-3xl bg-background p-6 max-h-[85vh] overflow-y-auto">
          {/* -------------------- PRIVACY PANEL -------------------- */}
          {selectedSetting === "Privacy" && (
            <div>
              {subView === "main" ? (
                <div className="space-y-5 text-left">
                  <DialogHeader>
                    <DialogTitle className="font-display text-lg text-primary">
                      Privacy Settings
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Safeguard your Islamic matrimony profile settings.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Profile Visibility */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Profile Visibility
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { val: "public", label: "Public" },
                        { val: "verified", label: "Verified Only" },
                        { val: "matched", label: "Matches Only" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          onClick={() =>
                            updatePrivacySetting("visibility", opt.val, setProfileVisibility)
                          }
                          className={cn(
                            "rounded-xl border py-1.5 text-[11px] font-medium transition-colors cursor-pointer",
                            profileVisibility === opt.val
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border",
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Privacy Toggles */}
                  <div className="space-y-3.5 border-t border-border pt-4">
                    {[
                      {
                        l: "Hide Phone Number",
                        v: hidePhone,
                        setter: setHidePhone,
                        k: "hide_phone",
                      },
                      {
                        l: "Hide Email Address",
                        v: hideEmail,
                        setter: setHideEmail,
                        k: "hide_email",
                      },
                      {
                        l: "Hide Full Address",
                        v: hideAddress,
                        setter: setHideAddress,
                        k: "hide_address",
                      },
                      {
                        l: "Hide CNIC Information",
                        v: true,
                        disabled: true,
                        d: "Required by Sharia Safety audit.",
                      },
                      {
                        l: "Hide Family Info from Non-Matched",
                        v: hideFamily,
                        setter: setHideFamily,
                        k: "hide_family",
                      },
                      {
                        l: "Hide Gallery from Non-Matched",
                        v: hideGallery,
                        setter: setHideGallery,
                        k: "hide_gallery",
                      },
                      {
                        l: "Only Verified can Send Proposals",
                        v: onlyVerifiedProposals,
                        setter: setOnlyVerifiedProposals,
                        k: "only_ver_prop",
                      },
                      {
                        l: "Only Verified can Send Messages",
                        v: onlyVerifiedMessages,
                        setter: setOnlyVerifiedMessages,
                        k: "only_ver_msg",
                      },
                      {
                        l: "Allow Wali to Monitor Chats",
                        v: allowWaliMonitor,
                        setter: setAllowWaliMonitor,
                        k: "wali_monitor",
                      },
                      {
                        l: "Read Receipts (Double Tick)",
                        v: readReceipts,
                        setter: setReadReceipts,
                        k: "read_receipts",
                      },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="font-medium text-foreground leading-tight">{row.l}</p>
                          {row.d && <p className="text-[10px] text-muted-foreground">{row.d}</p>}
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={row.v}
                            disabled={row.disabled}
                            onChange={(e) =>
                              updatePrivacySetting(row.k!, e.target.checked, row.setter!)
                            }
                            className="sr-only peer"
                          />
                          <div
                            className={cn(
                              "w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary",
                              row.disabled && "opacity-60 cursor-not-allowed",
                            )}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Online Status / Last Seen */}
                  <div className="space-y-4 border-t border-border pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-2">
                        Show Online Status
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["everyone", "matches", "nobody"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() =>
                              updatePrivacySetting("online_status", opt, setShowOnlineStatus)
                            }
                            className={cn(
                              "rounded-xl border py-1.5 text-[11px] font-medium capitalize transition-colors cursor-pointer",
                              showOnlineStatus === opt
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border",
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-2">
                        Last Seen visibility
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {["everyone", "matches", "nobody"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => updatePrivacySetting("last_seen", opt, setLastSeen)}
                            className={cn(
                              "rounded-xl border py-1.5 text-[11px] font-medium capitalize transition-colors cursor-pointer",
                              lastSeen === opt
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border",
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lists */}
                  <div className="space-y-2 border-t border-border pt-4">
                    <button
                      onClick={() => setSubView("blocked")}
                      className="flex w-full items-center justify-between rounded-2xl bg-muted/40 p-3 text-sm hover:bg-muted/80 transition-colors"
                    >
                      <span className="font-medium text-foreground">
                        Blocked Users List ({blockedUsers.length})
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => setSubView("reported")}
                      className="flex w-full items-center justify-between rounded-2xl bg-muted/40 p-3 text-sm hover:bg-muted/80 transition-colors"
                    >
                      <span className="font-medium text-foreground">Reported Users History</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedSetting(null)}
                    className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-soft mt-2"
                  >
                    Close Settings
                  </button>
                </div>
              ) : subView === "blocked" ? (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSubView("main")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="font-display text-base text-primary">Blocked Users</h3>
                  </div>
                  {blockedUsers.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No users currently blocked.
                    </p>
                  ) : (
                    <ul className="divide-y divide-border border border-border rounded-2xl bg-card">
                      {blockedUsers.map((user) => (
                        <li key={user} className="flex items-center justify-between p-3.5 text-sm">
                          <span className="font-medium">{user}</span>
                          <button
                            onClick={() => handleUnblock(user)}
                            className="rounded-full border border-border px-3 py-1 text-xs text-primary font-medium hover:bg-primary/5 cursor-pointer"
                          >
                            Unblock
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSubView("main")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="font-display text-base text-primary">Reported History</h3>
                  </div>
                  <div className="space-y-2">
                    {reportedHistory.map((rep) => (
                      <div
                        key={rep.id}
                        className="rounded-2xl border border-border bg-card p-3 text-xs"
                      >
                        <div className="flex justify-between font-semibold">
                          <span>{rep.name}</span>
                          <span className="text-muted-foreground">{rep.date}</span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-primary">
                          <Watch className="h-3.5 w-3.5" />
                          <span className="font-medium">{rep.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -------------------- SECURITY & 2FA PANEL -------------------- */}
          {selectedSetting === "Security & 2FA" && (
            <div>
              {subView === "main" ? (
                <div className="space-y-5 text-left">
                  <DialogHeader>
                    <DialogTitle className="font-display text-lg text-primary">
                      Security & 2FA
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                      Configure authentication and verify login history.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Credentials Update */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setSubView("password")}
                      className="flex w-full items-center justify-between rounded-2xl bg-muted/40 p-3.5 text-sm hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Key className="h-4 w-4 text-primary" />
                        <span className="font-medium">Change Password</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>

                    <button
                      onClick={() => setSubView("email")}
                      className="flex w-full items-center justify-between rounded-2xl bg-muted/40 p-3.5 text-sm hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Mail className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium">Change Email</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {emailInput} • {emailVerified ? "Verified 🟢" : "Unverified 🔴"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>

                    <button
                      onClick={() => setSubView("phone")}
                      className="flex w-full items-center justify-between rounded-2xl bg-muted/40 p-3.5 text-sm hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Phone className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-medium">Change Phone Number</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {phoneInput} • {phoneVerified ? "Verified 🟢" : "Unverified 🔴"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="border-t border-border pt-4 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground leading-tight">
                          Two-Factor Authentication (2FA)
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Prompt OTP code on unknown sign-in.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={is2FAEnabled}
                          onChange={(e) => {
                            setIs2FAEnabled(e.target.checked);
                            localStorage.setItem("misaq_sec_2fa_enabled", String(e.target.checked));
                            toast.success(
                              e.target.checked
                                ? "2FA security enabled!"
                                : "2FA protection disabled.",
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    {is2FAEnabled && (
                      <div className="rounded-2xl border border-border bg-muted/20 p-3 space-y-2 animate-fade-in text-xs">
                        <p className="font-semibold text-muted-foreground mb-1">
                          Authentication Method
                        </p>
                        {[
                          { val: "email", l: "Email OTP verification" },
                          { val: "sms", l: "SMS OTP verification" },
                          { val: "app", l: "Authenticator App (Google/Duo)" },
                        ].map((method) => (
                          <label
                            key={method.val}
                            className="flex items-center gap-2 cursor-pointer py-1"
                          >
                            <input
                              type="radio"
                              name="authMethod"
                              checked={authMethod === method.val}
                              onChange={() => {
                                setAuthMethod(method.val);
                                localStorage.setItem("misaq_sec_auth_method", method.val);
                                toast.success(`Method updated to: ${method.l}`);
                              }}
                              className="accent-primary"
                            />
                            <span>{method.l}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* App Lock & biometric */}
                  <div className="border-t border-border pt-4 space-y-3.5">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground leading-tight">
                          Face ID / Fingerprint Login
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Supported on current smartphone hardware.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFaceIdEnabled}
                          onChange={(e) => {
                            setIsFaceIdEnabled(e.target.checked);
                            localStorage.setItem(
                              "misaq_sec_faceid_enabled",
                              String(e.target.checked),
                            );
                            toast.success(
                              e.target.checked
                                ? "Biometric login enabled!"
                                : "Biometric login disabled.",
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground leading-tight">
                          App Lock (Pin Code)
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Lock screen every time the app opens.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAppLockEnabled}
                          onChange={(e) => {
                            setIsAppLockEnabled(e.target.checked);
                            localStorage.setItem(
                              "misaq_sec_applock_enabled",
                              String(e.target.checked),
                            );
                            toast.success(
                              e.target.checked ? "PIN Lock Enabled!" : "PIN Lock Disabled.",
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground leading-tight">Session Timeout</p>
                      </div>
                      <select
                        value={sessionTimeout}
                        onChange={(e) => {
                          setSessionTimeout(e.target.value);
                          localStorage.setItem("misaq_sec_session_timeout", e.target.value);
                          toast.success(`Timeout set to: ${e.target.value}`);
                        }}
                        className="rounded-xl border border-input bg-surface p-1.5 text-xs outline-none focus:border-primary"
                      >
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">1 Hour</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                  </div>

                  {/* Device List & History */}
                  <div className="border-t border-border pt-4 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-muted-foreground">
                          Active Devices
                        </h4>
                        {activeDevices.length > 1 && (
                          <button
                            onClick={handleLogoutOthers}
                            className="text-[10px] text-primary font-semibold hover:underline"
                          >
                            Logout Others
                          </button>
                        )}
                      </div>
                      <ul className="space-y-2">
                        {activeDevices.map((dev) => (
                          <li
                            key={dev.id}
                            className="flex items-start gap-2.5 rounded-xl border border-border p-2.5 bg-card text-xs"
                          >
                            <Monitor className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold truncate">{dev.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {dev.location} • {dev.date}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                        Login History
                      </h4>
                      <ul className="space-y-2">
                        {loginHistory.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex justify-between items-center text-[11px] rounded-xl border border-border p-2 bg-card"
                          >
                            <span className="text-muted-foreground">
                              {item.date} • {item.time}
                            </span>
                            <span className="font-medium truncate max-w-[150px]">
                              {item.device}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <button
                      type="button"
                      onClick={handleLogoutAll}
                      className="w-full rounded-full border border-destructive/40 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/5 cursor-pointer"
                    >
                      Logout from All Devices
                    </button>
                    <button
                      onClick={() => setSelectedSetting(null)}
                      className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-soft"
                    >
                      Close Settings
                    </button>
                  </div>
                </div>
              ) : subView === "password" ? (
                <form onSubmit={handleUpdatePassword} className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubView("main")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="font-display text-base text-primary">Change Password</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-soft mt-2"
                  >
                    Update Password
                  </button>
                </form>
              ) : subView === "email" ? (
                <form onSubmit={handleUpdateEmail} className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubView("main")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="font-display text-base text-primary">Change Email Address</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[10px] text-primary flex items-start gap-1.5">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      A 6-digit OTP code will be sent to this email to verify ownership before the
                      change becomes active.
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-soft mt-2"
                  >
                    Verify and Update
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUpdatePhone} className="space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubView("main")}
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h3 className="font-display text-base text-primary">Change Phone Number</h3>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-muted-foreground">
                      New Contact Phone
                    </label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/[^\d+]/g, ""))}
                      className="w-full rounded-xl border border-input bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[10px] text-primary flex items-start gap-1.5">
                    <Smartphone className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      An SMS verification containing a secure code will be triggered immediately.
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-soft mt-2"
                  >
                    Send Verification SMS
                  </button>
                </form>
              )}
            </div>
          )}

          {/* -------------------- MOCK FALLBACK (OTHER SETTINGS) -------------------- */}
          {selectedSetting !== "Privacy" && selectedSetting !== "Security & 2FA" && (
            <div>
              <DialogHeader>
                <DialogTitle className="font-display text-lg text-primary">
                  {activeItem?.l}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1">
                  {activeItem?.d}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 border border-dashed border-border rounded-2xl p-4 bg-surface text-center">
                <ShieldCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-xs font-semibold text-foreground">
                  Local/Mock Demo Console Only
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Updates to {activeItem?.l} are simulated in this mock environment.
                </p>
              </div>
              <button
                onClick={() => setSelectedSetting(null)}
                className="w-full rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground mt-4 shadow-soft"
              >
                Dismiss
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
