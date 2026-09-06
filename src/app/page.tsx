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
import { resolvePaymentQrs, resolvePhotos } from "@/lib/photos.server";

export default function HomePage() {
  // Resolved on the server so dropping a file into public/photos/ is the whole
  // install step — no manifest edit, no rebuild of any list.
  const photos = resolvePhotos();
  const qrSources = resolvePaymentQrs();

  return (
    <PhotoProvider sources={photos}>
      <BookingProvider qrSources={qrSources}>
        <SiteHeader />
        <ColorBar id="top" className="relative z-30" />

        <main id="main">
          <Hero />
          <Marquee />
          <Packages />
          <Work />
          <HowItWorks />
          <Testimonials />
          <Faq />
          <CtaBand />
          <Visit />
        </main>

        <ColorBar />
        <SiteFooter />

        <BookingWizard />
      </BookingProvider>
    </PhotoProvider>
  );
}
