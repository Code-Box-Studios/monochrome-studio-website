"use client";

import { useMemo, useState } from "react";

import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { WorkEntry } from "@/lib/content";
import { WORK_CATEGORIES, type WorkCategory } from "@/lib/photos";

interface WorkProps {
  /** Portfolio entries, already resolved by the page. */
  items: WorkEntry[];
}

export function Work({ items }: WorkProps) {
  const [active, setActive] = useState<WorkCategory>("all");

  const shown = useMemo(
    () => (active === "all" ? items : items.filter((item) => item.category === active)),
    [active, items],
  );

  return (
    <section
      id="work"
      className="mx-auto max-w-[1240px] px-5 pt-[10px] pb-16 md:px-10 lg:px-14 lg:pb-[100px]"
    >
      <SectionHeading
        index="02"
        title="RECENT WORK"
        note="REAL SESSIONS, LATEST FIRST"
        className="mb-[30px]"
      />

      <div
        role="group"
        aria-label="Filter recent work by session type"
        className="mb-10 flex flex-wrap gap-3"
      >
        {WORK_CATEGORIES.map((category) => {
          const isActive = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(category.id)}
              className={`rounded-md border-[1.5px] px-4 py-2 font-mono text-[10.5px] tracking-[0.12em] transition-colors duration-200 ${
                isActive
                  ? "border-ink bg-ink text-paper"
                  : "border-line-strong text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {shown.length === 1 ? "1 session shown" : `${shown.length} sessions shown`}
      </p>

      <div className="grid items-start gap-[34px] sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <Reveal key={item.key} delay={item.delay}>
            {/* The scatter is decorative and overflows a one-column phone layout,
                so the tilt/stagger only exist from the two-column breakpoint up. */}
            <figure
              style={
                {
                  "--tilt": `${item.tilt}deg`,
                  "--offset": `${item.offsetY}px`,
                } as React.CSSProperties
              }
              className="m-0 rounded-[4px] bg-cream p-[12px_12px_14px] shadow-[0_10px_24px_rgba(30,30,40,.12)] transition-[transform,box-shadow] duration-[250ms] ease-[ease] hover:shadow-[0_18px_38px_rgba(30,30,40,.18)] sm:[transform:rotate(var(--tilt))_translateY(var(--offset))] sm:hover:[transform:rotate(0deg)_translateY(calc(var(--offset)_-_4px))]"
            >
              <div className="relative aspect-[4/5]">
                <Photo
                  image={item.image}
                  enlargeable
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                />
              </div>
              <figcaption className="mt-[10px] flex items-baseline justify-between gap-[10px]">
                <span className="font-script text-[19px] font-semibold text-ink-3">
                  {item.caption}
                </span>
                <span className="shrink-0 font-mono text-[9px] tracking-[0.12em] text-muted-2 uppercase">
                  {item.category}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
