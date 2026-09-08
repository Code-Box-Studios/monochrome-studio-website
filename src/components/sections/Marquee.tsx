const COPY = "font-mono text-[11px] tracking-[0.18em] text-muted";

interface MarqueeProps {
  /** The announcement strip from site settings. */
  text: string;
}

/**
 * The ticker under the hero. The track holds the copy twice back to back so
 * the -50% keyframe lands exactly on the seam and the loop is invisible.
 */
export function Marquee({ text }: MarqueeProps) {
  if (!text.trim()) return null;

  return (
    <div className="overflow-hidden border-y border-line bg-paper py-[10px]">
      <div className="inline-block animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
        <span className={COPY}>{text}</span>
        <span aria-hidden className={COPY}>
          {text}
        </span>
      </div>
    </div>
  );
}
