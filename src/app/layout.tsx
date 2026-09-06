import type { Metadata, Viewport } from "next";
import { Anton, Caveat, Instrument_Sans, Space_Mono } from "next/font/google";

import { STUDIO } from "@/lib/studio";
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

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "https://monochrome.studio";
const TITLE = `${STUDIO.name} — self-serve photo sessions from ₱299`;
const DESCRIPTION = STUDIO.positioning;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: `%s · ${STUDIO.name}` },
  description: DESCRIPTION,
  applicationName: STUDIO.name,
  keywords: [
    "photo studio Tagum City",
    "self-serve photo session",
    "graduation photos Tagum",
    "birthday photoshoot Davao del Norte",
    "ID photo Tagum City",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: STUDIO.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_PH",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

/** JSON-LD — real leverage for a local studio's Google presence. */
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "PhotographyBusiness",
  name: STUDIO.name,
  description: DESCRIPTION,
  url: SITE_URL,
  telephone: STUDIO.contact.phone,
  email: STUDIO.contact.email,
  priceRange: "₱₱",
  currenciesAccepted: "PHP",
  paymentAccepted: "GCash, Maya, Cash",
  address: {
    "@type": "PostalAddress",
    streetAddress: STUDIO.address.lines.join(" ").replace(/,$/, ""),
    addressLocality: STUDIO.address.locality,
    addressRegion: STUDIO.address.region,
    addressCountry: STUDIO.address.country,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
          // Static, author-controlled object — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
      </body>
    </html>
  );
}
