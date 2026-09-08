import { Reveal } from "@/components/ui/Reveal";

import type { TestimonialEntry } from "@/lib/content";

interface TestimonialsProps {
  items: TestimonialEntry[];
}

/**
 * The second card sits a step lower and reveals a beat late. Both are layout
 * rhythm rather than content, so they key off the index and survive any number
 * of quotes coming back from the CMS.
 */
const NUDGED_INDEX = 1;
const STAGGER_MS = 120;

export function Testimonials({ items }: TestimonialsProps) {
  return (
    <section className="border-y border-line bg-sand">
      <div className="mx-auto grid max-w-[1240px] items-start gap-10 px-5 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-3 lg:py-[88px] lg:px-14">
        {items.map((item, i) => {
          const attribution = item.attribution.trim();
          return (
            <Reveal
              key={item.key}
              as="blockquote"
              delay={i === NUDGED_INDEX ? STAGGER_MS : 0}
              className={`m-0 rounded-[4px] border-t-[3px] border-ink bg-paper px-[26px] pt-[26px] pb-[22px] shadow-[0_10px_24px_rgba(30,30,40,.1)]${
                // The middle card sits a step lower on the artboard only — stacked
                // on mobile the offset would just read as an uneven gap.
                i === NUDGED_INDEX ? " lg:translate-y-4" : ""
              }`}
            >
              <div
                role="img"
                aria-label={`Rated ${item.rating} out of 5`}
                className="mb-[14px] font-mono text-[14px] tracking-[0.24em] text-accent"
              >
                {"★".repeat(item.rating)}
              </div>
              <p className="m-0 mb-[18px] font-sans text-[17px] leading-[1.6] text-pretty text-ink italic">
                {`"${item.quote}"`}
              </p>
              <cite className="font-mono text-[10px] tracking-[0.12em] text-muted not-italic">
                {attribution ? `${item.name} — ${attribution}` : item.name}
              </cite>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
