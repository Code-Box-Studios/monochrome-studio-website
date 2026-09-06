"use client";

import Image from "next/image";

import { PHOTOS, type PhotoId } from "@/lib/photos";
import { usePhotos } from "./PhotoProvider";

interface PhotoProps {
  id: PhotoId;
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
 * A photographic surface.
 *
 * Fills its (positioned, sized) parent. When the studio has not yet supplied
 * the file, renders the art-direction note in its place rather than a broken
 * image — so the layout is always complete and it is obvious what is missing.
 */
export function Photo({
  id,
  preload = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  enlargeable = false,
  placeholderAlign = "center",
  className = "",
}: PhotoProps) {
  const { sources, openLightbox } = usePhotos();
  const spec = PHOTOS[id];
  const src = sources[id];

  if (!src) {
    return (
      <div
        className={`absolute inset-0 flex justify-center border-2 border-dashed border-line-strong bg-[repeating-linear-gradient(45deg,var(--color-sand)_0_14px,var(--color-paper)_14px_28px)] p-5 ${
          placeholderAlign === "top" ? "items-start pt-[12%]" : "items-center"
        } ${className}`}
      >
        <span className="text-center font-mono text-[10px] uppercase leading-[1.8] tracking-[0.12em] text-muted">
          {spec.placeholder}
        </span>
      </div>
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={spec.alt}
        fill
        preload={preload}
        sizes={sizes}
        className={`object-cover ${className}`}
      />
      {enlargeable ? (
        <button
          type="button"
          onClick={() => openLightbox(id)}
          aria-label={`Enlarge photo: ${spec.alt}`}
          className="absolute inset-0 z-[4] cursor-zoom-in border-none bg-transparent p-0"
        />
      ) : null}
    </>
  );
}
