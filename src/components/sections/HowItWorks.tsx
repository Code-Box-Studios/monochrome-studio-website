import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { HOLD_MINUTES } from "@/lib/studio";

const STEPS = [
  {
    numeral: "01",
    title: "Book a slot",
    // The hold window is a business rule, not copy — it comes from the studio config.
    body: `Pick a package and a time, then send the downpayment by GCash or Maya. Your slot is held for ${HOLD_MINUTES} minutes while you pay — no account, no DMs.`,
  },
  {
    numeral: "02",
    title: "Shoot — unlimited frames",
    body: "Your backdrop color is set, props and spotlight are in the room, and there's time for an outfit change. Staff on hand if you want direction.",
  },
  {
    numeral: "03",
    title: "Pick + print",
    body: "Choose your enhanced images before you leave; wallet-size prints are included and bigger prints and frames start at ₱99. Raws available for ₱250–300.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="mx-auto grid max-w-[1240px] items-start gap-12 px-5 pb-16 md:px-10 lg:pb-[110px] lg:grid-cols-[400px_1fr] lg:gap-[80px] lg:px-14"
    >
      <Reveal className="relative mx-auto w-full max-w-[400px] rotate-0 rounded-[4px] bg-cream px-[14px] pt-[14px] pb-[52px] shadow-[0_14px_32px_rgba(30,30,40,.15)] lg:rotate-[-1deg]">
        {/* Masking tape holding the print to the page. */}
        <span
          aria-hidden="true"
          className="absolute top-[-11px] left-1/2 h-[26px] w-[100px] -translate-x-1/2 rotate-[-2deg] bg-tape shadow-[0_1px_2px_rgba(0,0,0,.1)]"
        />
        <div className="relative aspect-[3/4]">
          <Photo
            id="studio-room"
            enlargeable
            sizes="(max-width: 1024px) 92vw, 372px"
          />
        </div>
        <div className="absolute right-0 bottom-[12px] left-0 text-center font-script text-[22px] font-semibold text-ink-3">
          the room, between sessions
        </div>
      </Reveal>

      <Reveal delay={120} className="lg:pt-2">
        <SectionHeading index="03" title="HOW IT WORKS" />

        <div className="mt-[34px] flex flex-col gap-[26px]">
          {STEPS.map((step) => (
            <Reveal
              key={step.numeral}
              className="grid grid-cols-[64px_1fr] items-start gap-5"
            >
              <div className="font-display text-[40px] leading-none text-accent">
                {step.numeral}
              </div>
              <div>
                <div className="mb-1 font-sans text-[17px] font-semibold">
                  {step.title}
                </div>
                <p className="m-0 max-w-[52ch] font-sans text-[14px] leading-[1.65] text-pretty text-muted">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
