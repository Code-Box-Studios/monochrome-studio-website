import { BookButton } from "@/components/ui/BookButton";
import { Reveal } from "@/components/ui/Reveal";
import type { Section } from "@/lib/content";

interface CtaBandProps {
  copy: Extract<Section, { kind: "ctaBand" }>;
}

export function CtaBand({ copy }: CtaBandProps) {
  return (
    <section className="bg-accent">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-10 px-5 py-[64px] md:px-10 md:py-[80px] lg:gap-[60px] lg:px-14 lg:py-[92px]">
        <Reveal
          as="h2"
          className="m-0 max-w-[16em] text-balance font-display text-[clamp(30px,4.6vw,60px)] font-normal leading-[1.1] tracking-[0.015em] text-paper"
        >
          {copy.headline}
        </Reveal>

        <Reveal delay={140} className="flex flex-col items-start gap-3">
          <BookButton tone="ink" size="lg">
            {copy.ctaLabel}
          </BookButton>
          {copy.reassurance ? (
            <span className="font-mono text-[10px] tracking-[0.16em] text-paper/85">
              {copy.reassurance}
            </span>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
