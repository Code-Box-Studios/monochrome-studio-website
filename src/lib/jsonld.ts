/**
 * Serialises structured data for a `<script type="application/ld+json">` tag.
 *
 * `JSON.stringify` does not escape `<`, and everything on this site is now
 * editor-supplied. A value containing `</script>` would close the tag early and
 * inject whatever followed as markup. Escaping the angle bracket keeps it inert
 * and still valid JSON — `<` parses back to `<`.
 *
 * The escape is easy to write as a no-op: `"<"` in a TypeScript source file
 * *is* the `<` character. The replacement below is a two-character sequence — a
 * backslash and a `u` — which is what JSON needs to see.
 */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
