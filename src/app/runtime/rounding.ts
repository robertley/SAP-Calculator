export function roundUpToCents(num: number): number {
  return Math.ceil(num * 100) / 100;
}
