import { getPayload } from "payload";
import { cache } from "react";

import config from "@payload-config";

import type { LandingPage } from "@/payload-types";

import { fillTokens } from "./format";
import {
  PHOTOS,
  WORK,
  type WorkCategory,
  type WorkImage,
  type WorkItem,
} from "./photos";
import { HOLD_MINUTES, STUDIO } from "./studio";

/**
 * The read side of the CMS.
 *
 * SERVER ONLY — this reaches for the database. Import it from server components
 * and pass the results down as props.
 *
 * Every getter falls back to the hardcoded content in `src/lib/*` when the CMS
 * has nothing to say. That is load-bearing, not defensive padding:
 *
 *   - The site deploys today with no DATABASE_URI at all. Without a fallback,
 *     wiring these sections to Payload would break the build outright.
 *   - A studio owner who has not filled in a collection yet should see the
 *     launch content, not an empty page.
 *
 * So a missing database, an unreachable database and an empty collection all
 * degrade to the same safe result, and the page is never blank.
 */

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

let clientPromise: Promise<PayloadClient> | null = null;

/** Null when Payload cannot be reached — callers fall back rather than throw. */
async function client(): Promise<PayloadClient | null> {
  if (!process.env.DATABASE_URI) return null;
  try {
    clientPromise ??= getPayload({ config });
    return await clientPromise;
  } catch (error) {
    // A CMS outage must not take the marketing page down with it.
    clientPromise = null;
    console.warn("[content] Payload unavailable, using fallback content:", error);
    return null;
  }
}

/* ------------------------------------------------------------------ *
 * Portfolio
 * ------------------------------------------------------------------ */

export interface WorkEntry {
  key: string;
  caption: string;
  category: Exclude<WorkCategory, "all">;
  image: WorkImage;
  /** Degrees of scatter, so the grid reads as prints on a table. */
  tilt: number;
  offsetY: number;
  delay: number;
}

/** The scatter pattern is a layout property, not content — it repeats by index. */
const SCATTER = WORK.map((w) => ({ tilt: w.tilt, offsetY: w.offsetY, delay: w.delay }));

function fallbackWork(): WorkEntry[] {
  return WORK.map((item: WorkItem, i) => ({
    key: item.photo,
    caption: item.caption,
    category: item.category,
    image: { kind: "file", id: item.photo },
    ...SCATTER[i % SCATTER.length],
  }));
}

export async function getWork(): Promise<WorkEntry[]> {
  const payload = await client();
  if (!payload) return fallbackWork();

  try {
    const { docs } = await payload.find({
      collection: "portfolio",
      limit: 60,
      sort: ["order", "-createdAt"],
      depth: 1,
    });
    if (docs.length === 0) return fallbackWork();

    // "Pin this session to the front of the grid" — sort is stable, so pinned
    // rows keep their relative order and so does everything behind them.
    const pinned = [...docs].sort(
      (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
    );

    return pinned.flatMap((doc, i) => {
      // depth:1 populates the upload; a bare id means the image is missing.
      const media = typeof doc.image === "object" ? doc.image : null;
      const url = mediaUrl(media?.url);
      if (!media || !url) return [];
      return [
        {
          key: String(doc.id),
          caption: doc.caption ?? "",
          category: doc.category,
          image: { kind: "cms", url, alt: media.alt },
          ...SCATTER[i % SCATTER.length],
        } satisfies WorkEntry,
      ];
    });
  } catch (error) {
    console.warn("[content] portfolio query failed:", error);
    return fallbackWork();
  }
}

/* ------------------------------------------------------------------ *
 * Testimonials
 * ------------------------------------------------------------------ */

export interface TestimonialEntry {
  key: string;
  name: string;
  attribution: string;
  quote: string;
  rating: number;
}

const FALLBACK_TESTIMONIALS: TestimonialEntry[] = [
  {
    key: "kat",
    name: "KAT R.",
    attribution: "GRADUATION GOLD",
    quote:
      "Booked at 1 AM, shot on Saturday. The photos made my mom cry — the good kind.",
    rating: 5,
  },
  {
    key: "dizon",
    name: "THE DIZON FAMILY",
    attribution: "COLLECTIVE A",
    quote:
      "Our toddler ran laps the entire 15 minutes. The crew kept up. Somehow every keeper looks calm.",
    rating: 5,
  },
  {
    key: "migs",
    name: "MIGS A.",
    attribution: "SOLO",
    quote:
      "Sent the GCash from the jeep, got confirmed before I got home. ₱299 well spent.",
    rating: 5,
  },
];

export async function getTestimonials(): Promise<TestimonialEntry[]> {
  const payload = await client();
  if (!payload) return FALLBACK_TESTIMONIALS;

  try {
    const { docs } = await payload.find({
      collection: "testimonials",
      limit: 12,
      sort: ["order", "-createdAt"],
    });
    if (docs.length === 0) return FALLBACK_TESTIMONIALS;

    // The checkbox is a selection, not a publish gate: with nothing ticked the
    // studio sees everything it has written, and ticking any narrows the band to
    // those. That way an untouched collection behaves exactly as before.
    const ticked = docs.filter((doc) => doc.featured);
    const shown = ticked.length > 0 ? ticked : docs;

    return shown.map((doc) => ({
      key: String(doc.id),
      name: doc.name,
      attribution: doc.attribution ?? "",
      quote: doc.quote,
      rating: Math.min(5, Math.max(1, Math.round(doc.rating ?? 5))),
    }));
  } catch (error) {
    console.warn("[content] testimonials query failed:", error);
    return FALLBACK_TESTIMONIALS;
  }
}

/* ------------------------------------------------------------------ *
 * FAQs
 * ------------------------------------------------------------------ */

export interface FaqEntry {
  key: string;
  question: string;
  /** Plain text — the accordion and the FAQPage JSON-LD both need it. */
  answer: string;
}

const FALLBACK_FAQS: FaqEntry[] = [
  {
    key: "included",
    question: "What's included in every package?",
    answer:
      "Your backdrop color, unlimited props, an outfit change, enhanced images (10–20 depending on the package), and wallet-size prints. It's all listed on each package — no surprises at the counter.",
  },
  {
    key: "extras",
    question: "Can we add people, pets, or minutes?",
    answer:
      "Yes — extra person ₱150–200, pet ₱100, extra 10 minutes ₱100, extra backdrop color ₱100. Mention them in the notes when you book so the room is prepped.",
  },
  {
    key: "raws",
    question: "Can we get all the photos, not just the enhanced ones?",
    answer:
      "All raw photos are ₱250 for solo/duo and ₱300 for collective packages. Extra enhanced edits are ₱20 per photo if you can't pick just ten.",
  },
  {
    key: "refund",
    question: "Is the downpayment refundable?",
    answer:
      "No — it holds a real slot on the calendar. You get one free reschedule if you tell us at least 48 hours before your session.",
  },
  {
    key: "id",
    question: "Do you do ID photos and document printing?",
    answer:
      "Yes — ID packages are ₱150 (2×2, 1×1, and passport-size combos), laminating from ₱30, and document printing from ₱3 a page. Walk in any time we're open.",
  },
];

/**
 * Flattens a Lexical document to plain text.
 *
 * The FAQ answer is rich text in the CMS, but both consumers need a string:
 * the accordion body and — more importantly — the `FAQPage` JSON-LD, where
 * `acceptedAnswer.text` must be plain. Formatting is intentionally dropped;
 * the field's own admin description warns editors of that.
 */
function lexicalToText(node: unknown): string {
  if (node === null || typeof node !== "object") return "";
  const record = node as Record<string, unknown>;

  if (typeof record.text === "string") return record.text;

  const children = Array.isArray(record.children) ? record.children : null;
  const root = record.root as Record<string, unknown> | undefined;

  if (children) {
    const parts = children.map(lexicalToText).filter(Boolean);
    // Inline runs concatenate; sibling blocks get a blank line between them.
    const isBlockContainer = record.type === "root";
    return parts.join(isBlockContainer ? "\n\n" : "");
  }
  if (root) {
    const rootChildren = Array.isArray(root.children) ? root.children : [];
    return rootChildren.map(lexicalToText).filter(Boolean).join("\n\n");
  }
  return "";
}

export async function getFaqs(): Promise<FaqEntry[]> {
  const payload = await client();
  if (!payload) return FALLBACK_FAQS;

  try {
    const { docs } = await payload.find({
      collection: "faqs",
      limit: 30,
      sort: ["order", "createdAt"],
    });
    if (docs.length === 0) return FALLBACK_FAQS;

    return docs.map((doc) => ({
      key: String(doc.id),
      question: doc.question,
      answer: lexicalToText(doc.answer).trim(),
    }));
  } catch (error) {
    console.warn("[content] faqs query failed:", error);
    return FALLBACK_FAQS;
  }
}

/* ------------------------------------------------------------------ *
 * Site settings
 * ------------------------------------------------------------------ */

/** An uploaded wordmark. Intrinsic size travels with it so it never shifts layout. */
export interface SiteLogo {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  positioning: string;
  eyebrow: string;
  marquee: string;
  addressLines: string[];
  landmark: string;
  /** Printed in the footer line and used by the JSON-LD postal address. */
  locality: string;
  region: string;
  country: string;
  timezone: string;
  hours: { label: string; value: string }[];
  phone: string;
  phoneHref: string;
  email: string;
  socials: { label: string; href: string }[];
  mapEmbedUrl: string | null;
  /** Null keeps the wordmark that ships in `public/brand/`. */
  logo: SiteLogo | null;
}

function fallbackSite(): SiteInfo {
  return {
    name: STUDIO.name,
    tagline: STUDIO.tagline,
    positioning: STUDIO.positioning,
    eyebrow: STUDIO.eyebrow,
    marquee: STUDIO.marquee,
    addressLines: [...STUDIO.address.lines],
    landmark: STUDIO.address.landmark,
    locality: STUDIO.address.locality,
    region: STUDIO.address.region,
    country: STUDIO.address.country,
    timezone: STUDIO.timezone,
    hours: STUDIO.hours.map((h) => ({ label: h.label, value: h.value })),
    phone: STUDIO.contact.phone,
    phoneHref: STUDIO.contact.phoneHref,
    email: STUDIO.contact.email,
    socials: STUDIO.socials.map((s) => ({ label: s.label, href: s.href })),
    mapEmbedUrl: null,
    logo: null,
  };
}

/**
 * Only an https URL may reach an iframe src. A `javascript:` value typed into
 * site-settings would otherwise execute on this origin, so anything else is
 * treated as not-configured and the placeholder shows instead.
 */
function safeEmbedUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

/** A CMS string only wins when it is actually filled in. */
function pick(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

/** This app's own origin, when it is configured and parseable. */
const SITE_ORIGIN = (() => {
  const raw = process.env.NEXT_PUBLIC_SERVER_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    return null;
  }
})();

/**
 * Normalises an uploaded file's URL for `next/image`.
 *
 * Payload returns an *absolute* media URL whenever `serverURL` is set — which it
 * is, from NEXT_PUBLIC_SERVER_URL. `next/image` rejects an absolute URL whose
 * host is not listed in `images.remotePatterns`, and none are configured, so
 * every uploaded photo would 400 from the optimizer in production and throw in
 * dev. Our own uploads are not remote at all, so they are reduced back to a
 * path; a genuinely different host (a future object store) is passed through
 * untouched and does need a remotePatterns entry.
 */
function mediaUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  if (value.startsWith("/")) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  // An upload can only ever be http(s); anything else is not an image source.
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (SITE_ORIGIN && url.origin === SITE_ORIGIN) return `${url.pathname}${url.search}`;
  return url.href;
}

async function loadSiteInfo(): Promise<SiteInfo> {
  const base = fallbackSite();
  const payload = await client();
  if (!payload) return base;

  try {
    // Typed against the generated SiteSetting — the field names are checked at
    // compile time rather than guessed, which is how an earlier version of this
    // silently fell back forever.
    // depth:1 so the uploaded wordmark arrives with its url and intrinsic size.
    const doc = await payload.findGlobal({ slug: "site-settings", depth: 1 });

    const lines = (doc.address?.lines ?? []).filter((l) => l.trim().length > 0);
    const hours = (doc.hours ?? []).flatMap((row) =>
      row.label && row.value ? [{ label: row.label, value: row.value }] : [],
    );
    const socials = (doc.socials ?? []).flatMap((row) =>
      row.label ? [{ label: row.label, href: row.href ?? "#visit" }] : [],
    );

    const name = pick(doc.name, base.name);

    // Without an intrinsic size next/image cannot reserve the space, so a logo
    // missing either dimension is treated as no logo at all.
    const logoDoc = typeof doc.logo === "object" ? doc.logo : null;
    const logoSrc = mediaUrl(logoDoc?.url);
    const logo: SiteLogo | null =
      logoDoc && logoSrc && logoDoc.width && logoDoc.height
        ? {
            url: logoSrc,
            width: logoDoc.width,
            height: logoDoc.height,
            alt: logoDoc.alt?.trim() || name,
          }
        : null;

    return {
      name,
      tagline: pick(doc.tagline, base.tagline),
      positioning: pick(doc.positioning, base.positioning),
      eyebrow: pick(doc.eyebrow, base.eyebrow),
      marquee: pick(doc.marquee, base.marquee),
      addressLines: lines.length ? lines : base.addressLines,
      landmark: pick(doc.address?.landmark, base.landmark),
      locality: pick(doc.address?.locality, base.locality),
      region: pick(doc.address?.region, base.region),
      country: pick(doc.address?.country, base.country),
      timezone: pick(doc.timezone, base.timezone),
      hours: hours.length ? hours : base.hours,
      phone: pick(doc.contact?.phone, base.phone),
      phoneHref: pick(doc.contact?.phoneHref, base.phoneHref),
      email: pick(doc.contact?.email, base.email),
      socials: socials.length ? socials : base.socials,
      mapEmbedUrl: safeEmbedUrl(doc.mapEmbedUrl),
      logo,
    };
  } catch (error) {
    console.warn("[content] site-settings query failed:", error);
    return base;
  }
}

/**
 * Deduplicated per render: the layout reads this for the page title and the
 * local-business record, and the page reads it again for the header, the footer
 * and the Visit section. Without `cache` that is one document fetched three
 * times on every build.
 */
export const getSiteInfo = cache(loadSiteInfo);

/* ------------------------------------------------------------------ *
 * Landing page layout
 * ------------------------------------------------------------------ */

/**
 * One rendered section of the home page.
 *
 * The studio drags these into order in the admin, so the array order here *is*
 * the order on the page. The `( 0N )` numerals are therefore counted from that
 * order rather than written down — otherwise moving a section would leave the
 * numbering lying about where the reader is.
 */
export type Section =
  | {
      kind: "hero";
      key: string;
      headlineLine1: string;
      headlineAccentWord: string;
      headlineLine2: string;
      /** Null falls back to the positioning line from site settings. */
      subParagraph: string | null;
      primaryCtaLabel: string;
      secondaryCtaLabel: string;
    }
  | {
      kind: "packages";
      key: string;
      numeral: string;
      heading: string;
      note: string;
      polaroidCaption: string;
      backdropHeading: string;
      /** One entry per printed line. */
      backdropNote: string[];
    }
  | { kind: "portfolio"; key: string; numeral: string; heading: string; note: string }
  | {
      kind: "howItWorks";
      key: string;
      numeral: string;
      heading: string;
      note: string;
      photoCaption: string;
      steps: { key: string; numeral: string; title: string; body: string }[];
    }
  | { kind: "testimonials"; key: string; heading: string; note: string }
  | { kind: "faq"; key: string; numeral: string; heading: string; note: string }
  | { kind: "ctaBand"; key: string; headline: string; ctaLabel: string; reassurance: string }
  | { kind: "visit"; key: string; numeral: string; heading: string; note: string };

export type SectionKind = Section["kind"];

type LayoutBlock = NonNullable<LandingPage["layout"]>[number];

/**
 * Anchors for the sections the header and footer link to. A section the studio
 * removes takes its nav entry with it, so the chrome can never point at an
 * anchor that is no longer on the page.
 */
export const SECTION_ANCHORS = {
  packages: { id: "packages", label: "PACKAGES" },
  portfolio: { id: "work", label: "WORK" },
  howItWorks: { id: "how", label: "HOW IT WORKS" },
  faq: { id: "faq", label: "FAQ" },
  visit: { id: "visit", label: "VISIT" },
} as const satisfies Partial<Record<SectionKind, { id: string; label: string }>>;

/** The page as designed — also the shape the seed writes into the CMS. */
export const DEFAULT_SECTION_ORDER: readonly SectionKind[] = [
  "hero",
  "packages",
  "portfolio",
  "howItWorks",
  "testimonials",
  "faq",
  "ctaBand",
  "visit",
];

/**
 * The launch copy, one entry per block type.
 *
 * These are the strings the design shipped with. They are the fallback when the
 * CMS is unreachable *and* the per-field fallback when an editor clears a box,
 * so a blank field reverts to the design rather than leaving a hole in the page.
 */
export const SECTION_DEFAULTS = {
  hero: {
    headlineLine1: "15 MINUTES.",
    headlineAccentWord: "UNLIMITED",
    headlineLine2: "SHOTS.",
    primaryCtaLabel: "BOOK A SLOT",
    secondaryCtaLabel: "SEE PACKAGES ↓",
  },
  packages: {
    heading: "PACKAGES",
    note: "THE STUDIO'S PUBLISHED PRICES — WHAT YOU SEE IS WHAT YOU PAY",
    polaroidCaption: "unlimited shots, keep your favorites",
    backdropHeading: "BACKDROP COLORS",
    backdropNote: "ONE FREE WITH EVERY PACKAGE\nEXTRA COLOR +₱100",
  },
  portfolio: { heading: "RECENT WORK", note: "REAL SESSIONS, LATEST FIRST" },
  howItWorks: {
    heading: "HOW IT WORKS",
    note: "",
    photoCaption: "the room, between sessions",
    steps: [
      {
        title: "Book a slot",
        body: "Pick a package and a time, then send the downpayment by GCash or Maya. Your slot is held for {holdMinutes} minutes while you pay — no account, no DMs.",
      },
      {
        title: "Shoot — unlimited frames",
        body: "Your backdrop color is set, props and spotlight are in the room, and there's time for an outfit change. Staff on hand if you want direction.",
      },
      {
        title: "Pick + print",
        body: "Choose your enhanced images before you leave; wallet-size prints are included and bigger prints and frames start at ₱99. Raws available for ₱250–300.",
      },
    ],
  },
  testimonials: { heading: "", note: "" },
  faq: { heading: "ASK US ANYTHING", note: "THE {count} THAT COME UP MOST" },
  ctaBand: {
    headline: "THE CALENDAR IS HONEST — IF IT SHOWS A SLOT, IT'S YOURS.",
    ctaLabel: "BOOK A SLOT",
    reassurance: "HELD {holdMinutes} MIN WHILE YOU PAY · NO ACCOUNT NEEDED",
  },
  visit: { heading: "VISIT", note: "" },
} as const;

/**
 * Business rules that appear mid-sentence. Substituted here rather than typed
 * into the copy, so changing the hold window cannot leave the page contradicting
 * the wizard. `{count}` is deliberately not in this map — only the FAQ section
 * knows how many questions came back, so it fills that one in itself.
 */
const LAYOUT_TOKENS = { holdMinutes: HOLD_MINUTES };

/** A CMS string when it is filled in, the design's own words otherwise. */
function copyField(value: unknown, fallback: string): string {
  return fillTokens(pick(value, fallback), LAYOUT_TOKENS);
}

/** The block's own fields, or nothing at all when building the fallback layout. */
function fieldsOf<K extends SectionKind>(
  block: LayoutBlock | null,
  kind: K,
): Partial<Extract<LayoutBlock, { blockType: K }>> {
  return block?.blockType === kind ? (block as Extract<LayoutBlock, { blockType: K }>) : {};
}

function toSection(kind: SectionKind, block: LayoutBlock | null, key: string): Section {
  switch (kind) {
    case "hero": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.hero;
      return {
        kind,
        key,
        headlineLine1: copyField(f.headlineLine1, d.headlineLine1),
        headlineAccentWord: copyField(f.headlineAccentWord, d.headlineAccentWord),
        headlineLine2: copyField(f.headlineLine2, d.headlineLine2),
        // Blank means "use the studio positioning line", not "print nothing".
        subParagraph:
          typeof f.subParagraph === "string" && f.subParagraph.trim()
            ? fillTokens(f.subParagraph, LAYOUT_TOKENS)
            : null,
        primaryCtaLabel: copyField(f.primaryCtaLabel, d.primaryCtaLabel),
        secondaryCtaLabel: copyField(f.secondaryCtaLabel, d.secondaryCtaLabel),
      };
    }
    case "packages": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.packages;
      return {
        kind,
        key,
        numeral: "",
        heading: copyField(f.heading, d.heading),
        note: copyField(f.note, d.note),
        polaroidCaption: copyField(f.polaroidCaption, d.polaroidCaption),
        backdropHeading: copyField(f.backdropHeading, d.backdropHeading),
        backdropNote: copyField(f.backdropNote, d.backdropNote)
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      };
    }
    case "portfolio": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.portfolio;
      return {
        kind,
        key,
        numeral: "",
        heading: copyField(f.heading, d.heading),
        note: copyField(f.note, d.note),
      };
    }
    case "howItWorks": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.howItWorks;
      const edited = (f.steps ?? []).flatMap((step) =>
        step.title?.trim() && step.body?.trim() ? [{ title: step.title, body: step.body }] : [],
      );
      const steps = edited.length ? edited : d.steps;
      return {
        kind,
        key,
        numeral: "",
        heading: copyField(f.heading, d.heading),
        note: copyField(f.note, d.note),
        photoCaption: copyField(f.photoCaption, d.photoCaption),
        steps: steps.map((step, i) => ({
          key: `${key}-step-${i}`,
          // Numbered by position, so dragging a step renumbers the column.
          numeral: String(i + 1).padStart(2, "0"),
          title: fillTokens(step.title, LAYOUT_TOKENS),
          body: fillTokens(step.body, LAYOUT_TOKENS),
        })),
      };
    }
    case "testimonials": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.testimonials;
      return {
        kind,
        key,
        heading: copyField(f.heading, d.heading),
        note: copyField(f.note, d.note),
      };
    }
    case "faq": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.faq;
      return {
        kind,
        key,
        numeral: "",
        heading: copyField(f.heading, d.heading),
        note: copyField(f.note, d.note),
      };
    }
    case "ctaBand": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.ctaBand;
      return {
        kind,
        key,
        headline: copyField(f.headline, d.headline),
        ctaLabel: copyField(f.ctaLabel, d.ctaLabel),
        reassurance: copyField(f.reassurance, d.reassurance),
      };
    }
    case "visit": {
      const f = fieldsOf(block, kind);
      const d = SECTION_DEFAULTS.visit;
      return {
        kind,
        key,
        numeral: "",
        heading: copyField(f.heading, d.heading),
        note: copyField(f.note, d.note),
      };
    }
  }
}

/** Stamps `01`, `02`, … onto the numeral-bearing sections in page order. */
function numberSections(sections: Section[]): Section[] {
  let n = 0;
  return sections.map((section) =>
    "numeral" in section ? { ...section, numeral: String(++n).padStart(2, "0") } : section,
  );
}

function fallbackLayout(): Section[] {
  return numberSections(
    DEFAULT_SECTION_ORDER.map((kind) => toSection(kind, null, `default-${kind}`)),
  );
}

export async function getLayout(): Promise<Section[]> {
  const payload = await client();
  if (!payload) return fallbackLayout();

  try {
    const doc = await payload.findGlobal({ slug: "landing-page", depth: 0 });
    const blocks = doc.layout ?? [];
    if (blocks.length === 0) return fallbackLayout();

    // One of each kind. Two of the same section would put a duplicate `id` in
    // the document, and two FAQ blocks would emit two FAQPage graphs — which
    // search engines read as a broken page rather than a longer one.
    const seen = new Set<SectionKind>();
    const sections: Section[] = [];
    for (const [i, block] of blocks.entries()) {
      if (seen.has(block.blockType)) continue;
      seen.add(block.blockType);
      sections.push(toSection(block.blockType, block, block.id ?? `${block.blockType}-${i}`));
    }
    return sections.length ? numberSections(sections) : fallbackLayout();
  } catch (error) {
    console.warn("[content] landing-page query failed:", error);
    return fallbackLayout();
  }
}

/* ------------------------------------------------------------------ *
 * Per-package marketing copy
 * ------------------------------------------------------------------ */

/**
 * The editorial layer around a bookable package.
 *
 * Price, duration and downpayment are never here — those come from the products
 * API so the page cannot disagree with the till. An empty list is the normal
 * state before the studio writes anything, and leaves the design's own photos
 * and row labels in place.
 */
export interface ServiceCopy {
  productId: string;
  /** Overrides the package name from the products API when set. */
  title: string | null;
  inclusions: string[];
  cover: WorkImage | null;
  featured: boolean;
  order: number | null;
}

export async function getServiceCopy(): Promise<ServiceCopy[]> {
  const payload = await client();
  if (!payload) return [];

  try {
    const { docs } = await payload.find({
      collection: "services-content",
      limit: 60,
      sort: ["order", "productId"],
      depth: 1,
    });

    return docs.map((doc) => {
      // depth:1 populates the upload; a bare id means the image is missing.
      const media = typeof doc.coverImage === "object" ? doc.coverImage : null;
      const cover = mediaUrl(media?.url);
      return {
        productId: doc.productId,
        title: doc.title?.trim() ? doc.title.trim() : null,
        inclusions: (doc.inclusions ?? []).flatMap((row) =>
          row.item?.trim() ? [row.item.trim()] : [],
        ),
        cover: media && cover ? { kind: "cms", url: cover, alt: media.alt } : null,
        featured: doc.featured ?? false,
        order: doc.order ?? null,
      } satisfies ServiceCopy;
    });
  } catch (error) {
    console.warn("[content] services-content query failed:", error);
    return [];
  }
}


/** Re-exported so sections can keep their alt text when a slot is file-based. */
export { PHOTOS };
export type { WorkImage };
