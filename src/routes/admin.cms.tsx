import { createFileRoute } from "@tanstack/react-router";
import { FileText, Edit3 } from "lucide-react";
import { useT } from "@/components/misaq/providers";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/cms")({ component: AdminCMS });

function AdminCMS() {
  const t = useT();
  const pages = [
    { tk: "admin.cms.terms", u: `${t("admin.cms.updated")} 3d` },
    { tk: "admin.cms.privacy", u: `${t("admin.cms.updated")} 3d` },
    { tk: "admin.cms.community", u: `${t("admin.cms.updated")} 2w` },
    { tk: "admin.cms.qa", u: `12 ${t("admin.cms.articles")}` },
    { tk: "admin.cms.help", u: `48 ${t("admin.cms.articles")}` },
    { tk: "admin.cms.banners", u: `3 ${t("admin.cms.active")}` },
  ];
  return (
    <div className="p-4 pb-8">
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {pages.map((p) => (
          <li key={p.tk} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{t(p.tk)}</p>
              <p className="truncate text-[10px] text-muted-foreground">{p.u}</p>
            </div>
            <button
              onClick={() => toast.info(`CMS Edit Console: Editing for "${t(p.tk)}" is simulated.`)}
              aria-label={t("common.edit")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted cursor-pointer hover:bg-muted/75"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
