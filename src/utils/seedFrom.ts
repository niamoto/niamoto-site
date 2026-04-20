// FNV-1a 32-bit hash -- simple, stable, sans dependance externe.
// Utilisé pour dériver une seed reproductible depuis (date, locale).
// Déterministe : mêmes inputs -> même hex string -> même u32 seed -> même composition p5.

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

export function fnv1a(str: string): number {
  let h = FNV_OFFSET;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, FNV_PRIME);
  }
  return h >>> 0; // force u32
}

/**
 * Calcule une seed 32-bit depuis une date + locale.
 * Granularité : jour (YYYY-MM-DD). Deux visiteurs le même jour + même locale
 * voient le même champ de spores.
 *
 * @example seedFrom(new Date("2026-04-17"), "en") // ex: 3636461135
 */
export function seedFrom(date: Date, locale: string): number {
  const ymd = date.toISOString().slice(0, 10); // "2026-04-17"
  return fnv1a(`${ymd}|${locale}`);
}

/**
 * Formate une seed en hex majuscule sur 8 caractères.
 * Utilisé dans le badge seed visible.
 */
export function formatSeed(seed: number): string {
  return seed.toString(16).toUpperCase().padStart(8, "0");
}
