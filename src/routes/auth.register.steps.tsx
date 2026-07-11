import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/misaq/phone-frame";
import { TopBar } from "@/components/misaq/top-bar";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useT } from "@/components/misaq/providers";

const search = z.object({ role: z.enum(["member", "wali"]).catch("member") });

export const Route = createFileRoute("/auth/register/steps")({
  component: Wizard,
  validateSearch: search,
});

type Gender = "male" | "female" | null;

function Wizard() {
  const { role } = Route.useSearch();
  const t = useT();
  const memberSteps = [t("reg.s.personal"), t("reg.s.education"), t("reg.s.religious"), t("reg.s.dowry"), t("reg.s.family"), t("reg.s.wali")];
  const waliSteps = [t("reg.s.aboutYou"), t("reg.s.relationship"), t("reg.s.verification")];
  const steps = role === "wali" ? waliSteps : memberSteps;
  const [i, setI] = useState(0);
  const [gender, setGender] = useState<Gender>(null);
  const navigate = useNavigate();
  const isLast = i === steps.length - 1;

  const next = () => { if (i < steps.length - 1) setI(i + 1); };
  const prev = () => { if (i > 0) setI(i - 1); };
  const finish = () => navigate({ to: role === "wali" ? "/wali" : "/app" });

  return (
    <PhoneFrame>
      <TopBar
        title={role === "wali" ? t("reg.title.wali") : t("reg.title.member")}
        subtitle={`${t("reg.step")} ${i + 1} ${t("reg.of")} ${steps.length} — ${steps[i]}`}
      />
      <div className="px-6">
        <Progress current={i} total={steps.length} />
      </div>
      <div className="flex-1 px-6 pb-6 pt-4">
        {role === "wali" ? <WaliStep step={i} /> : <MemberStep step={i} gender={gender} setGender={setGender} />}
      </div>
      <div className="sticky bottom-0 flex gap-3 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        {i > 0 && (
          <button type="button" onClick={prev} className="flex-1 rounded-full border border-border py-3 font-medium">
            {t("reg.back")}
          </button>
        )}
        {!isLast ? (
          <button type="button" onClick={next} className="flex-[2] rounded-full bg-primary py-3 font-medium text-primary-foreground shadow-elegant">
            {t("reg.continue")}
          </button>
        ) : (
          <button type="button" onClick={finish} className="flex-[2] rounded-full bg-primary py-3 font-medium text-primary-foreground shadow-elegant">
            {t("reg.finish")}
          </button>
        )}
      </div>
    </PhoneFrame>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="mt-2 flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= current ? "bg-primary" : "bg-muted")} />
      ))}
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl">{title}</h2>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}

function TextInput({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input placeholder={placeholder} dir="auto" className="w-full rounded-2xl border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />
    </label>
  );
}

function Chips({ label, options, multi = false, value, onChange }: {
  label: string; options: string[]; multi?: boolean; value?: string[]; onChange?: (next: string[]) => void;
}) {
  const [internal, setInternal] = useState<string[]>([]);
  const sel = value ?? internal;
  const toggle = (o: string) => {
    const next = multi
      ? sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]
      : sel[0] === o ? [] : [o];
    if (onChange) onChange(next); else setInternal(next);
  };
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button type="button" key={o} onClick={() => toggle(o)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              sel.includes(o) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:border-primary/40",
            )}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}

function MemberStep({ step, gender, setGender }: { step: number; gender: Gender; setGender: (g: Gender) => void }) {
  const t = useT();
  const male = t("reg.o.male"); const female = t("reg.o.female");
  if (step === 0) return (
    <Section title={t("reg.sec.personal")} hint={t("reg.sec.personalHint")}>
      <TextInput label={t("reg.l.fullName")} placeholder={t("reg.ph.name")} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label={t("reg.l.dob")} placeholder={t("reg.ph.dob")} />
        <TextInput label={t("reg.l.height")} placeholder={t("reg.ph.height")} />
      </div>
      <Chips
        label={t("reg.l.gender")}
        options={[male, female]}
        value={gender === "male" ? [male] : gender === "female" ? [female] : []}
        onChange={(next) => {
          const v = next[0];
          setGender(v === male ? "male" : v === female ? "female" : null);
        }}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label={t("reg.l.country")} placeholder={t("reg.ph.country")} />
        <TextInput label={t("reg.l.city")} placeholder={t("reg.ph.city")} />
      </div>
      <Chips label={t("reg.l.nationality")} options={[t("reg.o.nat.pk"), t("reg.o.nat.in"), t("reg.o.nat.uk"), t("reg.o.nat.us"), t("reg.o.nat.ae"), t("reg.o.nat.other")]} />
    </Section>
  );
  if (step === 1) return (
    <Section title={t("reg.sec.eduProf")}>
      <Chips label={t("reg.l.education")} options={[t("reg.o.ed.matric"), t("reg.o.ed.inter"), t("reg.o.ed.diploma"), t("reg.o.ed.bach"), t("reg.o.ed.mast"), t("reg.o.ed.mphil"), t("reg.o.ed.phd")]} />
      <Chips label={t("reg.l.profession")} options={[t("reg.o.pr.student"), t("reg.o.pr.teacher"), t("reg.o.pr.doctor"), t("reg.o.pr.engineer"), t("reg.o.pr.business"), t("reg.o.pr.govt"), t("reg.o.pr.private"), t("reg.o.pr.freelance"), t("common.other")]} />
      <Chips label={t("reg.l.income")} options={[t("reg.o.inc.a"), t("reg.o.inc.b"), t("reg.o.inc.c"), t("reg.o.inc.d"), t("reg.o.inc.e")]} />
    </Section>
  );
  if (step === 2) return (
    <Section title={t("reg.sec.religious")} hint={t("reg.sec.religiousHint")}>
      <Chips label={t("reg.l.prayer")} options={[t("reg.o.pray.never"), t("reg.o.pray.some"), t("reg.o.pray.friday"), t("reg.o.pray.daily"), t("reg.o.pray.five"), t("reg.o.pray.fiveM")]} />
      <Chips label={t("reg.l.quran")} options={[t("reg.o.q.no"), t("reg.o.q.learn"), t("reg.o.q.some"), t("reg.o.q.daily"), t("reg.o.q.hafiz")]} />
      <Chips label={t("reg.l.knowledge")} options={[t("reg.o.k.beg"), t("reg.o.k.int"), t("reg.o.k.good"), t("reg.o.k.adv"), t("reg.o.k.scholar")]} />
      {gender === "male" && <Chips label={t("reg.l.beard")} options={[t("reg.o.b.no"), t("reg.o.b.short"), t("reg.o.b.sunnah")]} />}
      {gender === "female" && <Chips label={t("reg.l.hijab")} options={[t("reg.o.h.no"), t("reg.o.h.some"), t("reg.o.h.reg"), t("reg.o.h.niqab")]} />}
      <Chips label={t("reg.l.dress")} options={[t("reg.o.dr.modern"), t("reg.o.dr.modest"), t("reg.o.dr.trad"), t("reg.o.dr.sunnah")]} />
      <Chips label={t("reg.l.environment")} options={[t("reg.o.env.normal"), t("reg.o.env.rel"), t("reg.o.env.high")]} />
      <Chips label={t("reg.l.goals")} multi options={[t("reg.o.g.hajj"), t("reg.o.g.umrah"), t("reg.o.g.hifz"), t("reg.o.g.ed"), t("reg.o.g.family")]} />
    </Section>
  );
  if (step === 3) return (
    <Section title={t("reg.sec.dowry")} hint={t("reg.sec.dowryHint")}>
      {gender === null && (
        <p className="rounded-2xl border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
          {t("reg.dowry.needGender")}
        </p>
      )}
      {gender === "male" && (
        <Chips label={t("reg.l.forGroom")} options={[t("reg.o.dw.mAccept"), t("reg.o.dw.mNo"), t("reg.o.dw.mDont")]} />
      )}
      {gender === "female" && (
        <Chips label={t("reg.l.forBride")} options={[t("reg.o.dw.fGive"), t("reg.o.dw.fNo"), t("reg.o.dw.fPref")]} />
      )}
    </Section>
  );
  if (step === 4) return (
    <Section title={t("reg.sec.family")}>
      <Chips label={t("reg.l.fatherAlive")} options={[t("common.yes"), t("common.no")]} />
      <Chips label={t("reg.l.motherAlive")} options={[t("common.yes"), t("common.no")]} />
      <Chips label={t("reg.l.familyType")} options={[t("reg.o.ft.joint"), t("reg.o.ft.sep")]} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label={t("reg.l.brothers")} placeholder={t("reg.ph.zero")} />
        <TextInput label={t("reg.l.sisters")} placeholder={t("reg.ph.zero")} />
      </div>
    </Section>
  );
  return (
    <Section title={t("reg.sec.waliInfo")} hint={t("reg.sec.waliInfoHint")}>
      <TextInput label={t("reg.l.waliName")} />
      <Chips label={t("reg.l.rel")} options={[t("reg.o.rel.father"), t("reg.o.rel.mother"), t("reg.o.rel.brother"), t("reg.o.rel.sister"), t("reg.o.rel.uncle"), t("reg.o.rel.aunt"), t("reg.o.rel.guardian"), t("common.other")]} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label={t("reg.l.phone")} placeholder={t("reg.ph.phone")} />
        <TextInput label={t("reg.l.whatsapp")} placeholder={t("reg.ph.phone")} />
      </div>
      <TextInput label={t("reg.l.email")} placeholder={t("reg.ph.emailWali")} />
      <TextInput label={t("reg.l.cnic")} placeholder={t("reg.ph.cnic")} />
      <UploadRow />
    </Section>
  );
}

function UploadRow() {
  const t = useT();
  const items = [t("reg.upload.cnicFront"), t("reg.upload.cnicBack"), t("reg.upload.selfie")];
  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      {items.map((s) => (
        <div key={s} className="rounded-2xl border border-dashed border-border p-4">
          <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-primary/10" />
          <p className="truncate text-[10px] font-medium text-muted-foreground">{s}</p>
          <p className="truncate text-[9px] text-muted-foreground/70">{t("reg.upload.tap")}</p>
        </div>
      ))}
    </div>
  );
}

function WaliStep({ step }: { step: number }) {
  const t = useT();
  if (step === 0) return (
    <Section title={t("reg.sec.aboutYou")}>
      <TextInput label={t("reg.l.fullName")} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label={t("reg.l.phone")} placeholder={t("reg.ph.phone")} />
        <TextInput label={t("reg.l.email")} placeholder={t("reg.ph.emailWali")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextInput label={t("reg.l.country")} placeholder={t("reg.ph.country")} />
        <TextInput label={t("reg.l.city")} placeholder={t("reg.ph.city")} />
      </div>
    </Section>
  );
  if (step === 1) return (
    <Section title={t("reg.sec.linkedMember")} hint={t("reg.sec.linkedMemberHint")}>
      <TextInput label={t("reg.l.memberName")} />
      <TextInput label={t("reg.l.memberId")} />
      <Chips label={t("reg.l.rel")} options={[t("reg.o.rel.father"), t("reg.o.rel.mother"), t("reg.o.rel.brother"), t("reg.o.rel.sister"), t("reg.o.rel.uncle"), t("reg.o.rel.aunt"), t("reg.o.rel.guardian"), t("common.other")]} />
    </Section>
  );
  return (
    <Section title={t("reg.sec.verify")} hint={t("reg.sec.verifyHint")}>
      <TextInput label={t("reg.l.cnic")} placeholder={t("reg.ph.cnic")} />
      <UploadRow />
    </Section>
  );
}
