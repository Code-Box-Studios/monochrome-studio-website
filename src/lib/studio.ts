/**
 * Studio profile — the single source of truth for everything the site says
 * about Monochrome Studio itself.
 *
 * In the shipped architecture (see studio-site-spec.md §4) this becomes the
 * Payload `site-settings` global. It is a plain module for now so the
 * marketing page renders without a database.
 */

export const STUDIO = {
  name: "Monochrome Studio",
  tagline: "shoot today, prints today",
  positioning:
    "The most aesthetic & most affordable studio in Tagum City — sessions from ₱299 with props, outfit changes, and four backdrop colors included. Book a slot, send the downpayment, walk in ready.",
  eyebrow: "TAGUM CITY · BOOK ONLINE · WALK-INS WELCOME",
  timezone: "Asia/Manila",

  address: {
    lines: ["SMS BLDG, DOOR A20,", "SOBRECAREY ST., TAGUM CITY"],
    landmark: "FRONTING IMELDA / RIZAL ELEMENTARY SCHOOL",
    locality: "Tagum City",
    region: "Davao del Norte",
    country: "PH",
  },

  hours: [
    { label: "MON – SUN", value: "9:00 AM – 7:00 PM" },
    { label: "OPEN DAILY", value: "WALK-INS + BOOKINGS" },
  ],

  contact: {
    phone: "0917 555 0142",
    phoneHref: "tel:+639175550142",
    email: "hello@monochrome.studio",
  },

  socials: [
    { label: "INSTAGRAM", href: "#visit" },
    { label: "FACEBOOK", href: "#visit" },
  ],

  /** Marquee copy — rendered twice, back to back, for a seamless loop. */
  marquee:
    "✨ THE MOST AESTHETIC & MOST AFFORDABLE STUDIO IN TAGUM CITY ✨ SOLO FROM ₱299 · FREE 10 ENHANCED IMAGES · OUTFIT CHANGE + UNLIMITED PROPS · GCASH + MAYA · SLOTS HELD 15 MIN WHILE YOU PAY · ID PACKAGES ₱150 · WALK-INS BY LUCK, BOOKINGS SKIP THE LINE ·\u00a0",
} as const;

/** How long a slot stays held while the customer pays. */
export const HOLD_MINUTES = 15;

/**
 * E-wallet channels shown on the payment step.
 *
 * `qr` points at a file the studio drops into `public/brand/`. It is
 * deliberately absent from the repo: committing a QR code for a payment
 * account is a live payment surface, not a design asset. Until the studio
 * supplies theirs, the payment step renders the account number and a
 * labelled placeholder where the QR goes.
 */
export const PAYMENT_CHANNELS = [
  {
    id: "gcash",
    label: "GCASH",
    number: "0917 555 0142",
    accountName: "MO*OCHR*ME S. — AS SHOWN IN-APP",
    qr: "/brand/qr-gcash.png",
  },
  {
    id: "maya",
    label: "MAYA",
    number: "0917 555 0142",
    accountName: "MONOCHROME STUDIO",
    qr: "/brand/qr-maya.png",
  },
] as const;

export type PaymentChannel = (typeof PAYMENT_CHANNELS)[number];

export const PAYMENT_TERMS =
  "DOWNPAYMENTS ARE NON-REFUNDABLE. ONE FREE RESCHEDULE UP TO 48 HRS BEFORE YOUR SLOT. NEVER PAY ANYONE WHO CONTACTS YOU FIRST.";

/** The four backdrop colours included with every package. */
export const BACKDROPS = [
  { name: "RED", hex: "#C13A30" },
  { name: "TAN", hex: "#C49B6A" },
  { name: "YELLOW", hex: "#F6D65A" },
  { name: "PINK", hex: "#F3A6C6" },
] as const;
