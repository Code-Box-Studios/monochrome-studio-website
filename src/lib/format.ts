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

/**
 * Fills `{name}` placeholders in editor-written copy.
 *
 * Business rules that appear inside sentences — the hold window, the number of
 * questions — must not be retyped by hand, or the copy goes stale the moment
 * the rule changes. The admin field descriptions tell editors which tokens a
 * field understands; an unknown token is left alone rather than blanked, so a
 * typo is visible instead of silently eating text.
 */
export function fillTokens(text: string, tokens: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in tokens ? String(tokens[name]) : match,
  );
}
