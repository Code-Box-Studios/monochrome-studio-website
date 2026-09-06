import Image from "next/image";

import { STUDIO } from "@/lib/studio";

const QUICK_LINKS = [
  { href: "#packages", label: "PACKAGES" },
  { href: "#work", label: "WORK" },
  { href: "#faq", label: "FAQ" },
  { href: "#visit", label: "TERMS" },
  { href: "#visit", label: "PRIVACY" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t-0 bg-paper">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-5 py-9 md:px-10 lg:px-14">
        <span className="inline-flex items-baseline gap-3">
          <Image
            src="/brand/monochrome-logo.png"
            alt="Monochrome Studio"
            width={850}
            height={300}
            className="block h-[42px] w-auto"
          />
          <span className="font-script text-[17px] font-semibold text-muted">
            {STUDIO.tagline}
          </span>
        </span>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-[26px] gap-y-2">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-mono text-[10px] tracking-[0.14em] no-underline transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
          © 2026 MONOCHROME STUDIO · TAGUM CITY · ASIA/MANILA
        </span>
      </div>

      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-5 px-5 pb-[26px] font-mono text-[9px] tracking-[0.12em] text-faint-2 md:px-10 lg:px-14">
        <span className="text-pretty">
          PRICES FROM THE STUDIO&apos;S PUBLISHED PACKAGES · SLOTS + DOWNPAYMENTS ARE DEMO DATA
          FOR THIS PROTOTYPE
        </span>
        <span>
          POWERED BY{" "}
          <a href="#visit" className="font-bold text-muted no-underline">
            CODE BOX STUDIOS
          </a>
        </span>
      </div>
    </footer>
  );
}
