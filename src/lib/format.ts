/** Peso amounts, grouped the way the studio writes them. */
export function peso(n: number): string {
  return n.toLocaleString("en-PH");
}

/** `₱1,299` */
export function pesoLabel(n: number): string {
  return `₱${peso(n)}`;
}

/** `04:32` — a mm:ss countdown from a millisecond remainder. */
export function countdown(remainingMs: number): string {
  const safe = Math.max(0, remainingMs);
  const mm = Math.floor(safe / 60_000);
  const ss = Math.floor((safe % 60_000) / 1000);
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}
