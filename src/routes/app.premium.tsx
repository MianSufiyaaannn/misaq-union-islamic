import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TopBar } from "@/components/misaq/top-bar";
import { cn } from "@/lib/utils";
import { Check, ShieldAlert, Sparkles, CreditCard, Lock } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { useMe, useChats } from "@/lib/mock";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/app/premium")({
  component: Premium,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      chatId: (search.chatId as string) || undefined,
    };
  },
});

function Premium() {
  const t = useT();
  const navigate = useNavigate();
  const [me, updateMe] = useMe();
  const [chats, updateChats] = useChats();
  const [payOpen, setPayOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const { chatId } = Route.useSearch();

  // Find the exact chat thread we are upgrading
  const currentChat =
    chats.find((c) => c.id === chatId) ||
    chats.find(
      (c) => c.finalProposalStatus === "wali_approved" || c.finalProposalStatus === "purchased",
    );
  const isPremiumUnlockedForThisChat = currentChat?.finalProposalStatus === "purchased";
  const hasWaliApproval =
    currentChat !== undefined &&
    (currentChat.finalProposalStatus === "wali_approved" ||
      currentChat.finalProposalStatus === "purchased");
  const isEligible = me.gender === "male" && hasWaliApproval;

  // Rule: Hide subscription page and redirect if not eligible or if female
  useEffect(() => {
    if (me.gender === "female") {
      navigate({ to: "/app" });
      toast.error("Access Restricted: Subscription options are only available for the groom.");
      return;
    }
    if (me.gender === "male" && !isEligible && !isPremiumUnlockedForThisChat) {
      navigate({ to: "/app" });
      toast.error(
        "Misaq Premium is not accessible until your match's Wali approves your Final Proposal.",
      );
    }
  }, [isEligible, me.gender, isPremiumUnlockedForThisChat, navigate]);

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvc) {
      toast.error("Please fill in all credit card details.");
      return;
    }

    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Authorizing halal payment transaction...",
      success: () => {
        // Update the approved chat status to purchased
        const targetChatId = currentChat?.id || "c1";
        updateChats(
          chats.map((c) =>
            c.id === targetChatId ? { ...c, finalProposalStatus: "purchased" } : c,
          ),
        );

        setPayOpen(false);
        setCardNumber("");
        setCardExpiry("");
        setCardCvc("");

        setTimeout(() => {
          navigate({ to: `/app/chats/${targetChatId}` as any });
        }, 300);

        return "Payment successful! Misaq Premium matrimonial benefits unlocked.";
      },
      error: "Halal checkout failed.",
    });
  };

  // Render nothing while redirecting
  if (
    me.gender === "female" ||
    (me.gender === "male" && !isEligible && !isPremiumUnlockedForThisChat)
  ) {
    return null;
  }

  // Eligible Boy: Show the single plan
  return (
    <div className="h-full overflow-y-auto pb-24">
      <div className="relative overflow-hidden bg-gradient-royal px-6 pb-14 pt-14 text-white">
        <div className="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-[color:var(--color-gold)]/30 blur-3xl" />
        <TopBar back tone="light" transparent />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[color:var(--color-gold)]">
            Premium Matrimonial Upgrade
          </p>
          <h1 className="mt-2 font-display text-3xl leading-tight">Unlock Matrimonial Success</h1>
          <p className="mt-2 max-w-[320px] text-sm text-white/75">
            Upgrade your connection to unlock full contact details and start calls with Wali
            visibility.
          </p>
        </div>
      </div>

      <div className="-mt-8 px-5">
        <div className="relative overflow-hidden rounded-3xl border border-gold/60 bg-gradient-to-br from-card to-gold/10 p-6 shadow-elegant text-left">
          <span className="absolute end-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-gold-foreground)]">
            Wali Approved
          </span>
          <p className="font-display text-2xl text-primary">Misaq Premium Plan</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-4xl">₨ 5,000</span>
            <span className="text-xs text-muted-foreground">One-time Upgrade fee</span>
          </div>

          <ul className="mt-5 space-y-3">
            {[
              "Unlimited voice, video, and audio calls with match",
              "Share photos and document attachments in chat",
              "Reveal phone, email, and address on profile page",
              "Direct exchange of contact details in chat thread",
              "Family involvement under Wali verification checks",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-gold text-[color:var(--color-gold-foreground)] mt-0.5">
                  <Check className="h-3 w-3" />
                </span>
                <span className="min-w-0">{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setPayOpen(true)}
            className="mt-6 w-full rounded-full bg-gradient-primary py-3.5 text-sm font-semibold text-white shadow-elegant cursor-pointer"
          >
            Upgrade to Premium (₨ 5,000)
          </button>
        </div>
      </div>
      <p className="mt-6 px-6 text-center text-[11px] text-muted-foreground">
        All transaction fees contribute directly to sustaining Misaq's halal services.
      </p>

      {/* Credit Card payment checkout */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="max-w-[360px] rounded-3xl bg-background p-6">
          <DialogHeader className="items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <CreditCard className="h-5 w-5" />
            </div>
            <DialogTitle className="font-display text-lg text-primary">Halal Checkout</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Enter your credit card to pay Rs. 5,000 one-time fee securely.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePurchaseSubmit} className="space-y-4 text-left mt-2">
            <div>
              <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                Card number
              </label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  Expiry (MM/YY)
                </label>
                <input
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="12/28"
                  maxLength={5}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                  CVC
                </label>
                <input
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  placeholder="123"
                  maxLength={3}
                  className="w-full rounded-2xl border border-input bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-soft cursor-pointer mt-2"
            >
              Complete Payment (Rs. 5,000)
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
