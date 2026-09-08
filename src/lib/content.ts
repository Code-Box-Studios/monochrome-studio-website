import { getPayload } from "payload";

import config from "@payload-config";

import {
  PHOTOS,
  WORK,
  type WorkCategory,
  type WorkImage,
  type WorkItem,
} from "./photos";
import { STUDIO } from "./studio";

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

    return docs.flatMap((doc, i) => {
      // depth:1 populates the upload; a bare id means the image is missing.
      const media = typeof doc.image === "object" ? doc.image : null;
      if (!media?.url) return [];
      return [
        {
          key: String(doc.id),
          caption: doc.caption ?? "",
          category: doc.category,
          image: { kind: "cms", url: media.url, alt: media.alt },
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

    return docs.map((doc) => ({
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

export interface SiteInfo {
  name: string;
  tagline: string;
  positioning: string;
  eyebrow: string;
  marquee: string;
  addressLines: string[];
  landmark: string;
  hours: { label: string; value: string }[];
  phone: string;
  phoneHref: string;
  email: string;
  socials: { label: string; href: string }[];
  mapEmbedUrl: string | null;
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
    hours: STUDIO.hours.map((h) => ({ label: h.label, value: h.value })),
    phone: STUDIO.contact.phone,
    phoneHref: STUDIO.contact.phoneHref,
    email: STUDIO.contact.email,
    socials: STUDIO.socials.map((s) => ({ label: s.label, href: s.href })),
    mapEmbedUrl: null,
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

export async function getSiteInfo(): Promise<SiteInfo> {
  const base = fallbackSite();
  const payload = await client();
  if (!payload) return base;

  try {
    // Typed against the generated SiteSetting — the field names are checked at
    // compile time rather than guessed, which is how an earlier version of this
    // silently fell back forever.
    const doc = await payload.findGlobal({ slug: "site-settings", depth: 0 });

    const lines = (doc.address?.lines ?? []).filter((l) => l.trim().length > 0);
    const hours = (doc.hours ?? []).flatMap((row) =>
      row.label && row.value ? [{ label: row.label, value: row.value }] : [],
    );
    const socials = (doc.socials ?? []).flatMap((row) =>
      row.label ? [{ label: row.label, href: row.href ?? "#visit" }] : [],
    );

    return {
      name: pick(doc.name, base.name),
      tagline: pick(doc.tagline, base.tagline),
      positioning: pick(doc.positioning, base.positioning),
      eyebrow: pick(doc.eyebrow, base.eyebrow),
      marquee: pick(doc.marquee, base.marquee),
      addressLines: lines.length ? lines : base.addressLines,
      landmark: pick(doc.address?.landmark, base.landmark),
      hours: hours.length ? hours : base.hours,
      phone: pick(doc.contact?.phone, base.phone),
      phoneHref: pick(doc.contact?.phoneHref, base.phoneHref),
      email: pick(doc.contact?.email, base.email),
      socials: socials.length ? socials : base.socials,
      mapEmbedUrl: safeEmbedUrl(doc.mapEmbedUrl),
    };
  } catch (error) {
    console.warn("[content] site-settings query failed:", error);
    return base;
  }
}

/** Re-exported so sections can keep their alt text when a slot is file-based. */
export { PHOTOS };
export type { WorkImage };
