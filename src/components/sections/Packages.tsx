import { BookInline } from "@/components/ui/BookButton";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pesoLabel } from "@/lib/format";
import { ORIGINAL_EXTRAS, ORIGINAL_INCLUSIONS, productsIn } from "@/lib/products";
import { BACKDROPS } from "@/lib/studio";

/**
 * The descriptive row labels are marketing copy, not product data — the prices
 * beside them are read from PRODUCTS so the page can never disagree with the till.
 */
const ROW_LABELS: Record<string, string> = {
  bdayA: "Birthday A — 20 min, 10 enhanced",
  bdayB: "Birthday B — 25 min, 20 enhanced, set-up",
  kids: "Kids theme — 30 min, up to 4 pax",
  gradS: "Silver — toga + glam, 10 enhanced",
  gradG: "Gold — 15 enhanced, 8R framed photo",
  gradP: "Platinum — 20 enhanced + family shot",
};

const SWATCH: Record<(typeof BACKDROPS)[number]["name"], string> = {
  RED: "bg-backdrop-red",
  TAN: "bg-backdrop-tan",
  YELLOW: "bg-backdrop-yellow",
  PINK: "bg-backdrop-pink",
};

const CARD =
  "flex h-full flex-col rounded-[4px] bg-cream p-[14px_14px_20px] shadow-[0_12px_28px_rgba(30,30,40,.12)] transition-[transform,box-shadow] duration-300 ease-[ease] hover:[transform:translateY(-6px)] hover:shadow-[0_20px_44px_rgba(30,30,40,.18)]";

const CARD_BADGE =
  "absolute -top-[4px] -right-[14px] animate-bob-slow [border-radius:50%] bg-badge px-[14px] py-3 font-display text-[14px] tracking-[0.04em] whitespace-nowrap text-paper shadow-[0_4px_10px_rgba(20,40,80,.25)] [transform:rotate(9deg)]";

const CARD_TITLE = "mx-[2px] mt-4 mb-1 font-display text-[21px] tracking-[0.02em]";

const FOOTNOTE =
  "mx-[2px] mt-auto mb-0 pt-3 font-mono text-[10px] leading-[1.8] tracking-[0.06em] text-muted";

function PriceRow({
  label,
  price,
  productId,
}: {
  label: string;
  price: string;
  productId?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-[10px] border-b border-line px-[2px] py-[11px]">
      <span className="font-sans text-[13px]">{label}</span>
      <span className="inline-flex shrink-0 items-baseline gap-3">
        <span className="font-display text-[15px]">{price}</span>
        {productId ? <BookInline productId={productId} size="sm" /> : null}
      </span>
    </div>
  );
}

export function Packages() {
  return (
    <section
      id="packages"
      className="mx-auto max-w-[1240px] px-5 py-16 md:px-10 lg:px-14 lg:pt-24 lg:pb-[90px]"
    >
      <SectionHeading
        index="01"
        title="PACKAGES"
        note="THE STUDIO'S PUBLISHED PRICES — WHAT YOU SEE IS WHAT YOU PAY"
        className="mb-[44px]"
      />

      <div className="mb-[64px] grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-[56px]">
        <Reveal>
          <div className="mb-2 font-display text-[22px] tracking-[0.02em]">
            ORIGINAL PACKAGES
          </div>
          <p className="mt-0 mb-[18px] font-mono text-[10px] leading-[1.9] tracking-[0.08em] text-muted">
            {ORIGINAL_INCLUSIONS}
          </p>

          <div className="border-t-2 border-ink">
            {/* Below lg the name owns the whole row and duration / price / BOOK wrap
                under it, rather than squeezing four columns onto a phone. */}
            {productsIn("orig").map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-line px-[2px] py-[15px] lg:grid lg:grid-cols-[1fr_auto_auto_auto]"
              >
                <span className="w-full font-display text-[19px] tracking-[0.02em] lg:w-auto">
                  {p.name}{" "}
                  <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
                    — {p.pax}
                  </span>
                </span>
                <span className="mr-auto font-mono text-[10px] text-muted lg:mr-0">
                  {p.duration}
                </span>
                <span className="font-display text-[19px]">{pesoLabel(p.price)}</span>
                <BookInline productId={p.id} />
              </div>
            ))}
          </div>

          <p className="mt-[14px] mb-0 font-mono text-[10px] tracking-[0.08em] text-muted-2">
            {ORIGINAL_EXTRAS}
          </p>
        </Reveal>

        <Reveal delay={140}>
          {/* The tilt overflows a phone-width column, so it starts at lg. */}
          <div className="relative rounded-[4px] bg-cream p-[14px_14px_46px] shadow-[0_12px_28px_rgba(30,30,40,.14)] transition-[transform,box-shadow] duration-300 ease-[ease] hover:shadow-[0_22px_48px_rgba(30,30,40,.2)] lg:[transform:rotate(2deg)] lg:hover:[transform:rotate(0deg)]">
            <span
              aria-hidden="true"
              className="absolute -top-[11px] left-1/2 h-6 w-[92px] bg-tape shadow-[0_1px_2px_rgba(0,0,0,.1)] [transform:translateX(-50%)_rotate(-2deg)]"
            />
            <div className="relative aspect-[4/5]">
              <Photo
                id="session-original"
                enlargeable
                sizes="(max-width:1024px) 100vw, 40vw"
              />
              <span className="absolute -top-[6px] -right-[18px] animate-bob [border-radius:50%] bg-badge px-[18px] py-4 font-display text-[17px] tracking-[0.04em] whitespace-nowrap text-paper shadow-[0_4px_10px_rgba(20,40,80,.25)] [transform:rotate(9deg)]">
                FROM {pesoLabel(299)}
              </span>
            </div>
            <div className="absolute right-0 bottom-3 left-0 text-center font-script text-[21px] font-semibold text-ink-3">
              unlimited shots, keep your favorites
            </div>
          </div>
        </Reveal>
      </div>

      <div className="grid items-stretch gap-[34px] md:grid-cols-2 lg:grid-cols-3">
        <Reveal className="h-full">
          <article className={CARD}>
            <div className="relative aspect-[4/5]">
              <Photo
                id="session-birthday"
                enlargeable
                sizes="(max-width:1024px) 100vw, 33vw"
              />
              <span className={CARD_BADGE}>FROM {pesoLabel(599)}</span>
            </div>
            <h3 className={CARD_TITLE}>BIRTHDAY</h3>
            <div className="border-t border-line">
              {productsIn("bday").map((p) => (
                <PriceRow
                  key={p.id}
                  label={ROW_LABELS[p.id] ?? p.name}
                  price={pesoLabel(p.price)}
                  productId={p.id}
                />
              ))}
            </div>
            <p className={FOOTNOTE}>
              FREE 4R FRAMED PRINT + NUMBER BALLOON · KIDS THEMES: JUNGLE, DINOSAUR, CARS,
              PRINCESS, MERMAID
            </p>
          </article>
        </Reveal>

        <Reveal className="h-full">
          <article className={CARD}>
            <div className="relative aspect-[4/5]">
              <Photo
                id="session-graduation"
                enlargeable
                sizes="(max-width:1024px) 100vw, 33vw"
              />
              <span className={CARD_BADGE}>FROM {pesoLabel(499)}</span>
            </div>
            <h3 className={CARD_TITLE}>
              GRADUATION{" "}
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
                — PER HEAD
              </span>
            </h3>
            <div className="border-t border-line">
              {productsIn("grad").map((p) => (
                <PriceRow
                  key={p.id}
                  label={ROW_LABELS[p.id] ?? p.name}
                  price={pesoLabel(p.price)}
                  productId={p.id}
                />
              ))}
            </div>
            <p className={FOOTNOTE}>
              FREE TOGA + GRAD BACKDROP · SOFT + HARD COPIES · HMUA ADD-ON{" "}
              {pesoLabel(2500)} (FULL GLAM)
            </p>
          </article>
        </Reveal>

        <Reveal delay={140} className="h-full">
          <article className={CARD}>
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-[3px] bg-ink p-5 text-center">
              <div className="font-mono text-[12px] tracking-[0.3em] text-muted-2">
                ID PACKAGES
              </div>
              <div className="font-display text-[52px] leading-none text-paper sm:text-[64px]">
                {pesoLabel(150)}
              </div>
              <div className="font-mono text-[10px] leading-[2] tracking-[0.1em] text-faint">
                2×2 · 1×1 · PASSPORT SIZE
                <br />
                5 COMBOS — PICK AT THE COUNTER
                <br />
                PRINTED WHILE YOU WAIT
              </div>
            </div>
            <h3 className={CARD_TITLE}>ID + PRINTS</h3>
            <div className="border-t border-line">
              {productsIn("id").map((p) => (
                <PriceRow
                  key={p.id}
                  label="ID package — any combo"
                  price={pesoLabel(p.price)}
                  productId={p.id}
                />
              ))}
              <PriceRow
                label="Laminating — ID / A4"
                price={`${pesoLabel(30)} / ${pesoLabel(50)}`}
              />
              <PriceRow
                label="Document printing — per page"
                price={`FROM ${pesoLabel(3)}`}
              />
            </div>
            <p className={FOOTNOTE}>
              A4 / 8R PHOTO {pesoLabel(99)} · 4R FRAME {pesoLabel(150)} · A4 FRAME{" "}
              {pesoLabel(450)} · 8R FRAME {pesoLabel(599)}
            </p>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-16 grid items-center gap-8 rounded-lg border border-line p-[22px] lg:grid-cols-[auto_1fr] lg:gap-[44px] lg:p-[26px_32px]">
          <div>
            <div className="mb-1 font-display text-[16px] tracking-[0.02em]">
              BACKDROP COLORS
            </div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-muted">
              ONE FREE WITH EVERY PACKAGE
              <br />
              EXTRA COLOR +{pesoLabel(100)}
            </div>
          </div>
          <div className="flex gap-3 lg:gap-4">
            {BACKDROPS.map((b) => (
              <div key={b.name} className="flex-1">
                <div
                  aria-hidden="true"
                  className={`h-[68px] rounded-md transition-transform duration-[250ms] ease-[ease] hover:scale-[1.06] ${SWATCH[b.name]}`}
                />
                <div className="mt-[7px] text-center font-mono text-[9px] tracking-[0.18em] text-muted">
                  {b.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
