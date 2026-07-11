import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMisaq } from "@/components/misaq/providers";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { Logo } from "@/components/misaq/logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/language")({ component: LangPick });

const langs = [
  { code: "en" as const, name: "English", native: "English", sample: "Marriage in the light of the Sunnah." },
  { code: "ur" as const, name: "Urdu", native: "اُردُو", sample: "سنّت کی روشنی میں نکاح۔" },
  { code: "ru" as const, name: "Roman Urdu", native: "Roman Urdu", sample: "Sunnah ki roshni mein nikah." },
];

function LangPick() {
  const { lang, setLang } = useMisaq();
  const navigate = useNavigate();
  return (
    <PhoneFrame>
      <div className="flex min-h-full flex-col px-6 pb-10 pt-14">
        <Logo size={44} withWord />
        <div className="mt-10">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Step 2 of 2</p>
          <h1 className="mt-2 font-display text-3xl leading-tight">Choose your language</h1>
          <p className="mt-2 text-sm text-muted-foreground">You may switch anytime from Settings.</p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {langs.map((l) => {
            const active = lang === l.code;
            return (
              <button key={l.code} onClick={() => setLang(l.code)} className={cn("flex items-center gap-4 rounded-2xl border p-4 text-left transition-all", active ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/40")}>
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-full font-display text-lg", active ? "bg-primary text-primary-foreground" : "bg-muted")}>{l.native.slice(0, 2)}</div>
                <div className="flex-1">
                  <p className="font-display text-lg leading-none">{l.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{l.sample}</p>
                </div>
                <div className={cn("h-4 w-4 rounded-full border-2", active ? "border-primary bg-primary" : "border-border")} />
              </button>
            );
          })}
        </div>

        <button onClick={() => navigate({ to: "/welcome" })} className="mt-auto w-full rounded-full bg-primary py-4 font-medium text-primary-foreground shadow-elegant">Continue</button>
      </div>
    </PhoneFrame>
  );
}
