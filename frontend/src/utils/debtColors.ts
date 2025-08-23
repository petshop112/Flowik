export function debtColor(days?: number) {
  const n = Number(days ?? 0);
  if (n <= 0) return 'bg-gray-300';
  if (n > 60) return 'bg-rose-500';
  if (n >= 30) return 'bg-orange-400';
  return 'bg-teal-300';
}
