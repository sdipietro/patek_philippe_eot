// Spencer (1971) approximation, accurate to ~±30 seconds.
// B = 2π(N − 81) / 365; EoT = 9.87sin(2B) − 7.53cos(B) − 1.5sin(B) in minutes.
// Positive = sundial runs ahead of clock; negative = clock runs ahead of sundial.

export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function equationOfTime(date: Date): { eot: number; decl: number; N: number } {
  const N = dayOfYear(date);
  const B = (2 * Math.PI * (N - 81)) / 365;
  const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const decl = 23.45 * Math.sin(B);
  return { eot, decl, N };
}

export function formatEoT(min: number): string {
  const sign = min >= 0 ? '+' : '−';
  const abs = Math.abs(min);
  const m = Math.floor(abs);
  const s = Math.round((abs - m) * 60);
  return `${sign}${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export function buildEoTCurvePoints(
  width: number,
  height: number,
  padding: number,
): { points: [number, number][]; zeroY: number } {
  const minE = -18;
  const maxE = 18;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const toY = (eot: number) => padding + ((maxE - eot) / (maxE - minE)) * innerH;
  const points: [number, number][] = [];
  // Use a fixed reference year for the curve shape (leap years don't matter at this precision)
  for (let n = 1; n <= 365; n++) {
    const date = new Date(2025, 0, 1);
    date.setDate(n);
    const { eot } = equationOfTime(date);
    const x = padding + (n - 1) * (innerW / 364);
    points.push([x, toY(eot)]);
  }
  return { points, zeroY: toY(0) };
}
