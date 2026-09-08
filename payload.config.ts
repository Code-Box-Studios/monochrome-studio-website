import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Faqs } from "@/collections/Faqs";
import { Media } from "@/collections/Media";
import { Portfolio } from "@/collections/Portfolio";
import { ServicesContent } from "@/collections/ServicesContent";
import { Testimonials } from "@/collections/Testimonials";
import { Users } from "@/collections/Users";
import { LandingPage } from "@/globals/LandingPage";
import { SiteSettings } from "@/globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload — content only.
 *
 * Bookings, receipts, blackout dates and booking settings are deliberately
 * absent: the commerce API owns availability, holds, payments and verification,
 * and the studio manages those in one queue there rather than here
 * (studio-site-spec.md §4). Price, duration and downpayment are likewise never
 * stored — they are read live from the products API so the site cannot disagree
 * with the till.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname, "src/app/(payload)") },
    meta: {
      titleSuffix: "· Monochrome Studio",
    },
  },

  collections: [ServicesContent, Portfolio, Testimonials, Faqs, Media, Users],
  globals: [SiteSettings, LandingPage],

  editor: lexicalEditor({}),

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? "" },

    /**
     * Schema changes land through migrations only.
     *
     * Payload otherwise pushes the config's schema straight at the database
     * whenever `NODE_ENV !== 'production'` — which is every script run: `pnpm
     * seed`, a one-off tsx script, `next dev`. There is one database here, the
     * live Neon one, so that default means an unfinished field edit reaches
     * production the moment anybody seeds. It has already happened once: the
     * `payload_migrations` table carries a `dev` row from exactly that.
     *
     * With this off, changing a field means generating a migration and running
     * it — the same path the deploy takes.
     */
    push: false,
  }),

  // Generated types land next to the source they describe.
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },

  // Required in production. There is no safe default — a fixed fallback would
  // let anyone forge a session cookie, so fail loudly instead.
  secret: process.env.PAYLOAD_SECRET ?? "",

  sharp,

  // Everything the studio uploads is public imagery served by next/image.
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
});
