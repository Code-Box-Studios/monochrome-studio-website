"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { PHOTOS, type PhotoId } from "@/lib/photos";

type PhotoMap = Partial<Record<PhotoId, string>>;

interface PhotoContextValue {
  sources: PhotoMap;
  openLightbox: (id: PhotoId) => void;
}

const PhotoContext = createContext<PhotoContextValue | null>(null);

export function usePhotos(): PhotoContextValue {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error("usePhotos must be used inside <PhotoProvider>");
  return ctx;
}

/**
 * Holds the server-resolved photo URLs and owns the single lightbox instance
 * shared by every photo on the page.
 */
export function PhotoProvider({
  sources,
  children,
}: {
  sources: PhotoMap;
  children: ReactNode;
}) {
  const [lightbox, setLightbox] = useState<PhotoId | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openLightbox = useCallback((id: PhotoId) => setLightbox(id), []);
  const close = useCallback(() => setLightbox(null), []);

  // It claims role="dialog" aria-modal, so it has to behave like one: focus in
  // on open, trapped while open, handed back to the thumbnail on close.
  useEffect(() => {
    if (!lightbox) return;

    const opener =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      // Only two controls, and both close — so any Tab just parks on the
      // close button rather than walking the page behind the scrim.
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      opener?.focus();
    };
  }, [lightbox, close]);

  const value = useMemo(() => ({ sources, openLightbox }), [sources, openLightbox]);
  const src = lightbox ? sources[lightbox] : undefined;

  return (
    <PhotoContext.Provider value={value}>
      {children}
      {lightbox && src ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged studio photo"
          className="fixed inset-0 z-[128]"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            onClick={close}
            className="animate-fade-in absolute inset-0 h-full w-full cursor-zoom-out bg-[rgba(16,17,20,0.82)]"
          />
          <div className="animate-lb-in pointer-events-none absolute left-1/2 top-1/2 max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-paper p-3 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
            <Image
              src={src}
              alt={PHOTOS[lightbox].alt}
              width={1200}
              height={1500}
              className="block max-h-[82vh] w-auto max-w-[min(680px,88vw)] object-contain"
            />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close photo"
            className="absolute right-6 top-[22px] z-[134] flex h-11 w-11 items-center justify-center rounded-full bg-paper font-mono text-[17px] text-ink shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform hover:scale-105"
          >
            ✕
          </button>
          <p className="pointer-events-none absolute bottom-[26px] left-1/2 z-[134] -translate-x-1/2 text-center font-mono text-[10px] tracking-[0.16em] text-white/85">
            CLICK ANYWHERE OUTSIDE TO CLOSE
          </p>
        </div>
      ) : null}
    </PhotoContext.Provider>
  );
}
