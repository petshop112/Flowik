export function debtColor(days?: number) {
  const n = Number(days ?? 0);
  if (n <= 0) return 'bg-[#CDFEF2]';
  if (n > 60) return 'bg-[#F82254]';
  if (n >= 30) return 'bg-[#FE9B38]';
  return '#CDFEF2';
}
