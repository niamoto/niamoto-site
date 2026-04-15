// Locale config for /alt/ variants.
// Mirrors astro.config.mjs i18n block.

export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

export const localeShort: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
};
