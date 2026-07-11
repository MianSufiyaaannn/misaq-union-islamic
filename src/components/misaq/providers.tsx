import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
export type Lang = "en" | "ur" | "ru";

type Dict = Record<string, string>;

const en: Dict = {
  // nav
  "nav.home": "Home", "nav.discover": "Discover", "nav.matches": "Matches", "nav.chats": "Chats", "nav.profile": "Profile",
  // common
  "common.back": "Back", "common.continue": "Continue", "common.cancel": "Cancel", "common.confirm": "Confirm",
  "common.save": "Save", "common.search": "Search", "common.filter": "Filters", "common.viewAll": "See all",
  "common.retry": "Retry", "common.loading": "Loading…", "common.empty": "Nothing here yet",
  "common.error": "Something went wrong",
  "common.online": "Online", "common.typing": "typing…",
  "common.today": "Today", "common.yesterday": "Yesterday", "common.earlier": "Earlier",
  "common.unread": "Unread", "common.read": "Read",
  "common.yrs": "yrs",
  // welcome
  "welcome.title": "A meeting written before the world began.",
  "welcome.subtitle": "Misaq is a covenant — a matrimonial platform built on Islamic values, dignity, and family involvement.",
  "welcome.create": "Create account", "welcome.have": "I already have an account",
  // language / theme
  "lang.title": "Choose your language", "lang.hint": "You may switch anytime from Settings.", "lang.continue": "Continue",
  "theme.title": "Choose your theme", "theme.light": "Light", "theme.dark": "Dark",
  // home
  "home.greeting": "Assalamu alaikum",
  "home.newMatches": "New matches", "home.proposals": "Proposals", "home.chats": "Chats",
  "home.featured": "Featured matches", "home.recent": "Recent proposals",
  "home.proposalReceived": "Proposal received",
  // discover
  "discover.title": "Discover", "discover.count": "verified profiles matching your filters",
  "discover.filter.all": "All",
  // matches
  "matches.title": "Matches & proposals",
  "matches.received": "Received", "matches.sent": "Sent", "matches.accepted": "Accepted",
  "matches.view": "View", "matches.accept": "Accept", "matches.decline": "Decline", "matches.openChat": "Open chat",
  "matches.empty": "No proposals in this section yet.",
  // chats
  "chats.title": "Chats", "chats.waliNotice": "Your Wali sees every conversation.",
  "chats.empty": "No conversations yet. Send a proposal to begin.",
  "chats.voice": "Voice", "chats.messagePlaceholder": "Message with adab…",
  "chats.online": "Online • Wali is watching",
  "chats.consent": "This conversation is visible to your Wali. Speak with adab.",
  "chats.startOfDay": "Today",
  // profile
  "profile.about": "About", "profile.eduProf": "Education & profession",
  "profile.religion": "Religious information", "profile.family": "Family",
  "profile.wali": "Wali information", "profile.dowry": "Dowry preference",
  "profile.compat": "Compatible profiles",
  "profile.education": "Education", "profile.profession": "Profession", "profile.height": "Height",
  "profile.sect": "Sect", "profile.prayer": "Prayer", "profile.quran": "Quran",
  "profile.hijab": "Hijab", "profile.beard": "Beard",
  "profile.father": "Father", "profile.mother": "Mother", "profile.siblings": "Siblings", "profile.familyType": "Family type",
  "profile.waliName": "Wali", "profile.verified": "Verified",
  "profile.sendProposal": "Send proposal", "profile.save": "Save",
  "profile.myTitle": "Your profile",
  // notifications
  "notif.title": "Notifications", "notif.markAllRead": "Mark all read",
  "notif.empty": "You're all caught up.",
  // premium
  "premium.eyebrow": "Misaq Premium",
  "premium.title": "Invest in a purposeful search.",
  "premium.subtitle": "Members with Premium receive up to 4× more sincere proposals — with families involved from the first hello.",
  "premium.mostChosen": "Most chosen",
  "premium.choose": "Choose",
  "premium.footer": "All plans are halal-compliant subscriptions. Cancel anytime.",
  // settings
  "settings.title": "Settings", "settings.theme": "Theme", "settings.language": "Language",
  "settings.account": "Account", "settings.preferences": "Preferences", "settings.support": "Support",
  "settings.logout": "Log out",
  "settings.myAccount": "My account", "settings.privacy": "Privacy",
  "settings.security": "Security & 2FA", "settings.notifications": "Notifications",
  "settings.premium": "Misaq Premium", "settings.help": "Help centre",
  "settings.about": "About Misaq", "settings.terms": "Terms of service", "settings.policy": "Privacy policy",
  // calls
  "call.voice": "Voice call", "call.video": "Video call",
  "call.calling": "Calling…", "call.connecting": "Connecting securely",
  "call.mute": "Mute", "call.end": "End", "call.speaker": "Speaker", "call.camera": "Camera", "call.flip": "Flip",
  // wali
  "wali.title": "Wali dashboard", "wali.overview": "Overview",
  "wali.proposals": "Proposals", "wali.monitoring": "Chat monitoring", "wali.review": "Profile review",
  // admin
  "admin.title": "Admin console", "admin.dashboard": "Dashboard",
  "admin.members": "Members", "admin.walis": "Walis",
  "admin.reports": "Reports", "admin.payments": "Payments", "admin.analytics": "Analytics",
  "admin.cms": "CMS", "admin.plans": "Plans", "admin.verification": "Verification",
  // register
  "reg.back": "Back", "reg.continue": "Continue", "reg.finish": "Finish & enter Misaq",
  "reg.step": "Step", "reg.of": "of",
};

const ur: Dict = {
  "nav.home": "ہوم", "nav.discover": "تلاش", "nav.matches": "میچز", "nav.chats": "چیٹس", "nav.profile": "پروفائل",
  "common.back": "واپس", "common.continue": "جاری رکھیں", "common.cancel": "منسوخ", "common.confirm": "تصدیق",
  "common.save": "محفوظ", "common.search": "تلاش", "common.filter": "فلٹرز", "common.viewAll": "سب دیکھیں",
  "common.retry": "دوبارہ کوشش", "common.loading": "لوڈ ہو رہا ہے…", "common.empty": "ابھی کچھ نہیں",
  "common.error": "کچھ غلط ہو گیا",
  "common.online": "آن لائن", "common.typing": "لکھ رہے ہیں…",
  "common.today": "آج", "common.yesterday": "کل", "common.earlier": "پہلے",
  "common.unread": "غیر پڑھی", "common.read": "پڑھی گئی",
  "common.yrs": "سال",
  "welcome.title": "ایک ملاقات جو دنیا سے پہلے لکھی جا چکی۔",
  "welcome.subtitle": "میثاق ایک عہد ہے — ایک نکاح پلیٹ فارم جو اسلامی اقدار، وقار اور خاندانی شمولیت پر قائم ہے۔",
  "welcome.create": "اکاؤنٹ بنائیں", "welcome.have": "میرا پہلے سے اکاؤنٹ ہے",
  "lang.title": "اپنی زبان چنیں", "lang.hint": "آپ کسی بھی وقت سیٹنگز سے تبدیل کر سکتے ہیں۔", "lang.continue": "جاری رکھیں",
  "theme.title": "اپنی تھیم چنیں", "theme.light": "روشن", "theme.dark": "گہری",
  "home.greeting": "السلام علیکم",
  "home.newMatches": "نئے میچز", "home.proposals": "پیغام", "home.chats": "چیٹس",
  "home.featured": "منتخب میچز", "home.recent": "حالیہ پیغام",
  "home.proposalReceived": "پیغام موصول",
  "discover.title": "تلاش", "discover.count": "تصدیق شدہ پروفائلز آپ کے فلٹرز سے میل کھاتے ہیں",
  "discover.filter.all": "سب",
  "matches.title": "میچز اور پیغام",
  "matches.received": "موصول", "matches.sent": "بھیجی گئی", "matches.accepted": "قبول",
  "matches.view": "دیکھیں", "matches.accept": "قبول", "matches.decline": "رد", "matches.openChat": "چیٹ کھولیں",
  "matches.empty": "اس حصے میں ابھی کوئی پیغام نہیں۔",
  "chats.title": "چیٹس", "chats.waliNotice": "آپ کا ولی ہر بات چیت دیکھ سکتا ہے۔",
  "chats.empty": "ابھی کوئی گفتگو نہیں۔ پیغام بھیج کر آغاز کریں۔",
  "chats.voice": "آواز", "chats.messagePlaceholder": "ادب سے پیغام لکھیں…",
  "chats.online": "آن لائن • ولی نگرانی میں",
  "chats.consent": "یہ گفتگو آپ کے ولی کو نظر آ رہی ہے۔ ادب سے بات کریں۔",
  "chats.startOfDay": "آج",
  "profile.about": "تعارف", "profile.eduProf": "تعلیم اور پیشہ",
  "profile.religion": "دینی معلومات", "profile.family": "خاندان",
  "profile.wali": "ولی کی معلومات", "profile.dowry": "جہیز کی ترجیح",
  "profile.compat": "ملتی جلتی پروفائلز",
  "profile.education": "تعلیم", "profile.profession": "پیشہ", "profile.height": "قد",
  "profile.sect": "مسلک", "profile.prayer": "نماز", "profile.quran": "قرآن",
  "profile.hijab": "حجاب", "profile.beard": "داڑھی",
  "profile.father": "والد", "profile.mother": "والدہ", "profile.siblings": "بہن بھائی", "profile.familyType": "خاندانی نظام",
  "profile.waliName": "ولی", "profile.verified": "تصدیق شدہ",
  "profile.sendProposal": "پیغام بھیجیں", "profile.save": "محفوظ",
  "profile.myTitle": "آپ کی پروفائل",
  "notif.title": "اطلاعات", "notif.markAllRead": "سب پڑھی نشان زد کریں",
  "notif.empty": "آپ اپ ٹو ڈیٹ ہیں۔",
  "premium.eyebrow": "میثاق پریمیم",
  "premium.title": "بامقصد تلاش میں سرمایہ کاری کریں۔",
  "premium.subtitle": "پریمیم اراکین کو 4 گنا زیادہ مخلص پیغام موصول ہوتے ہیں — پہلے سلام سے خاندان شامل۔",
  "premium.mostChosen": "سب سے مقبول",
  "premium.choose": "منتخب کریں",
  "premium.footer": "تمام پلانز حلال ہیں۔ کسی بھی وقت منسوخ کریں۔",
  "settings.title": "سیٹنگز", "settings.theme": "تھیم", "settings.language": "زبان",
  "settings.account": "اکاؤنٹ", "settings.preferences": "ترجیحات", "settings.support": "معاونت",
  "settings.logout": "لاگ آؤٹ",
  "settings.myAccount": "میرا اکاؤنٹ", "settings.privacy": "پرائیویسی",
  "settings.security": "سیکیورٹی و 2FA", "settings.notifications": "اطلاعات",
  "settings.premium": "میثاق پریمیم", "settings.help": "مدد گاہ",
  "settings.about": "میثاق کے بارے میں", "settings.terms": "شرائط", "settings.policy": "پرائیویسی پالیسی",
  "call.voice": "آواز کال", "call.video": "ویڈیو کال",
  "call.calling": "کال ہو رہی ہے…", "call.connecting": "محفوظ کنکشن جاری",
  "call.mute": "خاموش", "call.end": "ختم", "call.speaker": "اسپیکر", "call.camera": "کیمرا", "call.flip": "پلٹیں",
  "wali.title": "ولی ڈیش بورڈ", "wali.overview": "جائزہ",
  "wali.proposals": "پیغام", "wali.monitoring": "چیٹ نگرانی", "wali.review": "پروفائل جائزہ",
  "admin.title": "ایڈمن کنسول", "admin.dashboard": "ڈیش بورڈ",
  "admin.members": "اراکین", "admin.walis": "ولی",
  "admin.reports": "رپورٹس", "admin.payments": "ادائیگیاں", "admin.analytics": "تجزیات",
  "admin.cms": "سی ایم ایس", "admin.plans": "پلانز", "admin.verification": "تصدیق",
  "reg.back": "واپس", "reg.continue": "جاری رکھیں", "reg.finish": "مکمل کریں اور میثاق میں داخل ہوں",
  "reg.step": "مرحلہ", "reg.of": "از",
};

const ru: Dict = {
  "nav.home": "Home", "nav.discover": "Talash", "nav.matches": "Rishtay", "nav.chats": "Baat cheet", "nav.profile": "Profile",
  "common.back": "Wapas", "common.continue": "Jari rakhein", "common.cancel": "Mansookh", "common.confirm": "Tasdeeq",
  "common.save": "Mehfooz karein", "common.search": "Talash", "common.filter": "Filters", "common.viewAll": "Sab dekhein",
  "common.retry": "Dobara koshish", "common.loading": "Load ho raha hai…", "common.empty": "Abhi kuch nahin",
  "common.error": "Kuch ghalat ho gaya",
  "common.online": "Online", "common.typing": "likh rahe hain…",
  "common.today": "Aaj", "common.yesterday": "Kal", "common.earlier": "Pehle",
  "common.unread": "Ghair parhi", "common.read": "Parhi gayi",
  "common.yrs": "saal",
  "welcome.title": "Ek mulaqat jo duniya se pehle likhi ja chuki.",
  "welcome.subtitle": "Misaq ek ehd hai — nikah ka platform jo Islami qadar, waqar aur khandani shamooliat par qaim hai.",
  "welcome.create": "Account banayein", "welcome.have": "Mera pehle se account hai",
  "lang.title": "Apni zubaan chunein", "lang.hint": "Aap kisi bhi waqt Settings se badal sakte hain.", "lang.continue": "Jari rakhein",
  "theme.title": "Apni theme chunein", "theme.light": "Roshan", "theme.dark": "Gehri",
  "home.greeting": "Assalamu alaikum",
  "home.newMatches": "Naye rishtay", "home.proposals": "Paighaam", "home.chats": "Baat cheet",
  "home.featured": "Muntakhib rishtay", "home.recent": "Haaliya paighaam",
  "home.proposalReceived": "Paighaam mausool",
  "discover.title": "Talash", "discover.count": "tasdeeq shudah profiles aap ke filters se milte hain",
  "discover.filter.all": "Sab",
  "matches.title": "Rishtay aur paighaam",
  "matches.received": "Mausool", "matches.sent": "Bheji gayi", "matches.accepted": "Qabool",
  "matches.view": "Dekhein", "matches.accept": "Qabool", "matches.decline": "Rad", "matches.openChat": "Chat kholein",
  "matches.empty": "Is hisse mein abhi koi paighaam nahin.",
  "chats.title": "Baat cheet", "chats.waliNotice": "Aap ka Wali har guftagu dekh sakta hai.",
  "chats.empty": "Abhi koi guftagu nahin. Paighaam bhej kar aghaz karein.",
  "chats.voice": "Awaaz", "chats.messagePlaceholder": "Adab se paighaam likhein…",
  "chats.online": "Online • Wali nigraani mein",
  "chats.consent": "Yeh guftagu aap ke Wali ko nazar aa rahi hai. Adab se baat karein.",
  "chats.startOfDay": "Aaj",
  "profile.about": "Taruf", "profile.eduProf": "Taleem aur pesha",
  "profile.religion": "Deeni maloomat", "profile.family": "Khandan",
  "profile.wali": "Wali ki maloomat", "profile.dowry": "Jahez ki tarjeeh",
  "profile.compat": "Milti julti profiles",
  "profile.education": "Taleem", "profile.profession": "Pesha", "profile.height": "Qad",
  "profile.sect": "Maslak", "profile.prayer": "Namaz", "profile.quran": "Quran",
  "profile.hijab": "Hijab", "profile.beard": "Daarhi",
  "profile.father": "Walid", "profile.mother": "Walida", "profile.siblings": "Behen bhai", "profile.familyType": "Khandani nizaam",
  "profile.waliName": "Wali", "profile.verified": "Tasdeeq shudah",
  "profile.sendProposal": "Paighaam bhejein", "profile.save": "Mehfooz",
  "profile.myTitle": "Aap ki profile",
  "notif.title": "Ittilaat", "notif.markAllRead": "Sab parhi nishaan zad karein",
  "notif.empty": "Aap up to date hain.",
  "premium.eyebrow": "Misaq Premium",
  "premium.title": "Ba-maqsad talash mein sarmaya kaari karein.",
  "premium.subtitle": "Premium arkaan ko 4 gunah zyada mukhlis paighaam milte hain — pehle salaam se khandan shamil.",
  "premium.mostChosen": "Sab se maqbool",
  "premium.choose": "Muntakhib karein",
  "premium.footer": "Tamam plans halal hain. Kisi bhi waqt mansookh karein.",
  "settings.title": "Settings", "settings.theme": "Theme", "settings.language": "Zubaan",
  "settings.account": "Account", "settings.preferences": "Tarjeehat", "settings.support": "Madad",
  "settings.logout": "Log out",
  "settings.myAccount": "Mera account", "settings.privacy": "Privacy",
  "settings.security": "Security aur 2FA", "settings.notifications": "Ittilaat",
  "settings.premium": "Misaq Premium", "settings.help": "Madad centre",
  "settings.about": "Misaq ke bare mein", "settings.terms": "Sharait", "settings.policy": "Privacy policy",
  "call.voice": "Awaaz call", "call.video": "Video call",
  "call.calling": "Call ho rahi hai…", "call.connecting": "Mehfooz connection jaari",
  "call.mute": "Khamosh", "call.end": "Khatam", "call.speaker": "Speaker", "call.camera": "Camera", "call.flip": "Palten",
  "wali.title": "Wali dashboard", "wali.overview": "Jaiza",
  "wali.proposals": "Paighaam", "wali.monitoring": "Chat nigraani", "wali.review": "Profile jaiza",
  "admin.title": "Admin console", "admin.dashboard": "Dashboard",
  "admin.members": "Arkaan", "admin.walis": "Wali",
  "admin.reports": "Reports", "admin.payments": "Adaigiyan", "admin.analytics": "Tajziyat",
  "admin.cms": "CMS", "admin.plans": "Plans", "admin.verification": "Tasdeeq",
  "reg.back": "Wapas", "reg.continue": "Jari rakhein", "reg.finish": "Mukammal karein aur Misaq mein dakhil hon",
  "reg.step": "Step", "reg.of": "of",
};

const translations: Record<Lang, Dict> = { en, ur, ru };

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
