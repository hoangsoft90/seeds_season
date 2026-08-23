/**
 * i18n Configuration — multi-language support for Seeds Season app.
 *
 * Languages: vi (Vietnamese), en (English), th (Thai), id (Indonesian)
 * Uses expo-localization for device locale detection + i18n-js for translations.
 * Language choice is persisted with AsyncStorage so it survives app restarts.
 */

import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const STORAGE_KEY = "@seeds_season/language";

const i18n = new I18n(
  { vi, en, th, id },
  {
    defaultLocale: "en",
    enableFallback: true,
  },
);

// ─── Event emitter for language change (tab layout re-renders on change) ───

type Listener = () => void;
const listeners: Listener[] = [];

/** Subscribe to language changes. Returns unsubscribe function. */
export function onLanguageChange(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function notifyListeners() {
  for (const fn of listeners) fn();
}

// ─── Detect initial locale from device ───

function detectLocale(): LanguageCode {
  const deviceLocale = Localization.getLocales?.()[0]?.languageCode ?? "vi";
  if (deviceLocale in { vi: 1, en: 1, th: 1, id: 1 }) {
    return deviceLocale as LanguageCode;
  }
  return "en";
}

/** Set locale immediately (used during hydration from AsyncStorage). */
i18n.locale = detectLocale();

/**
 * Hydrate locale from AsyncStorage on app start.
 * Call once in _layout.tsx or wherever i18n is first imported.
 */
let _hydrated = false;
export async function hydrateLanguage(): Promise<void> {
  if (_hydrated) return;
  _hydrated = true;
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved && (saved === "vi" || saved === "en" || saved === "th" || saved === "id")) {
      i18n.locale = saved;
      notifyListeners();
    }
  } catch {
    // AsyncStorage may fail in tests; ignore silently
  }
}

// Run hydration eagerly (fire-and-forget — it's async but the sync part
// already set a reasonable default via detectLocale).
hydrateLanguage();

// ─── Public API ───

/**
 * Get current language code.
 */
export function getCurrentLanguage(): LanguageCode {
  return i18n.locale as LanguageCode;
}

/**
 * Set language, persist choice, and notify all listeners so tabs re-render.
 */
export async function setLanguage(lang: LanguageCode): Promise<void> {
  i18n.locale = lang;
  notifyListeners();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Ignore persist errors
  }
}

/**
 * Translate a key — shorthand for i18n.t().
 */
export function t(key: string, options?: Record<string, string | number>): string {
  return i18n.t(key, options) as string;
}

export default i18n;
