import { BookButton } from "@/components/ui/BookButton";
import { Photo } from "@/components/ui/Photo";
import type { Section, SiteInfo } from "@/lib/content";

interface HeroProps {
  copy: Extract<Section, { kind: "hero" }>;
  site: SiteInfo;
  /**
   * Where the secondary button jumps to, or null when the packages section is
   * not on the page — an anchor to a section the studio removed is a dead link,
   * so the button goes with it.
   */
  packagesHref: string | null;
}

/**
 * The opening frame: a full-bleed session photo under a bottom scrim, with the
 * headline, positioning line and the two calls to action stacked over it.
 *
 * The overlay is pointer-events-none so the photo underneath stays interactive;
 * only the button row opts back in.
 */
export function Hero({ copy, site, packagesHref }: HeroProps) {
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
        {site.eyebrow}
      </p>

      <div className="pointer-events-none absolute right-0 bottom-0 left-0 px-5 pb-10 md:px-10 md:pb-[52px] lg:px-14">
        <h1
          className="mt-0 mb-4 max-w-[12em] animate-hero-up font-display text-[clamp(40px,6vw,92px)] leading-[1.04] font-normal tracking-[0.012em] text-balance text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.3)]"
          style={{ animationDelay: "0.05s" }}
        >
          {copy.headlineLine1}
          <br />
          <span className="text-accent">{copy.headlineAccentWord}</span>
          {copy.headlineLine2 ? ` ${copy.headlineLine2}` : null}
        </h1>

        <p
          className="mt-0 mb-[26px] max-w-[540px] animate-hero-up font-sans text-[17px] leading-[1.55] text-pretty text-white/[0.94]"
          style={{ animationDelay: "0.18s" }}
        >
          {/* An unfilled hero paragraph falls back to the studio positioning
              line, so this space is never blank. */}
          {copy.subParagraph ?? site.positioning}
        </p>

        <div
          className="pointer-events-auto flex animate-hero-up flex-wrap items-center gap-[14px]"
          style={{ animationDelay: "0.3s" }}
        >
          <BookButton size="md">{copy.primaryCtaLabel}</BookButton>
          {packagesHref ? (
            <a
              href={packagesHref}
              className="inline-block rounded-md border-[1.5px] border-white/70 px-[26px] py-[15px] font-mono text-[12px] tracking-[0.14em] text-white no-underline transition-colors duration-200 hover:bg-white/15"
            >
              {copy.secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
