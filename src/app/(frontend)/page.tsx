import { Fragment } from "react";

import { BookingProvider } from "@/components/booking/BookingProvider";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Marquee } from "@/components/sections/Marquee";
import { Packages } from "@/components/sections/Packages";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Testimonials } from "@/components/sections/Testimonials";
import { Visit } from "@/components/sections/Visit";
import { Work } from "@/components/sections/Work";
import { ColorBar } from "@/components/ui/ColorBar";
import { PhotoProvider } from "@/components/ui/PhotoProvider";
import {
  SECTION_ANCHORS,
  getFaqs,
  getLayout,
  getServiceCopy,
  getSiteInfo,
  getTestimonials,
  getWork,
  type SectionKind,
} from "@/lib/content";
import { resolvePaymentQrs, resolvePhotos } from "@/lib/photos.server";

/**
 * Rebuilt on demand rather than per request: the CMS calls `revalidatePath('/')`
 * when content changes, so edits go live immediately while every other visit is
 * served from the static render.
 */
export const revalidate = false;

export default async function HomePage() {
  // Resolved on the server so dropping a file into public/photos/ is the whole
  // install step — no manifest edit, no rebuild of any list.
  const photos = resolvePhotos();
  const qrSources = resolvePaymentQrs();

  // Each getter falls back to the launch content when the CMS is empty or the
  // database is unreachable, so this page renders with or without a database.
  const [work, testimonials, faqs, site, layout, services] = await Promise.all([
    getWork(),
    getTestimonials(),
    getFaqs(),
    getSiteInfo(),
    getLayout(),
    getServiceCopy(),
  ]);

  const has = (kind: SectionKind) => layout.some((section) => section.kind === kind);

  // The chrome follows the page. A section the studio removed in the admin takes
  // its menu entry with it, in the order the sections now appear, so no link can
  // point at an anchor that is no longer rendered.
  const nav = layout.flatMap((section) => {
    const anchor =
      section.kind in SECTION_ANCHORS
        ? SECTION_ANCHORS[section.kind as keyof typeof SECTION_ANCHORS]
        : null;
    return anchor ? [{ href: `#${anchor.id}`, label: anchor.label }] : [];
  });

  const footerLinks = [
    ...nav.filter((link) => link.href !== "#how" && link.href !== "#visit"),
    // TERMS and PRIVACY still point at the Visit section: the real /terms and
    // /privacy routes are not built yet, so they hang off the section that
    // carries the contact details.
    ...(has("visit")
      ? [
          { href: "#visit", label: "TERMS" },
          { href: "#visit", label: "PRIVACY" },
        ]
      : []),
  ];

  return (
    <PhotoProvider sources={photos}>
      <BookingProvider qrSources={qrSources}>
        <SiteHeader nav={nav} logo={site.logo} name={site.name} />
        <ColorBar id="top" className="relative z-30" />

        <main id="main">
          {/* Array order is page order — this is what makes dragging a section in
              the admin actually move it on the site. */}
          {layout.map((section) => {
            switch (section.kind) {
              case "hero":
                return (
                  <Fragment key={section.key}>
                    <Hero
                      copy={section}
                      site={site}
                      packagesHref={has("packages") ? "#packages" : null}
                    />
                    {/* The ticker belongs to the opening frame and travels with it. */}
                    <Marquee text={site.marquee} />
                  </Fragment>
                );
              case "packages":
                return <Packages key={section.key} copy={section} services={services} />;
              case "portfolio":
                return <Work key={section.key} items={work} copy={section} />;
              case "howItWorks":
                return <HowItWorks key={section.key} copy={section} />;
              case "testimonials":
                return <Testimonials key={section.key} items={testimonials} copy={section} />;
              case "faq":
                return <Faq key={section.key} items={faqs} copy={section} />;
              case "ctaBand":
                return <CtaBand key={section.key} copy={section} />;
              case "visit":
                return <Visit key={section.key} site={site} copy={section} />;
            }
          })}
        </main>

        <ColorBar />
        <SiteFooter site={site} links={footerLinks} year={new Date().getFullYear()} />

        <BookingWizard />
      </BookingProvider>
    </PhotoProvider>
  );
}
