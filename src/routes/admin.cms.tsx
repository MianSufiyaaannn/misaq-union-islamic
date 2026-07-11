import { createFileRoute } from "@tanstack/react-router";
import { FileText, Edit3 } from "lucide-react";

export const Route = createFileRoute("/admin/cms")({ component: AdminCMS });

const pages = [
  { t: "Terms of service", u: "Updated 3d ago" },
  { t: "Privacy policy", u: "Updated 3d ago" },
  { t: "Community guidelines", u: "Updated 2w ago" },
  { t: "Islamic Q&A", u: "12 articles" },
  { t: "Help centre", u: "48 articles" },
  { t: "Homepage banners", u: "3 active" },
];

function AdminCMS() {
  return (
    <div className="p-4 pb-8">
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {pages.map((p) => (
          <li key={p.t} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span>
            <div className="flex-1">
              <p className="text-sm font-medium">{p.t}</p>
              <p className="text-[10px] text-muted-foreground">{p.u}</p>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"><Edit3 className="h-3.5 w-3.5" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
