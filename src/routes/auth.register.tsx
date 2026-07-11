import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { TopBar } from "@/components/misaq/top-bar";
import { Heart, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth/register")({ component: Register });

function Register() {
  return (
    <PhoneFrame>
      <TopBar title="Create account" />
      <div className="flex flex-1 flex-col gap-4 px-6 pb-10 pt-2">
        <p className="text-sm text-muted-foreground">Choose who is registering.</p>

        <Link to="/auth/register/steps" search={{ role: "member" }} className="group flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary hover:shadow-elegant">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-white"><Heart className="h-6 w-6" /></div>
          <div>
            <p className="font-display text-xl">Bride or Groom</p>
            <p className="mt-1 text-xs text-muted-foreground">Create your profile, receive proposals, and involve your family through your Wali.</p>
          </div>
        </Link>

        <Link to="/auth/register/steps" search={{ role: "wali" }} className="group flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-soft transition-all hover:border-primary hover:shadow-elegant">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-[color:var(--color-gold-foreground)]"><ShieldCheck className="h-6 w-6" /></div>
          <div>
            <p className="font-display text-xl">Wali / Guardian</p>
            <p className="mt-1 text-xs text-muted-foreground">Register to oversee a linked member — view proposals, monitor chats, and safeguard the process.</p>
          </div>
        </Link>

        <div className="mt-6 rounded-2xl bg-primary/5 p-4 text-xs text-muted-foreground">
          Administrators are pre-created. Public admin registration is not available on Misaq.
        </div>

        <p className="mt-auto text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/auth/login" className="font-medium text-primary">Sign in</Link>
        </p>
      </div>
    </PhoneFrame>
  );
}
