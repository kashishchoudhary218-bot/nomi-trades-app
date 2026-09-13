// en-IN style digit grouping (lakh/crore), implemented manually so it doesn't
// depend on the JS engine's ICU/Intl locale data being present on-device.
function indianGroup(intDigits: string): string {
  if (intDigits.length <= 3) return intDigits;
  const last3 = intDigits.slice(-3);
  const rest = intDigits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return rest + ',' + last3;
}

/** Signed, 2-decimal, comma-grouped amount — e.g. -1,23,456.78 */
export function fmt(n: number): string {
  const sign = n < 0 ? '-' : '';
  const [intPart, decPart] = Math.abs(n).toFixed(2).split('.');
  return sign + indianGroup(intPart) + '.' + decPart;
}

/** Signed, rounded, comma-grouped integer amount — e.g. -1,23,457 */
export function fmt0(n: number): string {
  const sign = n < 0 ? '-' : '';
  return sign + indianGroup(String(Math.round(Math.abs(n))));
}
