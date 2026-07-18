import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/premium")({ component: AdminPremium });

const plans = [
  {
    n: "Premium",
    p: "₨ 5,000",
    s: 1242,
    f: ["Unlock matched details", "Voice, video, and audio calls", "Image & file sharing"],
  },
];

function AdminPremium() {
  const t = useT();
  return (
    <div className="p-4 pb-8 space-y-3">
      {plans.map((p) => (
        <div key={p.n} className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-display text-xl">{p.n}</p>
              <p className="truncate text-xs text-muted-foreground">
                {p.p} / {t("admin.plans.month")} · {p.s.toLocaleString()} {t("admin.plans.subs")}
              </p>
            </div>
            <button
              onClick={() =>
                toast.info(
                  `Premium Configuration: Edit console for "${p.n}" is restricted in this demo.`,
                )
              }
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs cursor-pointer hover:bg-muted/30"
            >
              {t("common.edit")}
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2 text-[11px]">
            {p.f.map((x) => (
              <li key={x} className="rounded-full bg-muted px-2 py-1">
                {x}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
