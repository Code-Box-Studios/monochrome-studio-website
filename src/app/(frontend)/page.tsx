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
import { getFaqs, getSiteInfo, getTestimonials, getWork } from "@/lib/content";
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
  const [work, testimonials, faqs, site] = await Promise.all([
    getWork(),
    getTestimonials(),
    getFaqs(),
    getSiteInfo(),
  ]);

  return (
    <PhotoProvider sources={photos}>
      <BookingProvider qrSources={qrSources}>
        <SiteHeader />
        <ColorBar id="top" className="relative z-30" />

        <main id="main">
          <Hero />
          <Marquee />
          <Packages />
          <Work items={work} />
          <HowItWorks />
          <Testimonials items={testimonials} />
          <Faq items={faqs} />
          <CtaBand />
          <Visit site={site} />
        </main>

        <ColorBar />
        <SiteFooter />

        <BookingWizard />
      </BookingProvider>
    </PhotoProvider>
  );
}
