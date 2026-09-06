import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  /** Two-digit section numeral, e.g. `01`. */
  index: string;
  title: string;
  /** Right-aligned mono note; hidden on small screens where it would wrap. */
  note?: string;
  className?: string;
}

/**
 * `( 01 )  PACKAGES ————————————  THE STUDIO'S PUBLISHED PRICES`
 *
 * The rule under each heading wipes in from the left as the section arrives.
 */
export function SectionHeading({ index, title, note, className = "" }: SectionHeadingProps) {
  return (
    <Reveal className={className}>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-accent">
          ( {index} )
        </span>
        <h2 className="m-0 font-display text-[28px] font-normal tracking-[0.015em] sm:text-[32px] lg:text-[38px]">
          {title}
        </h2>
        <span className="flex-1" />
        {note ? (
          <span className="hidden font-mono text-[10px] tracking-[0.16em] text-muted lg:inline">
            {note}
          </span>
        ) : null}
      </div>
      <Reveal variant="rule" className="mt-[14px] h-[3px] bg-ink" />
    </Reveal>
  );
}
