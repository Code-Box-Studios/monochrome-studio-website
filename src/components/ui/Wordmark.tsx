import Image from "next/image";

import type { SiteLogo } from "@/lib/content";

/** The wordmark that ships in the repo, used until the studio uploads one. */
const SHIPPED = { url: "/brand/monochrome-logo.png", width: 850, height: 300 };

interface WordmarkProps {
  logo: SiteLogo | null;
  /** Alt text when no upload is set — the studio name reads better than a filename. */
  name: string;
  /** Header only: the wordmark is above the fold, so it must not lazy-load. */
  eager?: boolean;
  className: string;
}

export function Wordmark({ logo, name, eager = false, className }: WordmarkProps) {
  const source = logo ?? { ...SHIPPED, alt: name };

  return (
    <Image
      src={source.url}
      alt={source.alt}
      width={source.width}
      height={source.height}
      loading={eager ? "eager" : "lazy"}
      className={className}
    />
  );
}
