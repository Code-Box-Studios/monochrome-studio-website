import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqEntry, Section } from "@/lib/content";
import { fillTokens } from "@/lib/format";
import { jsonLd } from "@/lib/jsonld";

interface FaqProps {
  /**
   * Single source of truth for both the accordion and the FAQPage structured
   * data below — the two must never drift apart, or search results start
   * quoting answers the page no longer gives.
   */
  items: FaqEntry[];
  copy: Extract<Section, { kind: "faq" }>;
}

const NUMBER_WORDS = [
  "NONE", "ONE", "TWO", "THREE", "FOUR", "FIVE",
  "SIX", "SEVEN", "EIGHT", "NINE", "TEN",
];

/** Keeps the design copy ("THE FIVE THAT COME UP MOST") true at any count. */
function countWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}

export function Faq({ items, copy }: FaqProps) {
  // `{count}` is filled in here rather than in the content layer: this is the
  // only place that knows how many questions actually came back, so the note
  // cannot go stale when the studio publishes a sixth question.
  const note = fillTokens(copy.note, { count: countWord(items.length) });

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-[860px] px-5 py-16 md:px-10 lg:py-[100px] lg:px-14">
      <SectionHeading
        index={copy.numeral}
        title={copy.heading}
        note={note}
        className="mb-8"
      />

      {items.map((item) => (
        <Reveal key={item.key} as="details" className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-[22px] [&::-webkit-details-marker]:hidden">
            <span className="font-sans text-[17px] font-semibold">{item.question}</span>
            <span
              aria-hidden="true"
              className="inline-block font-mono text-[20px] font-bold text-accent transition-transform duration-[220ms] ease-out group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="m-0 max-w-[60ch] pb-6 font-sans text-[15px] leading-[1.7] text-muted">
            {item.answer}
          </p>
        </Reveal>
      ))}

      {/* An empty FAQPage is worse than none — emit nothing when there is nothing to say. */}
      {items.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
        />
      ) : null}
    </section>
  );
}
