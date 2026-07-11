import { createFileRoute } from "@tanstack/react-router";
import { people } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { Check, X, Eye } from "lucide-react";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/verification")({ component: AdminVerify });

function AdminVerify() {
  const t = useT();
  return (
    <div className="p-4 pb-8 space-y-3">
      <p className="text-xs text-muted-foreground">42 {t("admin.verify.pending")}</p>
      {people.slice(0, 6).map((p) => (
        <div key={p.id} className="rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Avatar person={p} size={48} />
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{p.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{t("admin.verify.submitted")}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[t("reg.upload.cnicFront"), t("reg.upload.cnicBack"), t("reg.upload.selfie")].map((s) => (
              <div key={s} className="aspect-[3/2] rounded-xl bg-gradient-to-br from-muted to-muted/60 flex items-end p-2 text-[10px] text-muted-foreground truncate">{s}</div>
            ))}
          </div>
          <div className="mt-3 flex gap-2 text-xs">
            <button className="flex flex-1 items-center justify-center gap-1 rounded-full bg-primary py-2 text-primary-foreground"><Check className="h-3.5 w-3.5" /> {t("common.approve")}</button>
            <button className="flex flex-1 items-center justify-center gap-1 rounded-full border border-destructive/40 py-2 text-destructive"><X className="h-3.5 w-3.5" /> {t("common.reject")}</button>
            <button aria-label={t("common.view")} className="flex items-center justify-center gap-1 rounded-full border border-border px-3 py-2"><Eye className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
