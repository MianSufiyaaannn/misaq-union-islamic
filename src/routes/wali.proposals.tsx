import { createFileRoute, Link } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { useProposals, useMe, type Person, useChats, useNotifications } from "@/lib/mock";
import { Avatar, CompatibilityRing } from "@/components/misaq/bits";
import { Check, X, Inbox, ShieldAlert, Sparkles } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/wali/proposals")({ component: WaliProposals });

function WaliProposals() {
  const t = useT();
  const [proposals, updateProposals] = useProposals();
  const [me] = useMe();
  const [chats, updateChats] = useChats();
  const [notifications, updateNotifications] = useNotifications();

  const handleApprove = (person: Person) => {
    const nextReceived = proposals.received.filter((x) => x.id !== person.id);
    const nextAccepted = [...proposals.accepted, person];
    updateProposals({
      ...proposals,
      received: nextReceived,
      accepted: nextAccepted,
    });
    toast.success(`Approved proposal from ${person.name}! Conversation unlocked.`);
  };

  const handleDecline = (person: Person) => {
    const nextReceived = proposals.received.filter((x) => x.id !== person.id);
    updateProposals({
      ...proposals,
      received: nextReceived,
    });
    toast.error(`Declined proposal from ${person.name}.`);
  };

  // Matrimonial workflow final proposal request
  const pendingFinalChat = chats.find((c) => c.finalProposalStatus === "accepted");
  const finalApplicant = pendingFinalChat ? findApplicant(pendingFinalChat.personId) : null;

  function findApplicant(id: string): Person {
    // In our single player mock, the applicant is always Ahmed Raza (meMember)
    // representing the boy proposing to the girl.
    return me;
  }

  const handleFinalApprove = () => {
    if (!pendingFinalChat) return;

    const sysMsg = {
      id: `sys_wali_approved_${Date.now()}`,
      from: "them" as const,
      text: "💚 Wali Approval: Abdullah Rahman (Aisha's Wali) has approved the Final Proposal! Ahmed Raza (Groom) can now upgrade to Premium to complete the match.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    updateChats(
      chats.map((c) =>
        c.id === pendingFinalChat.id
          ? {
              ...c,
              finalProposalStatus: "wali_approved",
              messages: [...c.messages, sysMsg],
            }
          : c,
      ),
    );

    // Send notification to Groom (Ahmed)
    const newNotif = {
      id: `n_wali_approved_${Date.now()}`,
      bucket: "today" as const,
      kind: "premium" as const,
      title: "Final Proposal Approved by Wali",
      desc: "Aisha's Wali approved the Final Proposal. You can now upgrade to Premium to complete the match.",
      time: "Just now",
      read: false,
    };
    updateNotifications([newNotif, ...notifications]);

    toast.success(
      "Alhamdulillah! Final Proposal approved. The groom has been notified to complete the Premium upgrade.",
      {
        duration: 5000,
      },
    );
  };

  const handleFinalDecline = () => {
    if (!pendingFinalChat) return;

    const sysMsg = {
      id: `sys_wali_rejected_${Date.now()}`,
      from: "them" as const,
      text: "🔴 Wali Decline: Abdullah Rahman (Aisha's Wali) has declined the Final Proposal. The matrimonial proceedings are cancelled.",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    updateChats(
      chats.map((c) =>
        c.id === pendingFinalChat.id
          ? {
              ...c,
              finalProposalStatus: "wali_rejected",
              messages: [...c.messages, sysMsg],
            }
          : c,
      ),
    );

    // Send notification to Groom (Ahmed)
    const newNotif = {
      id: `n_wali_rejected_${Date.now()}`,
      bucket: "today" as const,
      kind: "wali" as const,
      title: "Final Proposal Declined by Wali",
      desc: "Aisha's Wali declined the Final Proposal. Matrimonial proceedings have been cancelled.",
      time: "Just now",
      read: false,
    };
    updateNotifications([newNotif, ...notifications]);

    toast.error("Final Proposal declined. The matrimonial proceedings have been cancelled.");
  };

  return (
    <div className="h-full overflow-y-auto pb-24">
      <TopBar
        title={t("wali.proposals.title")}
        subtitle={`${t("wali.proposals.for")} Aisha Rahman`}
        back={false}
      />

      <div className="space-y-3 p-4">
        {/* Urgent Final Proposal Card */}
        {pendingFinalChat && finalApplicant && (
          <div className="rounded-3xl border-2 border-gold bg-gradient-to-br from-card to-gold/5 p-5 shadow-elegant animate-fade-in text-left">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="h-5 w-5 fill-current" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Matrimonial Request
              </span>
            </div>
            <h3 className="font-display text-lg mt-2 text-primary">Final Matrimonial Proposal</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Ahmed Raza (Software Engineer, 27) has requested final marriage approval for Aisha
              Rahman. Review and grant permission.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleFinalApprove}
                className="flex-1 flex items-center justify-center gap-1 rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground cursor-pointer shadow-soft hover:bg-primary/95"
              >
                <Check className="h-4 w-4" /> Approve Proceeding
              </button>
              <button
                onClick={handleFinalDecline}
                className="flex-1 flex items-center justify-center gap-1 rounded-full border border-destructive/40 py-2.5 text-xs font-semibold text-destructive cursor-pointer hover:bg-destructive/5"
              >
                <X className="h-4 w-4" /> Decline
              </button>
            </div>
          </div>
        )}

        {/* Regular proposal requests list */}
        {proposals.received.length === 0 && !pendingFinalChat ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground bg-card rounded-3xl border border-border">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="text-sm">No proposals pending Wali review.</p>
          </div>
        ) : (
          proposals.received.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-border bg-card p-4 animate-fade-in text-left"
            >
              <div className="flex items-center gap-3">
                <Avatar person={p} size={56} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg leading-none">{p.name}</p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {p.age} · {p.city} · {p.profession}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    Sect / Maslak: {p.sect}
                  </p>
                </div>
                <CompatibilityRing value={p.compatibility} size={48} tone="gold" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <Link
                  to="/wali/profile/$id"
                  params={{ id: p.id }}
                  className="rounded-full border border-border py-2 text-center cursor-pointer"
                >
                  Review Profile
                </Link>
                <Link
                  to="/wali/chats"
                  className="rounded-full border border-border py-2 text-center cursor-pointer"
                >
                  Monitor Chat
                </Link>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleApprove(p)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary py-2 text-xs font-medium text-primary-foreground cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" /> {t("common.approve")}
                </button>
                <button
                  onClick={() => handleDecline(p)}
                  className="flex flex-1 items-center justify-center gap-1 rounded-full border border-destructive/40 py-2 text-xs font-medium text-destructive cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" /> {t("common.decline")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
