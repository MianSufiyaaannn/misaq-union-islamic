import { createFileRoute } from "@tanstack/react-router";
import { Users, ShieldCheck, MessageSquare, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";
import { people } from "@/lib/mock";
import { Avatar } from "@/components/misaq/bits";
import { useT } from "@/components/misaq/providers";

export const Route = createFileRoute("/admin/")({ component: AdminDash });

function AdminDash() {
  const t = useT();
  const kpis = [
    { l: t("admin.kpi.members"), v: "12,428", d: `+184 ${t("admin.kpi.thisWeek")}`, i: Users, tone: "primary" },
    { l: t("admin.kpi.walis"), v: "3,916", d: `+42 ${t("admin.kpi.thisWeek")}`, i: ShieldCheck, tone: "primary" },
    { l: t("admin.kpi.chats"), v: "2,104", d: `12 ${t("admin.kpi.flagged")}`, i: MessageSquare, tone: "gold" },
    { l: t("admin.kpi.mrr"), v: "₨ 3.2M", d: "+8.4%", i: CreditCard, tone: "gold" },
  ];
  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-2xl border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${k.tone === "gold" ? "bg-gradient-gold text-[color:var(--color-gold-foreground)]" : "bg-primary/10 text-primary"}`}><k.i className="h-4 w-4" /></span>
              <span className="text-[10px] text-muted-foreground truncate">{k.d}</span>
            </div>
            <p className="mt-3 font-display text-2xl">{k.v}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">{k.l}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-lg truncate">{t("admin.nikahs")}</p>
          <span className="shrink-0 text-[10px] text-muted-foreground flex items-center gap-1"><TrendingUp className="h-3 w-3 text-primary" />+18% {t("admin.mom")}</span>
        </div>
        <div className="mt-4 flex h-32 items-end gap-1.5">
          {[24, 32, 28, 44, 38, 52, 61, 58, 72, 68, 84, 96].map((v, i) => (
            <div key={i} className="flex-1 rounded-t-md" style={{ height: `${v}%`, background: `linear-gradient(180deg, oklch(0.44 0.14 20), oklch(0.348 0.11 18))` }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[9px] text-muted-foreground">
          {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => <span key={`${m}-${i}`}>{m}</span>)}
        </div>
      </div>

      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-4 w-4 shrink-0" /><p className="font-medium text-sm">{t("admin.attention")}</p></div>
        <ul className="mt-2 space-y-1 text-xs">
          <li className="flex justify-between gap-2"><span className="truncate">{t("admin.att.verif")}</span><span className="font-semibold">42</span></li>
          <li className="flex justify-between gap-2"><span className="truncate">{t("admin.att.chats")}</span><span className="font-semibold">12</span></li>
          <li className="flex justify-between gap-2"><span className="truncate">{t("admin.att.reports")}</span><span className="font-semibold">7</span></li>
          <li className="flex justify-between gap-2"><span className="truncate">{t("admin.att.disputes")}</span><span className="font-semibold">2</span></li>
        </ul>
      </div>

      <div className="rounded-3xl border border-border bg-card p-4">
        <p className="mb-3 font-display text-lg">{t("admin.signups")}</p>
        <ul className="space-y-2">
          {people.slice(0, 6).map((p) => (
            <li key={p.id} className="flex items-center gap-3 text-sm">
              <Avatar person={p} size={36} />
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{p.city} · {p.profession}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${p.verified ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {p.verified ? t("common.verified") : t("common.pending")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
