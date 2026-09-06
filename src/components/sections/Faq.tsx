import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Single source of truth for both the accordion and the FAQPage structured
 * data below — the two must never drift apart, or search results start
 * quoting answers the page no longer gives.
 */
const FAQS: readonly FaqEntry[] = [
  {
    question: "What's included in every package?",
    answer:
      "Your backdrop color, unlimited props, an outfit change, enhanced images (10–20 depending on the package), and wallet-size prints. It's all listed on each package — no surprises at the counter.",
  },
  {
    question: "Can we add people, pets, or minutes?",
    answer:
      "Yes — extra person ₱150–200, pet ₱100, extra 10 minutes ₱100, extra backdrop color ₱100. Mention them in the notes when you book so the room is prepped.",
  },
  {
    question: "Can we get all the photos, not just the enhanced ones?",
    answer:
      "All raw photos are ₱250 for solo/duo and ₱300 for collective packages. Extra enhanced edits are ₱20 per photo if you can't pick just ten.",
  },
  {
    question: "Is the downpayment refundable?",
    answer:
      "No — it holds a real slot on the calendar. You get one free reschedule if you tell us at least 48 hours before your session.",
  },
  {
    question: "Do you do ID photos and document printing?",
    answer:
      "Yes — ID packages are ₱150 (2×2, 1×1, and passport-size combos), laminating from ₱30, and document printing from ₱3 a page. Walk in any time we're open.",
  },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((entry) => ({
    "@type": "Question",
    name: entry.question,
    acceptedAnswer: { "@type": "Answer", text: entry.answer },
  })),
};

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-[860px] px-5 py-16 md:px-10 lg:py-[100px] lg:px-14">
      <SectionHeading
        index="04"
        title="ASK US ANYTHING"
        note="THE FIVE THAT COME UP MOST"
        className="mb-8"
      />

      {FAQS.map((entry) => (
        <Reveal key={entry.question} as="details" className="group border-b border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-[22px] [&::-webkit-details-marker]:hidden">
            <span className="font-sans text-[17px] font-semibold">{entry.question}</span>
            <span
              aria-hidden="true"
              className="inline-block font-mono text-[20px] font-bold text-accent transition-transform duration-[220ms] ease-out group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="m-0 max-w-[60ch] pb-6 font-sans text-[15px] leading-[1.7] text-muted">
            {entry.answer}
          </p>
        </Reveal>
      ))}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
    </section>
  );
}
