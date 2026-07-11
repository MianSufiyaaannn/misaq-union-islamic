import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
export type Lang = "en" | "ur" | "ru";

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.discover": "Discover",
    "nav.matches": "Matches",
    "nav.chats": "Chats",
    "nav.profile": "Profile",
    "welcome.title": "A meeting written before the world began.",
    "welcome.subtitle": "Misaq is a covenant — a matrimonial platform built on Islamic values, dignity, and family involvement.",
    "welcome.create": "Create account",
    "welcome.have": "I already have an account",
    "lang.title": "Choose your language",
    "lang.hint": "You may switch anytime from Settings.",
    "lang.continue": "Continue",
    "settings.title": "Settings",
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.account": "Account",
    "settings.preferences": "Preferences",
    "settings.support": "Support",
    "settings.logout": "Log out",
    "reg.back": "Back",
    "reg.continue": "Continue",
    "reg.finish": "Finish & enter Misaq",
    "reg.step": "Step",
    "reg.of": "of",
  },
  ur: {
    "nav.home": "ہوم",
    "nav.discover": "تلاش",
    "nav.matches": "میچز",
    "nav.chats": "چیٹس",
    "nav.profile": "پروفائل",
    "welcome.title": "ایک ملاقات جو دنیا سے پہلے لکھی جا چکی۔",
    "welcome.subtitle": "میثاق ایک عہد ہے — ایک نکاح پلیٹ فارم جو اسلامی اقدار، وقار اور خاندانی شمولیت پر قائم ہے۔",
    "welcome.create": "اکاؤنٹ بنائیں",
    "welcome.have": "میرا پہلے سے اکاؤنٹ ہے",
    "lang.title": "اپنی زبان چنیں",
    "lang.hint": "آپ کسی بھی وقت سیٹنگز سے تبدیل کر سکتے ہیں۔",
    "lang.continue": "جاری رکھیں",
    "settings.title": "سیٹنگز",
    "settings.theme": "تھیم",
    "settings.language": "زبان",
    "settings.account": "اکاؤنٹ",
    "settings.preferences": "ترجیحات",
    "settings.support": "معاونت",
    "settings.logout": "لاگ آؤٹ",
    "reg.back": "واپس",
    "reg.continue": "جاری رکھیں",
    "reg.finish": "مکمل کریں اور میثاق میں داخل ہوں",
    "reg.step": "مرحلہ",
    "reg.of": "از",
  },
  ru: {
    "nav.home": "Home",
    "nav.discover": "Talash",
    "nav.matches": "Matches",
    "nav.chats": "Baat cheet",
    "nav.profile": "Profile",
    "welcome.title": "Ek mulaqat jo duniya se pehle likhi ja chuki.",
    "welcome.subtitle": "Misaq ek ehd hai — nikah ka platform jo Islami qadar, waqar aur khandani shamooliat par qaim hai.",
    "welcome.create": "Account banayein",
    "welcome.have": "Mera pehle se account hai",
    "lang.title": "Apni zubaan chunein",
    "lang.hint": "Aap kisi bhi waqt Settings se badal sakte hain.",
    "lang.continue": "Jari rakhein",
    "settings.title": "Settings",
    "settings.theme": "Theme",
    "settings.language": "Zubaan",
    "settings.account": "Account",
    "settings.preferences": "Tarjeehat",
    "settings.support": "Madad",
    "settings.logout": "Log out",
    "reg.back": "Wapas",
    "reg.continue": "Jari rakhein",
    "reg.finish": "Mukammal karein aur Misaq mein dakhil hon",
    "reg.step": "Step",
    "reg.of": "of",
  },
};

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const MisaqCtx = createContext<Ctx>({
  theme: "light",
  setTheme: () => {},
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export const useMisaq = () => useContext(MisaqCtx);
export const useT = () => useMisaq().t;

export function MisaqProviders({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const t = (typeof window !== "undefined" && (localStorage.getItem("misaq-theme") as Theme)) || "light";
    const l = (typeof window !== "undefined" && (localStorage.getItem("misaq-lang") as Lang)) || "en";
    setThemeState(t);
    setLangState(l);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined" || !hydrated) return;
    document.documentElement.lang = lang === "ur" ? "ur" : "en";
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  }, [lang, hydrated]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof window !== "undefined") localStorage.setItem("misaq-theme", t);
  };
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("misaq-lang", l);
  };

  const t = useMemo(() => {
    const dict = translations[lang] ?? translations.en;
    return (key: string) => dict[key] ?? translations.en[key] ?? key;
  }, [lang]);

  return (
    <MisaqCtx.Provider value={{ theme, setTheme, lang, setLang, t }}>
      {children}
    </MisaqCtx.Provider>
  );
}
