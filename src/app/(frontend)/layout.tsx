import type { Metadata, Viewport } from "next";
import { Anton, Caveat, Instrument_Sans, Space_Mono } from "next/font/google";

import { getSiteInfo, type SiteInfo } from "@/lib/content";
import { pesoLabel } from "@/lib/format";
import { jsonLd } from "@/lib/jsonld";
import { productsIn } from "@/lib/products";
import "./globals.css";

/* The display face carries the studio name and every section head; the sans is
   the quiet workhorse; the mono does labels, prices and anything that should
   read as machine truth; the script is the studio's handwriting on prints. */
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

const DEFAULT_SITE_URL = "https://monochrome.studio";

/**
 * The public origin, used for canonical URLs, OpenGraph and JSON-LD.
 *
 * This is build-time config typed by a human into a hosting dashboard, so it is
 * treated as untrusted. Two values that look fine and are not:
 *   - `""` — the variable was created but left blank. `??` would pass it
 *     straight through, and `new URL("")` throws, failing the whole build.
 *   - `my-app.vercel.app` — a bare host with no protocol also throws.
 * A bad origin should degrade to the default, never take the build down.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SERVER_URL,
    // Vercel injects the deployment host (without a protocol) on previews,
    // where the real URL is not known until after the build starts.
    process.env.NEXT_PUBLIC_VERCEL_URL,
    DEFAULT_SITE_URL,
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    try {
      return new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`).href;
    } catch {
      // Unparseable — try the next candidate.
    }
  }
  return DEFAULT_SITE_URL;
}

const SITE_URL = resolveSiteUrl();

/** The cheapest session, read from the packages rather than typed into the title. */
function fromPrice(): string {
  return pesoLabel(Math.min(...productsIn("orig").map((product) => product.price)));
}

function titleFor(site: SiteInfo): string {
  return `${site.name} — self-serve photo sessions from ${fromPrice()}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  const title = titleFor(site);
  const description = site.positioning;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${site.name}` },
    description,
    applicationName: site.name,
    keywords: [
      `photo studio ${site.locality}`,
      "self-serve photo session",
      `graduation photos ${site.locality}`,
      `birthday photoshoot ${site.region}`,
      `ID photo ${site.locality}`,
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: site.name,
      title,
      description,
      locale: "en_PH",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/**
 * JSON-LD — real leverage for a local studio's Google presence.
 *
 * `openingHoursSpecification` is deliberately absent. The opening hours in the
 * admin are free text ("MON – SUN" / "9:00 AM – 7:00 PM") because that is what
 * the design prints, and guessing machine-readable times out of them would put
 * hours in front of Google that nobody checked. A studio that shortens its day
 * would then have customers arriving at a closed door. Restoring this property
 * needs real `opens`/`closes` fields on the site-settings global, not a parser.
 */
function localBusiness(site: SiteInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "PhotographyBusiness",
    name: site.name,
    description: site.positioning,
    url: SITE_URL,
    telephone: site.phone,
    email: site.email,
    priceRange: "₱₱",
    currenciesAccepted: "PHP",
    paymentAccepted: "GCash, Maya, Cash",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.addressLines.join(" ").replace(/,$/, ""),
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: site.country,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteInfo();

  return (
    <html
      lang="en-PH"
      className={`${anton.variable} ${instrumentSans.variable} ${spaceMono.variable} ${caveat.variable}`}
    >
      <body className="bg-paper text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:font-mono focus:text-[11px] focus:tracking-[0.14em] focus:text-paper"
        >
          SKIP TO CONTENT
        </a>
        {children}
        <script
          type="application/ld+json"
          // Editor-supplied since the studio profile moved into the CMS, so the
          // angle brackets are escaped rather than trusted.
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusiness(site)) }}
        />
      </body>
    </html>
  );
}
