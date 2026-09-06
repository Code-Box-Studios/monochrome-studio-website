import { BookButton } from "@/components/ui/BookButton";
import { Photo } from "@/components/ui/Photo";
import { STUDIO } from "@/lib/studio";

/**
 * The opening frame: a full-bleed session photo under a bottom scrim, with the
 * headline, positioning line and the two calls to action stacked over it.
 *
 * The overlay is pointer-events-none so the photo underneath stays interactive;
 * only the button row opts back in.
 */
export function Hero() {
  return (
    <section className="relative min-h-[560px] md:h-[max(74vh,560px)]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 animate-kenburns">
          <Photo id="hero" preload sizes="100vw" placeholderAlign="top" />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,24,0)_38%,rgba(20,20,24,0.62)_100%)]"
      />

      <p
        className="pointer-events-none absolute top-[30px] right-10 hidden animate-eyebrow-in font-mono text-[10px] tracking-[0.18em] text-white/90 md:block lg:right-14"
        style={{ animationDelay: "0.5s" }}
      >
        {STUDIO.eyebrow}
      </p>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 px-5 pb-10 md:px-10 md:pb-[52px] lg:px-14">
        <h1
          className="mt-0 mb-4 max-w-[12em] animate-hero-up font-display text-[clamp(40px,6vw,92px)] leading-[1.04] font-normal tracking-[0.012em] text-balance text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.3)]"
          style={{ animationDelay: "0.05s" }}
        >
          15 MINUTES.
          <br />
          <span className="text-accent">UNLIMITED</span> SHOTS.
        </h1>

        <p
          className="mt-0 mb-[26px] max-w-[540px] animate-hero-up font-sans text-[17px] leading-[1.55] text-pretty text-white/[0.94]"
          style={{ animationDelay: "0.18s" }}
        >
          {STUDIO.positioning}
        </p>

        <div
          className="pointer-events-auto flex animate-hero-up flex-wrap items-center gap-[14px]"
          style={{ animationDelay: "0.3s" }}
        >
          <BookButton size="md" />
          <a
            href="#packages"
            className="inline-block rounded-md border-[1.5px] border-white/70 px-[26px] py-[15px] font-mono text-[12px] tracking-[0.14em] text-white no-underline transition-colors duration-200 hover:bg-white/15"
          >
            SEE PACKAGES ↓
          </a>
        </div>
      </div>
    </section>
  );
}
