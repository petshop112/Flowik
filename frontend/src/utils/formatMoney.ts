export const formatMoney = (valor: number): string =>
  valor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
