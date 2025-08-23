//convertir cualquier valor en un numero para calcular
export function toNumber(v?: number | string) {
  const n = typeof v === 'string' ? Number(v.replace(/[^\d.-]/g, '')) : (v ?? 0);
  return Number.isFinite(n) ? Number(n) : 0;
}

export function currencyPipe(
  v?: number | string,
  locale: string = 'es-AR',
  currency: string = 'ARS'
) {
  const n = toNumber(v);
  return n.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
}
