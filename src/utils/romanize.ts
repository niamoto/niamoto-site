/**
 * Convertit un entier (1..3999) en chiffres romains.
 * Retourne une chaîne majuscule. Retombe sur la valeur en string pour 0 ou 4000+.
 *
 * @example romanize(17) // "XVII"
 * @example romanize(2026) // "MMXXVI"
 */
export function romanize(n: number): string {
  if (n <= 0 || n >= 4000 || !Number.isInteger(n)) return String(n);
  const map: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"],  [90, "XC"],  [50, "L"],  [40, "XL"],
    [10, "X"],   [9, "IX"],   [5, "V"],   [4, "IV"],
    [1, "I"],
  ];
  let result = "";
  let remainder = n;
  for (const [value, symbol] of map) {
    while (remainder >= value) {
      result += symbol;
      remainder -= value;
    }
  }
  return result;
}

/**
 * Convertit une Date en chaîne "jour · mois(romain) · année(romaine)".
 *
 * @example dateToRoman(new Date("2026-04-17")) // "XVII · IV · MMXXVI"
 */
export function dateToRoman(d: Date): string {
  return `${romanize(d.getDate())} \u00B7 ${romanize(d.getMonth() + 1)} \u00B7 ${romanize(d.getFullYear())}`;
}
