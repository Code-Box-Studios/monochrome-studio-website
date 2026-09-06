import { BookButton } from "@/components/ui/BookButton";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBand() {
  return (
    <section className="bg-accent">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-10 px-5 py-[64px] md:px-10 md:py-[80px] lg:gap-[60px] lg:px-14 lg:py-[92px]">
        <Reveal
          as="h2"
          className="m-0 max-w-[16em] text-balance font-display text-[clamp(30px,4.6vw,60px)] font-normal leading-[1.1] tracking-[0.015em] text-paper"
        >
          THE CALENDAR IS HONEST — IF IT SHOWS A SLOT, IT&apos;S YOURS.
        </Reveal>

        <Reveal delay={140} className="flex flex-col items-start gap-3">
          <BookButton tone="ink" size="lg" />
          <span className="font-mono text-[10px] tracking-[0.16em] text-paper/85">
            HELD 15 MIN WHILE YOU PAY · NO ACCOUNT NEEDED
          </span>
        </Reveal>
      </div>
    </section>
  );
}
