import { Fragment } from "react";

import { STUDIO } from "@/lib/studio";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const LINK_CLASS =
  "underline underline-offset-[3px] transition-colors duration-150 hover:text-accent";

export function Visit() {
  return (
    <section
      id="visit"
      className="mx-auto grid max-w-[1240px] items-start gap-12 px-5 py-16 md:px-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-[76px] lg:px-14 lg:py-[100px]"
    >
      <div>
        <SectionHeading index="05" title="VISIT" className="mb-5" />

        {/* The real map stays out until the studio signs off on embedding a
            third-party iframe (spec Q24) — placeholder, not a stub. */}
        <Reveal
          className="grid h-[370px] place-items-center rounded-lg border-2 border-dashed border-line-strong bg-[image:repeating-linear-gradient(45deg,var(--color-sand)_0_14px,var(--color-paper)_14px_28px)]"
        >
          <span className="rounded-md border-[1.5px] border-dashed border-line-strong bg-paper px-[18px] py-[10px] text-center font-mono text-[11px] tracking-[0.16em] text-muted">
            MAP EMBED — PENDING CONSENT (Q24)
          </span>
        </Reveal>
      </div>

      <Reveal delay={120} className="lg:pt-[52px]">
        <p className="m-0 mb-[10px] font-display text-[24px] leading-[1.35] tracking-[0.02em] text-pretty">
          {STUDIO.address.lines.map((line, index) => (
            <Fragment key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </p>
        <p className="m-0 mb-[26px] font-mono text-[10px] tracking-[0.14em] text-muted">
          {STUDIO.address.landmark}
        </p>

        <div className="border-t border-line">
          {STUDIO.hours.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-4 border-b border-line py-[12px] font-mono text-[12px] tracking-[0.1em]"
            >
              <span className="text-muted">{row.label}</span>
              <span className="text-right text-ink">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-[28px] flex flex-col gap-[10px] font-mono text-[13px] tracking-[0.08em]">
          <a href={STUDIO.contact.phoneHref} className={`${LINK_CLASS} self-start`}>
            {STUDIO.contact.phone}
          </a>
          <a
            href={`mailto:${STUDIO.contact.email}`}
            className={`${LINK_CLASS} self-start break-all uppercase`}
          >
            {STUDIO.contact.email}
          </a>
          <span>
            {STUDIO.socials.map((social, index) => (
              <Fragment key={social.label}>
                {index > 0 ? " · " : null}
                <a href={social.href} className={LINK_CLASS}>
                  {social.label}
                </a>
              </Fragment>
            ))}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
