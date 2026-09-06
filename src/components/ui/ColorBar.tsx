import { BACKDROPS } from "@/lib/studio";

/**
 * The four backdrop colours, as a 5px rule. Used under the header and above
 * the footer — it is the studio's product range doubling as a graphic device.
 */
export function ColorBar({ id, className = "" }: { id?: string; className?: string }) {
  return (
    <div id={id} aria-hidden className={`flex h-[5px] ${className}`}>
      {BACKDROPS.map((backdrop) => (
        <div key={backdrop.name} className="flex-1" style={{ background: backdrop.hex }} />
      ))}
    </div>
  );
}
