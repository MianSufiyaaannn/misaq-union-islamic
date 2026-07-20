import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Receipt, CreditCard, RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/payments")({ component: AdminPayments });

const initialRows = [
  {
    id: "tx_901",
    u: "Aisha Rahman",
    plan: "Premium Nikah Match",
    amt: "₨ 5,000",
    statusKey: "success",
    dateKey: "today" as const,
    gateway: "JazzCash / EasyPaisa",
  },
  {
    id: "tx_902",
    u: "Hamza Siddiqui",
    plan: "Premium Nikah Match",
    amt: "₨ 5,000",
    statusKey: "success",
    dateKey: "today" as const,
    gateway: "Credit Card (Visa)",
  },
  {
    id: "tx_903",
    u: "Khadija Malik",
    plan: "Premium Nikah Match",
    amt: "₨ 5,000",
    statusKey: "success",
    dateKey: "yesterday" as const,
    gateway: "Bank Transfer",
  },
  {
    id: "tx_904",
    u: "Bilal Ahmed",
    plan: "Premium Nikah Match",
    amt: "₨ 5,000",
    statusKey: "refund",
    dateKey: "yesterday" as const,
    gateway: "EasyPaisa",
  },
  {
    id: "tx_905",
    u: "Fatima Noor",
    plan: "Premium Nikah Match",
    amt: "₨ 5,000",
    statusKey: "failed",
    dateKey: "earlier" as const,
    gateway: "Credit Card (Mastercard)",
  },
];

function AdminPayments() {
  const t = useT();
  const [payments, setPayments] = useState(initialRows);
  const [activeFilter, setActiveFilter] = useState<"all" | "success" | "refund" | "failed">("all");
  const [selectedTx, setSelectedTx] = useState<typeof initialRows[0] | null>(null);

  const filtered = payments.filter((r) => activeFilter === "all" || r.statusKey === activeFilter);

  const dateLabel = (k: "today" | "yesterday" | "earlier") =>
    k === "today"
      ? t("common.today")
      : k === "yesterday"
        ? t("common.yesterday")
        : t("common.earlier");

  const handleIssueRefund = (tx: typeof initialRows[0]) => {
    const next = payments.map((r) => (r.id === tx.id ? { ...r, statusKey: "refund" } : r));
    setPayments(next);
    toast.success(`Refund of ${tx.amt} issued for ${tx.u}.`);
    setSelectedTx(null);
  };

  return (
    <div className="p-4 pb-8 space-y-3 text-left">
      <div className="grid grid-cols-3 gap-2">
        <Kpi l={t("admin.pay.today")} v="₨ 148k" />
        <Kpi l={t("admin.pay.month")} v="₨ 3.2M" />
        <Kpi l={t("admin.pay.refunds")} v="₨ 42k" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(["all", "success", "refund", "failed"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setActiveFilter(k)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize cursor-pointer transition-colors",
              activeFilter === k
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/40",
            )}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ul className="divide-y divide-border">
          {filtered.map((r) => (
            <li
              key={r.id}
              onClick={() => setSelectedTx(r)}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 px-3.5 py-3 text-sm hover:bg-muted/30 cursor-pointer transition-colors"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">{r.u}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {r.plan} · {dateLabel(r.dateKey)}
                </p>
              </div>
              <p className="shrink-0 font-mono text-sm font-bold">{r.amt}</p>
              <span
                className={`shrink-0 self-center rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${r.statusKey === "success" ? "bg-emerald-500/10 text-emerald-600" : r.statusKey === "refund" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600"}`}
              >
                {t(`admin.pay.status.${r.statusKey}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Transaction Receipt Modal */}
      {selectedTx && (
        <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
          <DialogContent className="max-w-[360px] rounded-3xl bg-background p-5 text-left">
            <DialogHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                <Receipt className="h-6 w-6" />
              </div>
              <DialogTitle className="font-display text-base font-bold">Transaction Receipt</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Transaction ID: {selectedTx.id}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-3 space-y-2 text-xs border border-border rounded-2xl p-3 bg-surface">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground uppercase text-[10px]">Payer</span>
                <span className="font-semibold">{selectedTx.u}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground uppercase text-[10px]">Subscription</span>
                <span className="font-semibold">{selectedTx.plan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground uppercase text-[10px]">Amount Paid</span>
                <span className="font-mono font-bold text-primary">{selectedTx.amt}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-muted-foreground uppercase text-[10px]">Gateway</span>
                <span>{selectedTx.gateway}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground uppercase text-[10px]">Status</span>
                <span className="font-bold uppercase text-[10px] text-primary">{selectedTx.statusKey}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              {selectedTx.statusKey === "success" && (
                <button
                  onClick={() => handleIssueRefund(selectedTx)}
                  className="flex-1 rounded-full border border-destructive text-destructive py-2 text-xs font-semibold hover:bg-destructive/10 cursor-pointer"
                >
                  Issue Refund
                </button>
              )}
              <button
                onClick={() => setSelectedTx(null)}
                className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground shadow"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Kpi({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="truncate text-[10px] uppercase font-bold text-muted-foreground">{l}</p>
      <p className="font-display text-lg font-bold mt-0.5">{v}</p>
    </div>
  );
}
