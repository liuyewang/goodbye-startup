"use client";

import { en, type Translations } from "./en";
import { zh } from "./zh";

export type Language = "en" | "zh";

const LANGUAGE_KEY = "gs_language";

const translations: Record<Language, Translations> = {
  en,
  zh,
};

/**
 * Get current language from localStorage or browser
 */
export function getLanguage(): Language {
  if (typeof window === "undefined") return "en";

  // Check localStorage first
  const stored = localStorage.getItem(LANGUAGE_KEY);
  if (stored === "en" || stored === "zh") {
    return stored;
  }

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith("zh")) {
    return "zh";
  }

  return "en";
}

/**
 * Set language and save to localStorage
 */
export function setLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LANGUAGE_KEY, lang);
}

/**
 * Get translations for current language
 */
export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.en;
}

/**
 * Simple hook-like function for client components
 * Returns [language, setLanguage, t]
 */
export function useI18n(): {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
} {
  const language = getLanguage();
  const t = getTranslations(language);

  return {
    language,
    setLanguage: (lang: Language) => {
      setLanguage(lang);
      window.location.reload();
    },
    t,
  };
}
