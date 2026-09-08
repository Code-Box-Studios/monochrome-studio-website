import { Wordmark } from "@/components/ui/Wordmark";
import type { SiteInfo } from "@/lib/content";

import type { NavLink } from "./SiteHeader";

interface SiteFooterProps {
  site: SiteInfo;
  /** Same derivation as the header nav — only sections that are on the page. */
  links: NavLink[];
  /** Passed in so the whole page agrees on one build-time year. */
  year: number;
}

export function SiteFooter({ site, links, year }: SiteFooterProps) {
  const imprint = [site.name, site.locality, site.timezone]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();

  return (
    <footer className="border-t-0 bg-paper">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-5 py-9 md:px-10 lg:px-14">
        <span className="inline-flex items-baseline gap-3">
          <Wordmark logo={site.logo} name={site.name} className="block h-[42px] w-auto" />
          <span className="font-script text-[17px] font-semibold text-muted">
            {site.tagline}
          </span>
        </span>

        {links.length > 0 ? (
          <nav aria-label="Footer" className="flex flex-wrap gap-x-[26px] gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[10px] tracking-[0.14em] no-underline transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}

        <span className="font-mono text-[10px] tracking-[0.14em] text-muted">
          © {year} {imprint}
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
