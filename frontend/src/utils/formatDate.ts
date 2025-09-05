export function formatDate(d?: string) {
  if (!d) return '00/00/0000';
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? '00/00/0000' : dt.toLocaleDateString('es-AR');
}
