import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCmsConfig, type CmsConfig } from "@/lib/cms-config";
import { isSuperAdmin } from "@/lib/admin-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Palette,
  FileText,
  CreditCard,
  PhoneCall,
  Megaphone,
  Lock,
  Plus,
  Trash2,
  Crop,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/admin/cms")({ component: AdminCMS });

function CmsImageUploader({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [showCrop, setShowCrop] = useState(false);
  const [compression, setCompression] = useState(70);
  const [cropScale, setCropScale] = useState(1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const originalSizeKb = 150;
  const compressedSizeKb = Math.round(originalSizeKb * (compression / 100));

  return (
    <div className="rounded-2xl border border-border p-4 space-y-3 bg-background shadow-soft">
      <span className="block text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <img
            src={value}
            alt={label}
            className="h-16 w-16 rounded-xl object-cover border border-border bg-muted shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground text-[10px] uppercase font-bold shrink-0 bg-muted/20">
            Empty
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          <label
            className={cn(
              "rounded-full bg-primary px-3.5 py-1.5 text-[10px] font-semibold text-primary-foreground shadow cursor-pointer hover:bg-primary/95 transition-all shrink-0",
              disabled && "opacity-40 pointer-events-none"
            )}
          >
            Replace
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
          {value && (
            <>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={disabled}
                className="rounded-full border border-destructive/20 bg-destructive/5 px-3.5 py-1.5 text-[10px] font-semibold text-destructive hover:bg-destructive/10 transition-all shrink-0"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => setShowCrop(!showCrop)}
                disabled={disabled}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[10px] font-semibold text-foreground hover:bg-muted transition-all shrink-0 flex items-center gap-1"
              >
                <Crop className="h-3 w-3" /> Crop
              </button>
            </>
          )}
        </div>
      </div>

      {value && showCrop && (
        <div className="rounded-xl border border-border/80 p-3 space-y-3 bg-muted/40 animate-fade-in">
          <span className="block text-[10px] uppercase font-bold text-muted-foreground">Adjust Image Crop</span>
          <div className="relative h-32 bg-black/20 rounded-lg overflow-hidden flex items-center justify-center border border-border">
            <img
              src={value}
              alt="crop preview"
              style={{ transform: `scale(${cropScale})` }}
              className="max-h-full transition-transform duration-200"
            />
            <div className="absolute inset-4 border border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none rounded" />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] text-muted-foreground shrink-0">Scale:</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={cropScale}
              onChange={(e) => setCropScale(parseFloat(e.target.value))}
              className="flex-1 accent-primary h-1 bg-border rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setShowCrop(false)}
              className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold text-primary-foreground shadow"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {value && (
        <div className="rounded-xl border border-border/80 p-3 space-y-2 bg-muted/40">
          <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
            <span>Mock Compression Control</span>
            <span>{compression}% Quality</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={compression}
            onChange={(e) => setCompression(parseInt(e.target.value))}
            className="w-full accent-primary h-1 bg-border rounded-lg cursor-pointer"
            disabled={disabled}
          />
          <div className="flex justify-between text-[9px] text-muted-foreground font-medium">
            <span>Original: {originalSizeKb} KB</span>
            <span className="font-semibold text-emerald-600">
              Compressed: {compressedSizeKb} KB ({100 - compression}% saved)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCMS() {
  const [config, updateConfig] = useCmsConfig();
  const isSuper = isSuperAdmin();
  const [activeTab, setActiveTab] = useState<"branding" | "content" | "sub-matches" | "contact" | "banners">("branding");

  // Local state form fields to prevent sluggish typing lag
  const [form, setForm] = useState<CmsConfig>(config);

  const updateField = (key: keyof CmsConfig, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateConfig(form);
    toast.success("CMS modifications saved successfully and applied instantly!");
  };

  const handleReset = () => {
    setForm(config);
    toast.info("Form reverted to last saved state.");
  };

  const addListItem = (key: "premiumFeatures" | "quranVerses" | "dailyHadiths" | "dailyReminders", value: string) => {
    if (!value.trim()) return;
    const currentList = form[key] as string[];
    updateField(key, [...currentList, value.trim()]);
  };

  const removeListItem = (key: "premiumFeatures" | "quranVerses" | "dailyHadiths" | "dailyReminders", index: number) => {
    const currentList = form[key] as string[];
    updateField(key, currentList.filter((_, idx) => idx !== index));
  };

  return (
    <div className="p-4 pb-16 space-y-6 max-w-lg mx-auto">
      {/* Top Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-2xl overflow-x-auto scrollbar-none snap-x snap-mandatory">
        {[
          { id: "branding", label: "Branding", icon: Palette },
          { id: "content", label: "Content", icon: FileText },
          { id: "sub-matches", label: "Matrimonial", icon: Sliders },
          { id: "contact", label: "Contact", icon: PhoneCall },
          { id: "banners", label: "Alerts", icon: Megaphone },
        ].map((tab) => {
          const ActiveIcon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer snap-start",
                active
                  ? "bg-background text-primary shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ActiveIcon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* BRANDING TAB */}
        {activeTab === "branding" && (
          <div className="relative space-y-6">
            {!isSuper && (
              <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-6 text-center border border-border">
                <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-3">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">Access Restricted</h3>
                <p className="text-xs text-muted-foreground max-w-xs mt-1 leading-relaxed">
                  Only Super Admins can customize the application logo, splash screens, names, and color palettes.
                </p>
              </div>
            )}

            <div className={cn("space-y-6", !isSuper && "opacity-35 pointer-events-none select-none")}>
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">App Branding & Names</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">App Name</label>
                    <input
                      type="text"
                      value={form.appName}
                      onChange={(e) => updateField("appName", e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Arabic Name</label>
                    <input
                      type="text"
                      value={form.appNameArabic}
                      onChange={(e) => updateField("appNameArabic", e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary text-right"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">App Tagline</label>
                  <input
                    type="text"
                    value={form.appTagline}
                    onChange={(e) => updateField("appTagline", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Theme Colors */}
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">Color Palette</h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Primary Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={form.primaryColor}
                        onChange={(e) => updateField("primaryColor", e.target.value)}
                        className="h-8 w-8 rounded-lg border border-border cursor-pointer shrink-0"
                      />
                      <span className="text-[10px] font-mono">{form.primaryColor}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Secondary Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={form.secondaryColor}
                        onChange={(e) => updateField("secondaryColor", e.target.value)}
                        className="h-8 w-8 rounded-lg border border-border cursor-pointer shrink-0"
                      />
                      <span className="text-[10px] font-mono">{form.secondaryColor}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Accent Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={form.accentColor}
                        onChange={(e) => updateField("accentColor", e.target.value)}
                        className="h-8 w-8 rounded-lg border border-border cursor-pointer shrink-0"
                      />
                      <span className="text-[10px] font-mono">{form.accentColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploads Section */}
              <div className="space-y-4">
                <h2 className="font-display text-lg font-bold text-foreground">Branding Images</h2>
                <CmsImageUploader
                  label="App Logo"
                  value={form.logoUrl}
                  onChange={(val) => updateField("logoUrl", val)}
                  disabled={!isSuper}
                />
                <CmsImageUploader
                  label="Splash Screen Logo"
                  value={form.splashLogoUrl}
                  onChange={(val) => updateField("splashLogoUrl", val)}
                  disabled={!isSuper}
                />
                <CmsImageUploader
                  label="Login Screen Logo"
                  value={form.loginLogoUrl}
                  onChange={(val) => updateField("loginLogoUrl", val)}
                  disabled={!isSuper}
                />
                <div className="grid grid-cols-2 gap-4">
                  <CmsImageUploader
                    label="Favicon"
                    value={form.faviconUrl}
                    onChange={(val) => updateField("faviconUrl", val)}
                    disabled={!isSuper}
                  />
                  <CmsImageUploader
                    label="PWA Maskable Icon"
                    value={form.pwaIconUrl}
                    onChange={(val) => updateField("pwaIconUrl", val)}
                    disabled={!isSuper}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Home Content */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Home Page Display</h2>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Banner Banner Title</label>
                <input
                  type="text"
                  value={form.homeBanner}
                  onChange={(e) => updateField("homeBanner", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Welcome Subtitle Text</label>
                <textarea
                  rows={2}
                  value={form.welcomeText}
                  onChange={(e) => updateField("welcomeText", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Hero BG Image URL</label>
                <input
                  type="text"
                  value={form.heroBgImage}
                  onChange={(e) => updateField("heroBgImage", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Auth Screens */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Auth Screens Notices</h2>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Welcome Screen Description</label>
                <textarea
                  rows={2}
                  value={form.welcomeScreenText}
                  onChange={(e) => updateField("welcomeScreenText", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Login Page Description</label>
                <textarea
                  rows={2}
                  value={form.loginScreenText}
                  onChange={(e) => updateField("loginScreenText", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Registration Terms Intro</label>
                <textarea
                  rows={2}
                  value={form.registerScreenText}
                  onChange={(e) => updateField("registerScreenText", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Terms & Conditions Full Text</label>
                <textarea
                  rows={3}
                  value={form.termsConditions}
                  onChange={(e) => updateField("termsConditions", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary font-mono text-[10px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Privacy Policy Full Text</label>
                <textarea
                  rows={3}
                  value={form.privacyPolicy}
                  onChange={(e) => updateField("privacyPolicy", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary font-mono text-[10px]"
                />
              </div>
            </div>

            {/* Islamic Content Banks */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Islamic Daily Quotes Bank</h2>
              <ListEditor
                title="Quran Verses Bank"
                items={form.quranVerses}
                onAdd={(val) => addListItem("quranVerses", val)}
                onRemove={(idx) => removeListItem("quranVerses", idx)}
              />
              <ListEditor
                title="Daily Hadiths Bank"
                items={form.dailyHadiths}
                onAdd={(val) => addListItem("dailyHadiths", val)}
                onRemove={(idx) => removeListItem("dailyHadiths", idx)}
              />
              <ListEditor
                title="Daily Reminders Bank"
                items={form.dailyReminders}
                onAdd={(val) => addListItem("dailyReminders", val)}
                onRemove={(idx) => removeListItem("dailyReminders", idx)}
              />
            </div>
          </div>
        )}

        {/* SUBSCRIPTION & MATCHES TAB */}
        {activeTab === "sub-matches" && (
          <div className="space-y-6">
            {/* Premium Settings */}
            <div className="space-y-4 rounded-2xl border border-border p-4 bg-surface shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-foreground">Premium Subscription</h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.premiumEnabled}
                    onChange={(e) => updateField("premiumEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className={cn("space-y-4", !form.premiumEnabled && "opacity-35 pointer-events-none")}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Currency Symbol</label>
                    <input
                      type="text"
                      value={form.currency}
                      onChange={(e) => updateField("currency", e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Plan Price</label>
                    <input
                      type="number"
                      value={form.premiumPrice}
                      onChange={(e) => updateField("premiumPrice", parseFloat(e.target.value) || 0)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Premium Description</label>
                  <input
                    type="text"
                    value={form.premiumDescription}
                    onChange={(e) => updateField("premiumDescription", e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>
                <ListEditor
                  title="Subscription Features List"
                  items={form.premiumFeatures}
                  onAdd={(val) => addListItem("premiumFeatures", val)}
                  onRemove={(idx) => removeListItem("premiumFeatures", idx)}
                />
              </div>
            </div>

            {/* Matrimonial Core */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Matching Core Settings</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Discovery Card Match Delay:</span>
                  <span className="text-primary font-mono">{form.matchDelay} Seconds</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={form.matchDelay}
                  onChange={(e) => updateField("matchDelay", parseInt(e.target.value))}
                  className="w-full accent-primary h-1 bg-border rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs font-semibold text-muted-foreground">Enable AI Matching Engine</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.aiMatchingEnabled}
                    onChange={(e) => updateField("aiMatchingEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3 pb-3">
                <span className="text-xs font-semibold text-muted-foreground">One Match At A Time System</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.oneMatchSystemEnabled}
                    onChange={(e) => updateField("oneMatchSystemEnabled", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              {/* Compatibility Weights */}
              <div className="space-y-3 border-t border-border pt-3">
                <span className="text-xs font-semibold text-muted-foreground block">Compatibility Scorer Weights</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: "sectWeight", label: "Sect" },
                    { key: "practiceWeight", label: "Practice" },
                    { key: "prayerWeight", label: "Prayer" },
                    { key: "cityWeight", label: "City" },
                    { key: "educationWeight", label: "Educ." },
                    { key: "ageWeight", label: "Age" },
                    { key: "interestsWeight", label: "Interests" },
                    { key: "maritalWeight", label: "Marital" },
                  ].map((w) => (
                    <div key={w.key} className="space-y-1">
                      <label className="text-[9px] uppercase font-bold text-muted-foreground">{w.label} %</label>
                      <input
                        type="number"
                        value={form[w.key as keyof CmsConfig] as number}
                        onChange={(e) => updateField(w.key as keyof CmsConfig, parseInt(e.target.value) || 0)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTACT & SOCIALS TAB */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Support Contact</h2>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Support Email</label>
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => updateField("supportEmail", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">WhatsApp Hotline</label>
                <input
                  type="text"
                  value={form.whatsappNumber}
                  onChange={(e) => updateField("whatsappNumber", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Office Address</label>
                <input
                  type="text"
                  value={form.officeAddress}
                  onChange={(e) => updateField("officeAddress", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Website Portal</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={(e) => updateField("website", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Social Links</h2>
              {[
                { key: "facebook", label: "Facebook Page" },
                { key: "instagram", label: "Instagram Feed" },
                { key: "youtube", label: "YouTube Channel" },
                { key: "twitter", label: "X (Twitter) Feed" },
                { key: "telegram", label: "Telegram Channel" },
              ].map((soc) => (
                <div key={soc.key} className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">{soc.label}</label>
                  <input
                    type="text"
                    value={form[soc.key as keyof CmsConfig] as string}
                    onChange={(e) => updateField(soc.key as keyof CmsConfig, e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground">Alerts & System Banners</h2>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Announcement Top Banner</label>
                <input
                  type="text"
                  value={form.announcementBanner}
                  onChange={(e) => updateField("announcementBanner", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Welcome Popup Notification</label>
                <textarea
                  rows={2}
                  value={form.popupMessage}
                  onChange={(e) => updateField("popupMessage", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Scheduled Maintenance Status</label>
                <textarea
                  rows={2}
                  value={form.maintenanceMessage}
                  onChange={(e) => updateField("maintenanceMessage", e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Action Row */}
      <div className="sticky bottom-4 z-10 flex gap-3 pt-4 border-t border-border bg-background/90 backdrop-blur-md">
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 rounded-full border border-border bg-card py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-all cursor-pointer shadow-soft"
        >
          Reset Form
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-full bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-all cursor-pointer shadow-soft flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}

function ListEditor({
  title,
  items,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    onAdd(newValue);
    setNewValue("");
  };

  return (
    <div className="rounded-xl border border-border p-3 space-y-3 bg-background">
      <span className="block text-xs font-semibold text-muted-foreground">{title}</span>
      <div className="flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Add new list item..."
          className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary bg-card"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-primary px-3 text-primary-foreground hover:bg-primary/90 flex items-center justify-center"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {items.length > 0 && (
        <ul className="divide-y divide-border border border-border rounded-lg max-h-40 overflow-y-auto bg-card">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
              <span className="truncate flex-1 text-muted-foreground font-medium">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
