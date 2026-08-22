/**
 * i18n Configuration — multi-language support for Seeds Season app.
 *
 * Languages: vi (Vietnamese), en (English), th (Thai), id (Indonesian)
 * Uses expo-localization for device locale detection + i18n-js for translations.
 */

import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

import vi from "./vi.json";
import en from "./en.json";
import th from "./th.json";
import id from "./id.json";

/** Supported language codes. */
export type LanguageCode = "vi" | "en" | "th" | "id";

/** Language display info for the settings switcher. */
export const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "th", label: "ภาษาไทย", flag: "🇹🇭" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
];

const i18n = new I18n(
  { vi, en, th, id },
  {
    defaultLocale: "en",
    enableFallback: true,
  },
);

/**
 * Detect initial locale from device settings.
 * Falls back to "vi" if unsupported.
 */
function detectLocale(): LanguageCode {
  const deviceLocale = Localization.getLocales?.()[0]?.languageCode ?? "vi";
  if (deviceLocale in { vi: 1, en: 1, th: 1, id: 1 }) {
    return deviceLocale as LanguageCode;
  }
  return "en";
}

i18n.locale = detectLocale();

/**
 * Get current language code.
 */
export function getCurrentLanguage(): LanguageCode {
  return i18n.locale as LanguageCode;
}

/**
 * Set language and persist choice.
 * Call this from the language switcher.
 */
export function setLanguage(lang: LanguageCode): void {
  i18n.locale = lang;
}

/**
 * Translate a key — shorthand for i18n.t().
 * Usage: t("home.title") → "🌱 Trồng Gì Hôm Nay" (vi) / "🌱 What to Grow Today" (en)
 */
export function t(key: string, options?: Record<string, string | number>): string {
  return i18n.t(key, options) as string;
}

export default i18n;
