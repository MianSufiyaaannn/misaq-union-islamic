import { useState, useEffect } from "react";

export type CmsConfig = {
  // App Branding
  appName: string;
  appNameArabic: string;
  appTagline: string;
  logoUrl: string;
  splashLogoUrl: string;
  loginLogoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  faviconUrl: string;
  pwaIconUrl: string;

  // Home Content
  homeBanner: string;
  welcomeText: string;
  quranVerse: string;
  hadith: string;
  islamicReminder: string;
  heroBgImage: string;

  // Auth Screens
  welcomeScreenText: string;
  loginScreenText: string;
  registerScreenText: string;
  termsConditions: string;
  privacyPolicy: string;

  // Subscription
  premiumPrice: number;
  currency: string;
  premiumDescription: string;
  premiumFeatures: string[];
  premiumEnabled: boolean;

  // Match Settings
  matchDelay: number;
  sectWeight: number;
  practiceWeight: number;
  prayerWeight: number;
  cityWeight: number;
  educationWeight: number;
  ageWeight: number;
  interestsWeight: number;
  maritalWeight: number;
  aiMatchingEnabled: boolean;
  oneMatchSystemEnabled: boolean;

  // Contact
  supportEmail: string;
  whatsappNumber: string;
  officeAddress: string;
  website: string;

  // Social Links
  facebook: string;
  instagram: string;
  youtube: string;
  twitter: string;
  telegram: string;

  // Islamic Content Lists
  quranVerses: string[];
  dailyHadiths: string[];
  dailyReminders: string[];

  // Notifications
  announcementBanner: string;
  popupMessage: string;
  maintenanceMessage: string;
};

const INITIAL_CMS_CONFIG: CmsConfig = {
  appName: "Misaq",
  appNameArabic: "مِيثَاق",
  appTagline: "Islamic Matrimonial Platform",
  logoUrl: "/misaq-logo.png",
  splashLogoUrl: "/misaq-logo.png",
  loginLogoUrl: "/misaq-logo.png",
  primaryColor: "#6B121F",
  secondaryColor: "#C9A24C",
  accentColor: "#2E1416",
  faviconUrl: "/misaq-logo.png",
  pwaIconUrl: "/misaq-logo.png",

  homeBanner: "Welcome to Misaq Matrimonial",
  welcomeText: "Marriage conducted with dignity, family involvement, and Islamic values.",
  quranVerse: "And of His signs is that He created for you from yourselves mates... (30:21)",
  hadith: "The best of you are those who are best to their families.",
  islamicReminder: "Always ensure Wali involvement during all matrimonial conversations.",
  heroBgImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=1200",

  welcomeScreenText: "Halal Matrimonial Platform",
  loginScreenText: "Log in securely with your registered credentials.",
  registerScreenText: "Create your matrimonial profile with Wali details.",
  termsConditions: "Please maintain adab and Islamic manners in all matrimonial communications. Any violations will result in permanent ban.",
  privacyPolicy: "Your profile data is secure and contact details are only shared under mutual Wali approval and Premium purchase.",

  premiumPrice: 5000,
  currency: "₨",
  premiumDescription: "Unlock Matrimonial Success",
  premiumFeatures: [
    "Unlimited voice & video calls",
    "Reveal matching contact details",
    "Direct exchange of documents",
    "Wali approval verification checks"
  ],
  premiumEnabled: true,

  matchDelay: 20,
  sectWeight: 20,
  practiceWeight: 15,
  prayerWeight: 15,
  cityWeight: 15,
  educationWeight: 10,
  ageWeight: 10,
  interestsWeight: 10,
  maritalWeight: 5,
  aiMatchingEnabled: false,
  oneMatchSystemEnabled: true,

  supportEmail: "support@misaq.com",
  whatsappNumber: "+92 300 1234567",
  officeAddress: "Block K, Gulberg III, Lahore, Pakistan",
  website: "www.misaq.com",

  facebook: "facebook.com/misaq",
  instagram: "instagram.com/misaq",
  youtube: "youtube.com/misaq",
  twitter: "x.com/misaq",
  telegram: "t.me/misaq",

  quranVerses: [
    "And of His signs is that He created for you from yourselves mates... (30:21)",
    "They are clothing for you and you are clothing for them. (2:187)"
  ],
  dailyHadiths: [
    "The best of you are those who are best to their families.",
    "When a person marries, they have fulfilled half of their religion."
  ],
  dailyReminders: [
    "Always ensure Wali involvement during all matrimonial conversations.",
    "Communicate with adab, sincerity, and respect for Islamic boundaries."
  ],

  announcementBanner: "Maintenance scheduled for tonight.",
  popupMessage: "Welcome back! Please verify your profile.",
  maintenanceMessage: "Platform undergoes daily backups."
};

let currentConfig = INITIAL_CMS_CONFIG;
const listeners = new Set<() => void>();

const isClient = typeof window !== "undefined";
if (isClient) {
  try {
    const saved = localStorage.getItem("misaq_cms_config");
    if (saved) {
      currentConfig = { ...INITIAL_CMS_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error("Failed to load CMS config", e);
  }
}

const persist = (data: CmsConfig) => {
  if (isClient) {
    try {
      localStorage.setItem("misaq_cms_config", JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save CMS config", e);
    }
  }
};

const notify = () => {
  listeners.forEach((l) => l());
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export function useCmsConfig() {
  const [config, setConfig] = useState<CmsConfig>(currentConfig);
  
  useEffect(() => {
    return subscribe(() => setConfig(currentConfig));
  }, []);

  const updateConfig = (updater: Partial<CmsConfig> | ((prev: CmsConfig) => CmsConfig)) => {
    const next = typeof updater === "function" ? updater(currentConfig) : { ...currentConfig, ...updater };
    currentConfig = next;
    persist(next);
    notify();
  };

  return [config, updateConfig] as const;
}

export function getCmsConfig(): CmsConfig {
  return currentConfig;
}
