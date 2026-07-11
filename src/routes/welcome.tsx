import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Logo } from "@/components/misaq/logo";
import { ShieldCheck, Users, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/welcome")({ component: Welcome });

const pillars = [
  { icon: ShieldCheck, title: "Verified profiles", desc: "Every member is verified with CNIC and a Wali interview." },
  { icon: Users, title: "Family at the centre", desc: "Your Wali sees every conversation. Nothing hidden." },
  { icon: HeartHandshake, title: "Nikah, not dating", desc: "Structured proposals — no swiping, no ambiguity." },
];

function Welcome() {
  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col">
        <div className="relative overflow-hidden bg-gradient-royal px-6 pb-10 pt-14 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <Logo size={44} withWord tone="light" />
          <h1 className="mt-8 font-display text-4xl leading-tight">A meeting written before the world began.</h1>
          <p className="mt-3 max-w-[280px] text-sm text-white/75">Misaq is a covenant — a matrimonial platform built on Islamic values, dignity, and family involvement.</p>
        </div>

        <div className="flex-1 px-6 pt-6">
          <div className="ornament mb-4 text-[11px] uppercase tracking-[0.25em]"><span>بِسْمِ ٱللَّٰهِ</span></div>
          <div className="grid gap-3">
            {pillars.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><p.icon className="h-5 w-5" /></div>
                <div>
                  <p className="font-display text-lg leading-none">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 px-6 pb-10 pt-4">
          <Link to="/auth/register" className="w-full rounded-full bg-primary py-4 text-center font-medium text-primary-foreground shadow-elegant">Create account</Link>
          <Link to="/auth/login" className="w-full rounded-full border border-border py-4 text-center font-medium">I already have an account</Link>
        </div>
      </div>
    </PhoneFrame>
  );
}
