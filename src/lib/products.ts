/**
 * The studio's published packages.
 *
 * Prices, durations and downpayments are the studio's own published rates.
 * In the shipped architecture these are read live from the bookings API
 * (`GET /public/v1/products`) so the site can never disagree with the till —
 * see studio-site-spec.md §3. The shape below is the contract that swap has
 * to satisfy; the marketing copy that wraps it lives in `services-content`.
 */

export type ProductGroup = "orig" | "bday" | "grad" | "id";

export interface Product {
  id: string;
  group: ProductGroup;
  /** Display name, set in the display face. */
  name: string;
  /** Headcount blurb — "3–4 PAX", "PER HEAD". */
  pax: string;
  /** Default headcount when this package is picked. */
  basePax: number;
  /** Largest headcount the package allows. */
  maxPax: number;
  /** Session length blurb — "15 MIN", "20+20 MIN". */
  duration: string;
  price: number;
  /** Downpayment that holds the slot. */
  downpayment: number;
  /** Graduation packages are priced per head, so price scales with headcount. */
  perHead?: boolean;
}

export const PRODUCTS: readonly Product[] = [
  { id: "solo", group: "orig", name: "SOLO", pax: "1 PAX", basePax: 1, maxPax: 1, duration: "15 MIN", price: 299, downpayment: 100 },
  { id: "duo", group: "orig", name: "DUO", pax: "2 PAX", basePax: 2, maxPax: 2, duration: "15 MIN", price: 399, downpayment: 100 },
  { id: "colA", group: "orig", name: "COLLECTIVE A", pax: "3–4 PAX", basePax: 3, maxPax: 4, duration: "15 MIN", price: 599, downpayment: 200 },
  { id: "colB", group: "orig", name: "COLLECTIVE B", pax: "5–6 PAX", basePax: 5, maxPax: 6, duration: "15 MIN", price: 799, downpayment: 200 },
  { id: "colC", group: "orig", name: "COLLECTIVE C", pax: "7–8 PAX", basePax: 7, maxPax: 8, duration: "15 MIN", price: 999, downpayment: 300 },
  { id: "colD", group: "orig", name: "COLLECTIVE D", pax: "9–10 PAX", basePax: 9, maxPax: 10, duration: "30 MIN", price: 1299, downpayment: 300 },
  { id: "bdayA", group: "bday", name: "BIRTHDAY A", pax: "1 PAX", basePax: 1, maxPax: 1, duration: "20 MIN", price: 599, downpayment: 200 },
  { id: "bdayB", group: "bday", name: "BIRTHDAY B", pax: "1 PAX", basePax: 1, maxPax: 1, duration: "25 MIN", price: 849, downpayment: 200 },
  { id: "kids", group: "bday", name: "KIDS THEME", pax: "UP TO 4 PAX", basePax: 1, maxPax: 4, duration: "30 MIN", price: 1799, downpayment: 500 },
  { id: "gradS", group: "grad", name: "GRAD SILVER", pax: "PER HEAD", basePax: 1, maxPax: 12, duration: "15 MIN", price: 499, downpayment: 200, perHead: true },
  { id: "gradG", group: "grad", name: "GRAD GOLD", pax: "PER HEAD", basePax: 1, maxPax: 12, duration: "20+20 MIN", price: 999, downpayment: 200, perHead: true },
  { id: "gradP", group: "grad", name: "GRAD PLATINUM", pax: "PER HEAD", basePax: 1, maxPax: 12, duration: "20+20 MIN", price: 1299, downpayment: 300, perHead: true },
  { id: "idpkg", group: "id", name: "ID PACKAGE", pax: "1 PAX", basePax: 1, maxPax: 1, duration: "10 MIN", price: 150, downpayment: 50 },
];

export const PRODUCTS_BY_ID: ReadonlyMap<string, Product> = new Map(
  PRODUCTS.map((p) => [p.id, p]),
);

export function getProduct(id: string | null): Product | null {
  return id ? (PRODUCTS_BY_ID.get(id) ?? null) : null;
}

export function productsIn(group: ProductGroup): Product[] {
  return PRODUCTS.filter((p) => p.group === group);
}

/** Graduation packages multiply by headcount; everything else is flat. */
export function priceFor(product: Product, headcount: number): number {
  return product.perHead ? product.price * headcount : product.price;
}

/** Group headings used by step 1 of the wizard. */
export const GROUP_LABELS: Record<ProductGroup, string> = {
  orig: "ORIGINAL PACKAGES",
  bday: "BIRTHDAY",
  grad: "GRADUATION — PER HEAD",
  id: "ID + PASSPORT",
};

/** Copy shown under the ORIGINAL PACKAGES table on the landing page. */
export const ORIGINAL_INCLUSIONS =
  "EVERY PACKAGE — 15-MIN UNLIMITED SHOOT (COLLECTIVE D: 30) · FREE 10 ENHANCED IMAGES · OUTFIT CHANGE · FREE 1 BACKDROP COLOR · UNLIMITED PROPS · FREE 4 WALLET SIZE";

export const ORIGINAL_EXTRAS =
  "EXTRA PERSON ₱150–200 · EXTRA 10 MINS ₱100 · PET ₱100";
