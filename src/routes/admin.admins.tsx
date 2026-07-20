import { createFileRoute } from "@tanstack/react-router";
import { Plus, UserPlus, Mail, ShieldCheck } from "lucide-react";
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

export const Route = createFileRoute("/admin/admins")({ component: AdminAdmins });

const initialAdmins = [
  { id: "a1", n: "Sheikh Umar", roleKey: "super", email: "umar@misaq.app" },
  { id: "a2", n: "Zainab Q.", roleKey: "mod", email: "zainab@misaq.app" },
  { id: "a3", n: "Bilal M.", roleKey: "support", email: "bilal@misaq.app" },
];

function AdminAdmins() {
  const t = useT();
  const [adminList, setAdminList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("misaq_admin_users");
      return saved ? JSON.parse(saved) : initialAdmins;
    }
    return initialAdmins;
  });

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"super" | "mod" | "support">("mod");

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newAdmin = {
      id: `a_${Date.now()}`,
      n: newAdminName.trim(),
      email: newAdminEmail.trim(),
      roleKey: newAdminRole,
    };

    const next = [...adminList, newAdmin];
    setAdminList(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("misaq_admin_users", JSON.stringify(next));
    }

    toast.success(`Admin invite link generated for ${newAdminName} (${newAdminEmail})!`);
    setInviteModalOpen(false);
    setNewAdminName("");
    setNewAdminEmail("");
  };

  return (
    <div className="p-4 pb-8 space-y-3 text-left">
      <button
        onClick={() => setInviteModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/40 py-3 text-sm font-semibold text-primary cursor-pointer hover:bg-primary/5 transition-colors shadow-sm"
      >
        <Plus className="h-4 w-4" /> {t("admin.admins.invite")}
      </button>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ul className="divide-y divide-border">
          {adminList.map((a) => (
            <li key={a.id} className="flex items-center gap-3 px-3.5 py-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary font-display text-white text-sm font-bold shadow-sm">
                {a.n
                  .split(" ")
                  .map((x) => x[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold">{a.n}</p>
                <p className="truncate text-[10px] text-muted-foreground">{a.email}</p>
              </div>
              <span className="shrink-0 rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold text-[color:var(--color-gold-foreground)] truncate">
                {t(`admin.admins.roles.${a.roleKey}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Invite Admin Modal */}
      {inviteModalOpen && (
        <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
          <DialogContent className="max-w-[380px] rounded-3xl bg-background p-5 text-left">
            <DialogHeader>
              <DialogTitle className="font-display text-base font-bold flex items-center gap-1.5 text-primary">
                <UserPlus className="h-4 w-4" /> Invite Admin User
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Grant administrative privileges to team members.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleInviteSubmit} className="space-y-3 mt-2">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="E.g., Brother Tariq"
                  className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="tariq@misaq.app"
                  className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Administrative Role
                </label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as any)}
                  className="w-full rounded-2xl border border-input bg-surface px-3 py-2 text-xs outline-none focus:border-primary"
                >
                  <option value="super">Super Admin</option>
                  <option value="mod">Moderator</option>
                  <option value="support">Support Agent</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground shadow"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
