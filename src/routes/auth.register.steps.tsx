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

const memberSteps = ["Personal", "Education", "Religious", "Dowry", "Family", "Wali"];
const waliSteps = ["About You", "Relationship", "Verification"];

type Gender = "male" | "female" | null;

function Wizard() {
  const { role } = Route.useSearch();
  const steps = role === "wali" ? waliSteps : memberSteps;
  const [i, setI] = useState(0);
  const [gender, setGender] = useState<Gender>(null);
  const navigate = useNavigate();
  const t = useT();
  const isLast = i === steps.length - 1;

  const next = () => {
    if (i < steps.length - 1) setI(i + 1);
  };
  const prev = () => {
    if (i > 0) setI(i - 1);
  };
  const finish = () => {
    navigate({ to: role === "wali" ? "/wali" : "/app" });
  };

  return (
    <PhoneFrame>
      <TopBar
        title={role === "wali" ? "Wali Registration" : "Member Registration"}
        subtitle={`${t("reg.step")} ${i + 1} ${t("reg.of")} ${steps.length} — ${steps[i]}`}
      />
      <div className="px-6">
        <Progress current={i} total={steps.length} />
      </div>
      <div className="flex-1 px-6 pb-6 pt-4">
        {role === "wali" ? (
          <WaliStep step={i} />
        ) : (
          <MemberStep step={i} gender={gender} setGender={setGender} />
        )}
      </div>
      <div className="sticky bottom-0 flex gap-3 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
        {i > 0 && (
          <button
            type="button"
            onClick={prev}
            className="flex-1 rounded-full border border-border py-3 font-medium"
          >
            {t("reg.back")}
          </button>
        )}
        {!isLast ? (
          <button
            type="button"
            onClick={next}
            className="flex-[2] rounded-full bg-primary py-3 font-medium text-primary-foreground shadow-elegant"
          >
            {t("reg.continue")}
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="flex-[2] rounded-full bg-primary py-3 font-medium text-primary-foreground shadow-elegant"
          >
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
        <div key={i} className={cn("h-1.5 flex-1 rounded-full", i <= current ? "bg-primary" : "bg-muted")} />
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
      <input placeholder={placeholder} className="w-full rounded-2xl border border-input bg-surface px-4 py-3 text-sm outline-none focus:border-primary" />
    </label>
  );
}

function Chips({
  label,
  options,
  multi = false,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  multi?: boolean;
  value?: string[];
  onChange?: (next: string[]) => void;
}) {
  const [internal, setInternal] = useState<string[]>([]);
  const sel = value ?? internal;
  const toggle = (o: string) => {
    const next = multi
      ? sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]
      : sel[0] === o ? [] : [o];
    if (onChange) onChange(next);
    else setInternal(next);
  };
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => toggle(o)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              sel.includes(o)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface hover:border-primary/40",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function MemberStep({
  step,
  gender,
  setGender,
}: {
  step: number;
  gender: Gender;
  setGender: (g: Gender) => void;
}) {
  if (step === 0)
    return (
      <Section title="Personal information" hint="Only shown to matched families.">
        <TextInput label="Full name" placeholder="e.g. Ahmed Raza" />
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Date of birth" placeholder="DD / MM / YYYY" />
          <TextInput label="Height" placeholder={`5' 10"`} />
        </div>
        <Chips
          label="Gender"
          options={["Male", "Female"]}
          value={gender === "male" ? ["Male"] : gender === "female" ? ["Female"] : []}
          onChange={(next) => {
            const v = next[0];
            setGender(v === "Male" ? "male" : v === "Female" ? "female" : null);
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Country" placeholder="Pakistan" />
          <TextInput label="City" placeholder="Lahore" />
        </div>
        <Chips label="Nationality" options={["Pakistani", "Indian", "British", "American", "Emirati", "Other"]} />
      </Section>
    );
  if (step === 1)
    return (
      <Section title="Education & profession">
        <Chips label="Education" options={["Matric", "Intermediate", "Diploma", "Bachelor's", "Master's", "MPhil", "PhD"]} />
        <Chips label="Profession" options={["Student", "Teacher", "Doctor", "Engineer", "Business", "Government", "Private", "Freelancer", "Other"]} />
        <Chips label="Monthly income" options={["Under 50k", "50k – 100k", "100k – 250k", "250k – 500k", "500k+"]} />
      </Section>
    );
  if (step === 2)
    return (
      <Section title="Religious information" hint="Predefined options only — helps families find the right match.">
        <Chips label="Prayer level" options={["Never", "Sometimes", "Friday Only", "Daily", "Five Times", "Five Times in Mosque"]} />
        <Chips label="Quran reading" options={["Cannot Read", "Learning", "Sometimes", "Daily", "Hafiz"]} />
        <Chips label="Islamic knowledge" options={["Beginner", "Intermediate", "Good", "Advanced", "Scholar"]} />
        {gender === "male" && <Chips label="Beard" options={["No", "Short Beard", "Sunnah Beard"]} />}
        {gender === "female" && <Chips label="Hijab" options={["No", "Sometimes", "Regular", "Niqab"]} />}
        <Chips label="Islamic dress" options={["Modern", "Modest", "Traditional", "Sunnah"]} />
        <Chips label="Religious environment" options={["Normal", "Religious", "Highly Religious"]} />
        <Chips label="Islamic goals" multi options={["Hajj", "Umrah", "Memorize Quran", "Islamic Education", "Raise Religious Family"]} />
      </Section>
    );
  if (step === 3)
    return (
      <Section title="Dowry preference" hint="Answered honestly — barakah in transparency.">
        {gender === null && (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-3 text-xs text-muted-foreground">
            Please select your gender on the Personal step to see the right options.
          </p>
        )}
        {gender === "male" && (
          <Chips label="For Groom" options={["I Accept Dowry", "I Do Not Accept Dowry", "Doesn't Matter"]} />
        )}
        {gender === "female" && (
          <Chips label="For Bride" options={["We Will Give Dowry", "We Will Not Give Dowry", "Prefer Not to Answer"]} />
        )}
      </Section>
    );
  if (step === 4)
    return (
      <Section title="Family information">
        <Chips label="Father alive" options={["Yes", "No"]} />
        <Chips label="Mother alive" options={["Yes", "No"]} />
        <Chips label="Family type" options={["Joint Family", "Separate Family"]} />
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Brothers" placeholder="0" />
          <TextInput label="Sisters" placeholder="0" />
        </div>
      </Section>
    );
  return (
    <Section title="Wali information" hint="Every Member on Misaq must link one Wali. This person will oversee your journey.">
      <TextInput label="Wali name" />
      <Chips label="Relationship" options={["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Guardian", "Other"]} />
      <div className="grid grid-cols-2 gap-3">
        <TextInput label="Phone" placeholder="+92 300 0000000" />
        <TextInput label="WhatsApp" placeholder="+92 300 0000000" />
      </div>
      <TextInput label="Email" placeholder="wali@example.com" />
      <TextInput label="CNIC number" placeholder="XXXXX-XXXXXXX-X" />
      <div className="grid grid-cols-3 gap-2 text-center">
        {["CNIC Front", "CNIC Back", "Selfie"].map((s) => (
          <div key={s} className="rounded-2xl border border-dashed border-border p-4">
            <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-primary/10" />
            <p className="text-[10px] font-medium text-muted-foreground">{s}</p>
            <p className="text-[9px] text-muted-foreground/70">Tap to upload</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function WaliStep({ step }: { step: number }) {
  if (step === 0)
    return (
      <Section title="About you">
        <TextInput label="Full name" />
        <div className="grid grid-cols-2 gap-3"><TextInput label="Phone" /><TextInput label="Email" /></div>
        <div className="grid grid-cols-2 gap-3"><TextInput label="Country" /><TextInput label="City" /></div>
      </Section>
    );
  if (step === 1)
    return (
      <Section title="Linked member" hint="Enter the details of the bride or groom you will oversee.">
        <TextInput label="Member's full name" />
        <TextInput label="Member's Misaq ID or phone" />
        <Chips label="Relationship" options={["Father", "Mother", "Brother", "Sister", "Uncle", "Aunt", "Guardian", "Other"]} />
      </Section>
    );
  return (
    <Section title="Verification" hint="Your identity keeps every member safe.">
      <TextInput label="CNIC number" placeholder="XXXXX-XXXXXXX-X" />
      <div className="grid grid-cols-3 gap-2 text-center">
        {["CNIC Front", "CNIC Back", "Selfie"].map((s) => (
          <div key={s} className="rounded-2xl border border-dashed border-border p-4">
            <div className="mx-auto mb-2 h-8 w-8 rounded-full bg-primary/10" />
            <p className="text-[10px] font-medium text-muted-foreground">{s}</p>
            <p className="text-[9px] text-muted-foreground/70">Tap to upload</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
