import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type Lang = "en" | "ur" | "ru";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
};

const MisaqCtx = createContext<Ctx>({ theme: "light", setTheme: () => {}, lang: "en", setLang: () => {} });

export const useMisaq = () => useContext(MisaqCtx);

export function MisaqProviders({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const t = (typeof window !== "undefined" && (localStorage.getItem("misaq-theme") as Theme)) || "light";
    const l = (typeof window !== "undefined" && (localStorage.getItem("misaq-lang") as Lang)) || "en";
    setThemeState(t);
    setLangState(l);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    if (typeof window !== "undefined") localStorage.setItem("misaq-theme", t);
  };
  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("misaq-lang", l);
  };

  return <MisaqCtx.Provider value={{ theme, setTheme, lang, setLang }}>{children}</MisaqCtx.Provider>;
}
