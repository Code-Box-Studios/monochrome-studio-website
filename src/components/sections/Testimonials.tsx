import { Reveal } from "@/components/ui/Reveal";

const QUOTES = [
  {
    quote:
      '"Booked at 1 AM, shot on Saturday. The photos made my mom cry — the good kind."',
    cite: "KAT R. — GRADUATION GOLD",
    delay: 0,
    nudged: false,
  },
  {
    quote:
      '"Our toddler ran laps the entire 15 minutes. The crew kept up. Somehow every keeper looks calm."',
    cite: "THE DIZON FAMILY — COLLECTIVE A",
    delay: 120,
    nudged: true,
  },
  {
    quote:
      '"Sent the GCash from the jeep, got confirmed before I got home. ₱299 well spent."',
    cite: "MIGS A. — SOLO",
    delay: 0,
    nudged: false,
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-line bg-sand">
      <div className="mx-auto grid max-w-[1240px] items-start gap-10 px-5 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-3 lg:py-[88px] lg:px-14">
        {QUOTES.map((item) => (
          <Reveal
            key={item.cite}
            as="blockquote"
            delay={item.delay}
            className={`m-0 rounded-[4px] border-t-[3px] border-ink bg-paper px-[26px] pt-[26px] pb-[22px] shadow-[0_10px_24px_rgba(30,30,40,.1)]${
              // The middle card sits a step lower on the artboard only — stacked
              // on mobile the offset would just read as an uneven gap.
              item.nudged ? " lg:translate-y-4" : ""
            }`}
          >
            <div
              role="img"
              aria-label="Rated 5 out of 5"
              className="mb-[14px] font-mono text-[14px] tracking-[0.24em] text-accent"
            >
              ★★★★★
            </div>
            <p className="m-0 mb-[18px] font-sans text-[17px] leading-[1.6] text-pretty text-ink italic">
              {item.quote}
            </p>
            <cite className="font-mono text-[10px] tracking-[0.12em] text-muted not-italic">
              {item.cite}
            </cite>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
