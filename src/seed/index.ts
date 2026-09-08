import { getPayload } from "payload";

import config from "@payload-config";
import { WORK } from "@/lib/photos";
import { STUDIO } from "@/lib/studio";

/**
 * Seeds the CMS with the content the site currently ships hardcoded.
 *
 * Why bother, when the content layer already falls back to those same values?
 * Because a studio owner opening an empty admin has nothing to edit — they
 * cannot tell which words on the page are theirs to change. Seeding turns the
 * fallback into an editable starting point.
 *
 * Idempotent: it skips any collection that already has documents, so running it
 * twice never duplicates and never overwrites something the studio has edited.
 *
 *   pnpm seed
 */

const TESTIMONIALS = [
  {
    name: "KAT R.",
    attribution: "GRADUATION GOLD",
    quote: "Booked at 1 AM, shot on Saturday. The photos made my mom cry — the good kind.",
    rating: 5,
    order: 1,
  },
  {
    name: "THE DIZON FAMILY",
    attribution: "COLLECTIVE A",
    quote:
      "Our toddler ran laps the entire 15 minutes. The crew kept up. Somehow every keeper looks calm.",
    rating: 5,
    order: 2,
  },
  {
    name: "MIGS A.",
    attribution: "SOLO",
    quote: "Sent the GCash from the jeep, got confirmed before I got home. ₱299 well spent.",
    rating: 5,
    order: 3,
  },
];

const FAQS = [
  {
    question: "What's included in every package?",
    answer:
      "Your backdrop color, unlimited props, an outfit change, enhanced images (10–20 depending on the package), and wallet-size prints. It's all listed on each package — no surprises at the counter.",
  },
  {
    question: "Can we add people, pets, or minutes?",
    answer:
      "Yes — extra person ₱150–200, pet ₱100, extra 10 minutes ₱100, extra backdrop color ₱100. Mention them in the notes when you book so the room is prepped.",
  },
  {
    question: "Can we get all the photos, not just the enhanced ones?",
    answer:
      "All raw photos are ₱250 for solo/duo and ₱300 for collective packages. Extra enhanced edits are ₱20 per photo if you can't pick just ten.",
  },
  {
    question: "Is the downpayment refundable?",
    answer:
      "No — it holds a real slot on the calendar. You get one free reschedule if you tell us at least 48 hours before your session.",
  },
  {
    question: "Do you do ID photos and document printing?",
    answer:
      "Yes — ID packages are ₱150 (2×2, 1×1, and passport-size combos), laminating from ₱30, and document printing from ₱3 a page. Walk in any time we're open.",
  },
];

/** Wraps plain text in the minimal Lexical document Payload expects. */
function richText(text: string) {
  return {
    root: {
      type: "root",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      children: [
        {
          type: "paragraph",
          format: "" as const,
          indent: 0,
          version: 1,
          direction: "ltr" as const,
          textFormat: 0,
          children: [
            { type: "text", text, format: 0, style: "", mode: "normal", detail: 0, version: 1 },
          ],
        },
      ],
    },
  };
}

async function seed() {
  if (!process.env.DATABASE_URI) {
    console.error("DATABASE_URI is not set. Seeding needs a database.");
    process.exit(1);
  }

  const payload = await getPayload({ config });
  let wrote = 0;

  /* ---- testimonials ---- */
  const existingTestimonials = await payload.count({ collection: "testimonials" });
  if (existingTestimonials.totalDocs > 0) {
    console.log(`testimonials: ${existingTestimonials.totalDocs} already present, skipping`);
  } else {
    for (const data of TESTIMONIALS) {
      await payload.create({ collection: "testimonials", data });
      wrote++;
    }
    console.log(`testimonials: seeded ${TESTIMONIALS.length}`);
  }

  /* ---- faqs ---- */
  const existingFaqs = await payload.count({ collection: "faqs" });
  if (existingFaqs.totalDocs > 0) {
    console.log(`faqs: ${existingFaqs.totalDocs} already present, skipping`);
  } else {
    for (const [i, faq] of FAQS.entries()) {
      await payload.create({
        collection: "faqs",
        data: { question: faq.question, answer: richText(faq.answer), order: i + 1 },
      });
      wrote++;
    }
    console.log(`faqs: seeded ${FAQS.length}`);
  }

  /* ---- site settings ---- */
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      name: STUDIO.name,
      tagline: STUDIO.tagline,
      positioning: STUDIO.positioning,
      eyebrow: STUDIO.eyebrow,
      marquee: STUDIO.marquee,
      address: {
        lines: [...STUDIO.address.lines],
        landmark: STUDIO.address.landmark,
        locality: STUDIO.address.locality,
        region: STUDIO.address.region,
        country: STUDIO.address.country,
      },
      timezone: STUDIO.timezone,
      hours: STUDIO.hours.map((h) => ({ label: h.label, value: h.value })),
      contact: {
        phone: STUDIO.contact.phone,
        phoneHref: STUDIO.contact.phoneHref,
        email: STUDIO.contact.email,
      },
      socials: STUDIO.socials.map((s) => ({ label: s.label, href: s.href })),
      // mapEmbedUrl is deliberately left unset — the map stays a placeholder
      // until the studio consents to embedding a third party.
    },
  });
  console.log("site-settings: updated");

  /* ---- portfolio ----
     Skipped on purpose: every portfolio row requires an uploaded image, and the
     session photography is not in the repo (see README). The page falls back to
     the file-system photos until the studio uploads real ones. */
  const existingWork = await payload.count({ collection: "portfolio" });
  console.log(
    `portfolio: ${existingWork.totalDocs} rows — not seeded (needs uploaded images; ` +
      `the page falls back to the ${WORK.length} file-system slots meanwhile)`,
  );

  console.log(`\nDone. ${wrote} documents created.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
