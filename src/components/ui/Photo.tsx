"use client";

import Image from "next/image";

import { PHOTOS, type PhotoId, type WorkImage } from "@/lib/photos";
import { usePhotos } from "./PhotoProvider";

interface CommonProps {
  /**
   * Hero only. Emits a `<link rel=preload>` for the LCP image. Next 16
   * deprecated `priority` in favour of this.
   */
  preload?: boolean;
  /** Responsive `sizes` hint; defaults to a sensible card width. */
  sizes?: string;
  /** Renders a zoom-in overlay button that opens the lightbox. */
  enlargeable?: boolean;
  /**
   * Where the empty-state note sits. Full-bleed surfaces that carry their own
   * overlay copy (the hero) use `top` so the two do not collide.
   */
  placeholderAlign?: "center" | "top";
  className?: string;
}

/**
 * Exactly one source. `id` names a slot in the file-system manifest; `image`
 * comes from the content layer and may be either a CMS upload or a file slot.
 * The union makes passing both — or neither — a compile error.
 */
type PhotoProps = CommonProps &
  ({ id: PhotoId; image?: never } | { image: WorkImage; id?: never });

/**
 * A photographic surface.
 *
 * Fills its (positioned, sized) parent. When neither the studio nor the CMS has
 * supplied a file, renders the art-direction note in its place rather than a
 * broken image — so the layout is always complete and it is obvious what is
 * missing.
 */
export function Photo({
  id,
  image,
  preload = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  enlargeable = false,
  placeholderAlign = "center",
  className = "",
}: PhotoProps) {
  const { sources, openLightbox } = usePhotos();

  // Collapse both prop shapes into one resolved source.
  const slot: WorkImage = image ?? { kind: "file", id: id as PhotoId };

  // A CMS slot always carries a url — content.ts drops entries without one —
  // so only the file-system branch can be empty, and it always has a note.
  const resolved =
    slot.kind === "cms"
      ? { url: slot.url, alt: slot.alt, note: "" }
      : {
          url: sources[slot.id] ?? null,
          alt: PHOTOS[slot.id].alt,
          note: PHOTOS[slot.id].placeholder,
        };

  if (!resolved.url) {
    return (
      <div
        className={`absolute inset-0 flex justify-center border-2 border-dashed border-line-strong bg-[repeating-linear-gradient(45deg,var(--color-sand)_0_14px,var(--color-paper)_14px_28px)] p-5 ${
          placeholderAlign === "top" ? "items-start pt-[12%]" : "items-center"
        } ${className}`}
      >
        <span className="text-center font-mono text-[10px] uppercase leading-[1.8] tracking-[0.12em] text-muted">
          {resolved.note}
        </span>
      </div>
    );
  }

  const url = resolved.url;
  const alt = resolved.alt;

  return (
    <>
      <Image
        src={url}
        alt={alt}
        fill
        preload={preload}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
      {enlargeable ? (
        <button
          type="button"
          onClick={() => openLightbox({ url, alt })}
          aria-label={`Enlarge photo: ${alt}`}
          className="absolute inset-0 z-[4] cursor-zoom-in border-none bg-transparent p-0"
        />
      ) : null}
    </>
  );
}
