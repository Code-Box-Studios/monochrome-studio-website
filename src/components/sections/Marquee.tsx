import { STUDIO } from "@/lib/studio";

const COPY = "font-mono text-[11px] tracking-[0.18em] text-muted";

/**
 * The ticker under the hero. The track holds the copy twice back to back so
 * the -50% keyframe lands exactly on the seam and the loop is invisible.
 */
export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line bg-paper py-[10px]">
      <div className="inline-block animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
        <span className={COPY}>{STUDIO.marquee}</span>
        <span aria-hidden className={COPY}>
          {STUDIO.marquee}
        </span>
      </div>
    </div>
  );
}
