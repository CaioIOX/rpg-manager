"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import pt, { type LocaleDict } from "./locales/pt";
import en from "./locales/en";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Locale = "pt" | "en";

const LOCALES: Record<Locale, LocaleDict> = { pt, en };
const STORAGE_KEY = "codexlore-locale";

// ─── Detect browser language ──────────────────────────────────────────────────

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "pt";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("pt")) return "pt";
  return "en";
}

// ─── Non-React helper (for hooks / toast) ─────────────────────────────────────

/**
 * Read the locale dictionary without React context.
 * Useful inside mutation hooks that use `toast()` outside components.
 */
export function getLocaleDict(): LocaleDict {
  if (typeof window === "undefined") return pt;
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  return LOCALES[stored ?? detectBrowserLocale()];
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: LocaleDict;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "pt",
  setLocale: () => {},
  t: pt,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleRaw] = useState<Locale>("pt");

  // On mount: read from localStorage or detect from browser
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    setLocaleRaw(stored ?? detectBrowserLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleRaw(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: LOCALES[locale] }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLocale() {
  return useContext(LocaleContext);
}
