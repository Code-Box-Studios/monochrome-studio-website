import { BookInline } from "@/components/ui/BookButton";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Section, ServiceCopy } from "@/lib/content";
import { pesoLabel } from "@/lib/format";
import type { WorkImage } from "@/lib/photos";
import {
  ORIGINAL_EXTRAS,
  ORIGINAL_INCLUSIONS,
  productsIn,
  type Product,
  type ProductGroup,
} from "@/lib/products";
import { BACKDROPS } from "@/lib/studio";

/**
 * The descriptive row labels the design shipped with. A package that has its own
 * entry in `services-content` overrides these; the prices beside them always
 * come from PRODUCTS, so the page can never disagree with the till.
 */
const ROW_LABELS: Record<string, string> = {
  bdayA: "Birthday A — 20 min, 10 enhanced",
  bdayB: "Birthday B — 25 min, 20 enhanced, set-up",
  kids: "Kids theme — 30 min, up to 4 pax",
  gradS: "Silver — toga + glam, 10 enhanced",
  gradG: "Gold — 15 enhanced, 8R framed photo",
  gradP: "Platinum — 20 enhanced + family shot",
  idpkg: "ID package — any combo",
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

type ServiceIndex = ReadonlyMap<string, ServiceCopy>;

/** Cheapest package in a group — the "FROM ₱…" badge, read rather than retyped. */
function cheapest(group: ProductGroup): number {
  return Math.min(...productsIn(group).map((p) => p.price));
}

/**
 * Rows in their published order unless the studio has given a package an
 * explicit position; unset rows keep the order the till lists them in.
 */
function rowsFor(group: ProductGroup, services: ServiceIndex): Product[] {
  return productsIn(group)
    .map((product, index) => ({ product, index, order: services.get(product.id)?.order ?? null }))
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || a.index - b.index)
    .map((row) => row.product);
}

/**
 * The one package that speaks for its group on this page — its photo on the
 * card, its inclusions in the small print. A package ticked "featured" wins;
 * otherwise the first one in the group that has anything to say.
 */
function fromGroup<T>(
  group: ProductGroup,
  services: ServiceIndex,
  take: (service: ServiceCopy) => T | null,
): T | null {
  const entries = productsIn(group).flatMap((p) => {
    const service = services.get(p.id);
    return service ? [service] : [];
  });
  for (const service of [...entries.filter((s) => s.featured), ...entries]) {
    const value = take(service);
    if (value) return value;
  }
  return null;
}

const coverOf = (service: ServiceCopy) => service.cover;
const inclusionsOf = (service: ServiceCopy) =>
  service.inclusions.length ? service.inclusions.join(" · ") : null;

/** The design's own photo slot, used until the studio uploads a cover. */
function coverFor(group: ProductGroup, services: ServiceIndex, fallback: WorkImage): WorkImage {
  return fromGroup(group, services, coverOf) ?? fallback;
}

function labelFor(product: Product, services: ServiceIndex): string {
  return services.get(product.id)?.title ?? ROW_LABELS[product.id] ?? product.name;
}

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

interface PackagesProps {
  copy: Extract<Section, { kind: "packages" }>;
  /** Per-package editorial copy. Empty until the studio writes any. */
  services: ServiceCopy[];
}

export function Packages({ copy, services }: PackagesProps) {
  const byId: ServiceIndex = new Map(services.map((s) => [s.productId, s]));

  return (
    <section
      id="packages"
      className="mx-auto max-w-[1240px] px-5 py-16 md:px-10 lg:px-14 lg:pt-24 lg:pb-[90px]"
    >
      <SectionHeading
        index={copy.numeral}
        title={copy.heading}
        note={copy.note}
        className="mb-[44px]"
      />

      <div className="mb-[64px] grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-[56px]">
        <Reveal>
          <div className="mb-2 font-display text-[22px] tracking-[0.02em]">
            ORIGINAL PACKAGES
          </div>
          <p className="mt-0 mb-[18px] font-mono text-[10px] leading-[1.9] tracking-[0.08em] text-muted">
            {fromGroup("orig", byId, inclusionsOf) ?? ORIGINAL_INCLUSIONS}
          </p>

          <div className="border-t-2 border-ink">
            {/* Below lg the name owns the whole row and duration / price / BOOK wrap
                under it, rather than squeezing four columns onto a phone. */}
            {rowsFor("orig", byId).map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-line px-[2px] py-[15px] lg:grid lg:grid-cols-[1fr_auto_auto_auto]"
              >
                <span className="w-full font-display text-[19px] tracking-[0.02em] lg:w-auto">
                  {byId.get(p.id)?.title ?? p.name}{" "}
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
                image={coverFor("orig", byId, { kind: "file", id: "session-original" })}
                enlargeable
                sizes="(max-width:1024px) 100vw, 40vw"
              />
              <span className="absolute -top-[6px] -right-[18px] animate-bob [border-radius:50%] bg-badge px-[18px] py-4 font-display text-[17px] tracking-[0.04em] whitespace-nowrap text-paper shadow-[0_4px_10px_rgba(20,40,80,.25)] [transform:rotate(9deg)]">
                FROM {pesoLabel(cheapest("orig"))}
              </span>
            </div>
            <div className="absolute right-0 bottom-3 left-0 text-center font-script text-[21px] font-semibold text-ink-3">
              {copy.polaroidCaption}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="grid items-stretch gap-[34px] md:grid-cols-2 lg:grid-cols-3">
        <Reveal className="h-full">
          <article className={CARD}>
            <div className="relative aspect-[4/5]">
              <Photo
                image={coverFor("bday", byId, { kind: "file", id: "session-birthday" })}
                enlargeable
                sizes="(max-width:1024px) 100vw, 33vw"
              />
              <span className={CARD_BADGE}>FROM {pesoLabel(cheapest("bday"))}</span>
            </div>
            <h3 className={CARD_TITLE}>BIRTHDAY</h3>
            <div className="border-t border-line">
              {rowsFor("bday", byId).map((p) => (
                <PriceRow
                  key={p.id}
                  label={labelFor(p, byId)}
                  price={pesoLabel(p.price)}
                  productId={p.id}
                />
              ))}
            </div>
            <p className={FOOTNOTE}>
              {fromGroup("bday", byId, inclusionsOf) ??
                "FREE 4R FRAMED PRINT + NUMBER BALLOON · KIDS THEMES: JUNGLE, DINOSAUR, CARS, PRINCESS, MERMAID"}
            </p>
          </article>
        </Reveal>

        <Reveal className="h-full">
          <article className={CARD}>
            <div className="relative aspect-[4/5]">
              <Photo
                image={coverFor("grad", byId, { kind: "file", id: "session-graduation" })}
                enlargeable
                sizes="(max-width:1024px) 100vw, 33vw"
              />
              <span className={CARD_BADGE}>FROM {pesoLabel(cheapest("grad"))}</span>
            </div>
            <h3 className={CARD_TITLE}>
              GRADUATION{" "}
              <span className="font-mono text-[10px] tracking-[0.1em] text-muted">
                — PER HEAD
              </span>
            </h3>
            <div className="border-t border-line">
              {rowsFor("grad", byId).map((p) => (
                <PriceRow
                  key={p.id}
                  label={labelFor(p, byId)}
                  price={pesoLabel(p.price)}
                  productId={p.id}
                />
              ))}
            </div>
            <p className={FOOTNOTE}>
              {fromGroup("grad", byId, inclusionsOf) ??
                `FREE TOGA + GRAD BACKDROP · SOFT + HARD COPIES · HMUA ADD-ON ${pesoLabel(2500)} (FULL GLAM)`}
            </p>
          </article>
        </Reveal>

        <Reveal delay={140} className="h-full">
          <article className={CARD}>
            {/* The ID tile is type on ink by design — there is no photo slot here,
                so an ID cover image has nowhere to go. */}
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-[3px] bg-ink p-5 text-center">
              <div className="font-mono text-[12px] tracking-[0.3em] text-muted-2">
                ID PACKAGES
              </div>
              <div className="font-display text-[52px] leading-none text-paper sm:text-[64px]">
                {pesoLabel(cheapest("id"))}
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
              {rowsFor("id", byId).map((p) => (
                <PriceRow
                  key={p.id}
                  label={labelFor(p, byId)}
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
              {fromGroup("id", byId, inclusionsOf) ??
                `A4 / 8R PHOTO ${pesoLabel(99)} · 4R FRAME ${pesoLabel(150)} · A4 FRAME ${pesoLabel(450)} · 8R FRAME ${pesoLabel(599)}`}
            </p>
          </article>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-16 grid items-center gap-8 rounded-lg border border-line p-[22px] lg:grid-cols-[auto_1fr] lg:gap-[44px] lg:p-[26px_32px]">
          <div>
            <div className="mb-1 font-display text-[16px] tracking-[0.02em]">
              {copy.backdropHeading}
            </div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-muted">
              {copy.backdropNote.map((line, index) => (
                <span key={`backdrop-note-${index}`}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
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
