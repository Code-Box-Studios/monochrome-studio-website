/**
 * Photography manifest.
 *
 * Every photographic surface on the page is declared here once: the id is the
 * filename the studio drops into `public/photos/`, the alt text is what a
 * screen reader gets, and `placeholder` is the art-direction note shown in the
 * empty state so whoever fills the slot knows what belongs in it.
 *
 * Files are intentionally not committed — the design canvas API caps asset
 * downloads at 256 KiB and truncated every session photo, so shipping them
 * would mean shipping corrupt images. Drop real files into `public/photos/`
 * using the ids below (any of .jpg/.jpeg/.png/.webp/.avif) and they appear
 * with no code change; see README.md.
 */

export type PhotoId =
  | "hero"
  | "session-original"
  | "session-birthday"
  | "session-graduation"
  | "studio-room"
  | "work-1"
  | "work-2"
  | "work-3"
  | "work-4"
  | "work-5"
  | "work-6";

export interface PhotoSpec {
  id: PhotoId;
  alt: string;
  /** Art-direction note, shown in the empty state. */
  placeholder: string;
  /** `width / height`, used to reserve layout space. */
  aspect: string;
}

export const PHOTOS: Record<PhotoId, PhotoSpec> = {
  hero: {
    id: "hero",
    alt: "A session in progress in the Monochrome Studio room",
    placeholder: "hero — a real session in the room, landscape",
    aspect: "16 / 9",
  },
  "session-original": {
    id: "session-original",
    alt: "A solo session shot against the studio's red backdrop",
    placeholder: "a session from the original packages",
    aspect: "4 / 5",
  },
  "session-birthday": {
    id: "session-birthday",
    alt: "A birthday session with a number balloon and set-up",
    placeholder: "birthday session — number balloon + set-up",
    aspect: "4 / 5",
  },
  "session-graduation": {
    id: "session-graduation",
    alt: "A graduation session in toga with glam styling",
    placeholder: "graduation — toga + glam shots",
    aspect: "4 / 5",
  },
  "studio-room": {
    id: "studio-room",
    alt: "The studio room between sessions, backdrops and props wall visible",
    placeholder: "the studio room — backdrops + props wall",
    aspect: "3 / 4",
  },
  "work-1": { id: "work-1", alt: "Solo session sample", placeholder: "solo session sample", aspect: "4 / 5" },
  "work-2": { id: "work-2", alt: "Collective session sample", placeholder: "collective / barkada sample", aspect: "4 / 5" },
  "work-3": { id: "work-3", alt: "Duo session sample", placeholder: "duo session sample", aspect: "4 / 5" },
  "work-4": { id: "work-4", alt: "Graduation session sample", placeholder: "graduation sample", aspect: "4 / 5" },
  "work-5": { id: "work-5", alt: "Birthday session sample", placeholder: "birthday session sample", aspect: "4 / 5" },
  "work-6": { id: "work-6", alt: "Kids theme session sample", placeholder: "kids theme sample", aspect: "4 / 5" },
};

/** Portfolio filter categories, in the order the chips appear. */
export const WORK_CATEGORIES = [
  { id: "all", label: "ALL" },
  { id: "solo", label: "SOLO" },
  { id: "duo", label: "DUO" },
  { id: "collective", label: "COLLECTIVE" },
  { id: "birthday", label: "BIRTHDAY" },
  { id: "graduation", label: "GRADUATION" },
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number]["id"];

export interface WorkItem {
  photo: PhotoId;
  caption: string;
  category: Exclude<WorkCategory, "all">;
  /** Degrees of scatter, so the grid reads as prints on a table. */
  tilt: number;
  /** Extra vertical offset in px, for the staggered middle column. */
  offsetY: number;
  /** Reveal delay in ms. */
  delay: number;
}

export const WORK: readonly WorkItem[] = [
  { photo: "work-1", caption: "the red set — solo era", category: "solo", tilt: -1.2, offsetY: 0, delay: 0 },
  { photo: "work-2", caption: "the tan set — fits the whole barkada", category: "collective", tilt: 1, offsetY: 14, delay: 90 },
  { photo: "work-3", caption: "the pink set — duo favorite", category: "duo", tilt: -0.8, offsetY: 0, delay: 180 },
  { photo: "work-4", caption: "grad gray — sablay season", category: "graduation", tilt: 1.2, offsetY: 0, delay: 0 },
  { photo: "work-5", caption: "18th, with the spotlight", category: "birthday", tilt: -1, offsetY: 10, delay: 90 },
  { photo: "work-6", caption: "the kids' princess set-up", category: "birthday", tilt: 0.8, offsetY: 0, delay: 180 },
];

/**
 * Where a photographic surface gets its image.
 *
 * Declared here rather than in `content.ts` because client components need the
 * type, and `content.ts` reaches for the database — importing it from a client
 * component would drag server code into the browser bundle.
 */
export type WorkImage =
  | { kind: "cms"; url: string; alt: string }
  | { kind: "file"; id: PhotoId };
