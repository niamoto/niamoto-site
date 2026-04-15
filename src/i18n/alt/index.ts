// Locale string loader for /alt/ variants.
// Each variant page imports its own copy module + this shared loader.

import sharedEn from "./shared.en";
import sharedFr from "./shared.fr";
import type { Locale } from "../config";

export const sharedStrings = {
  en: sharedEn,
  fr: sharedFr,
} as const;

export function getShared(locale: Locale) {
  return sharedStrings[locale];
}

export type SharedStrings = typeof sharedEn;
