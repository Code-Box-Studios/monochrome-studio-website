"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { BookButton } from "@/components/ui/BookButton";

const NAV = [
  { href: "#packages", label: "PACKAGES" },
  { href: "#work", label: "WORK" },
  { href: "#how", label: "HOW IT WORKS" },
  { href: "#faq", label: "FAQ" },
  { href: "#visit", label: "VISIT" },
] as const;

const LINK = "font-mono text-[11px] tracking-[0.14em] no-underline transition-colors hover:text-accent";

/**
 * Sticky brand bar. Below `lg` the anchor list collapses into a disclosure
 * panel so the logo and the booking CTA — the only two things a phone user
 * needs from the chrome — always fit on one line.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-line bg-paper px-5 py-[10px] md:px-10 lg:gap-[26px] lg:px-14 lg:py-3">
      <a href="#top" className="flex items-center no-underline">
        <Image
          src="/brand/monochrome-logo.png"
          alt="Monochrome Studio"
          width={850}
          height={300}
          loading="eager"
          className="block h-[40px] w-auto lg:my-[-4px] lg:h-[54px]"
        />
      </a>

      <nav aria-label="Primary" className="hidden items-center gap-[26px] lg:flex">
        {NAV.map((item) => (
          <a key={item.href} href={item.href} className={LINK}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3 lg:gap-[26px]">
        <BookButton size="sm">
          <span className="sm:hidden">BOOK</span>
          <span className="hidden sm:inline">BOOK A SLOT</span>
        </BookButton>

        <button
          type="button"
          onClick={() => setOpen((was) => !was)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-md border border-line bg-paper lg:hidden"
        >
          <span aria-hidden className="block h-[1.5px] w-[18px] bg-ink" />
          <span aria-hidden className="block h-[1.5px] w-[18px] bg-ink" />
          <span aria-hidden className="block h-[1.5px] w-[18px] bg-ink" />
        </button>
      </div>

      <nav
        id="site-nav-mobile"
        aria-label="Primary"
        className={
          open
            ? "absolute inset-x-0 top-full flex flex-col border-b border-line bg-paper px-5 pb-3 shadow-[0_18px_30px_rgba(0,0,0,0.08)] md:px-10 lg:hidden"
            : "hidden"
        }
      >
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`${LINK} border-b border-line py-[14px] last:border-b-0`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
