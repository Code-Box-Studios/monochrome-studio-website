"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useBooking } from "@/components/booking/BookingProvider";
import { PAYMENT_CHANNELS, type PaymentChannel } from "@/lib/studio";

/**
 * The studio's e-wallet channels on the payment step.
 *
 * The QR image files are not in the repo — a QR for a live payment account is
 * studio-supplied config, not a design asset, and the artboard's were
 * placeholders for a demo number. `resolvePaymentQrs()` checks which ones exist
 * in `public/brand/`, so dropping the real files in lights up both the 84px
 * thumbnail and the full-size view with no code change. Until then the slot
 * says what is missing.
 */
export function PaymentChannels() {
  const { qrSources } = useBooking();
  const [expanded, setExpanded] = useState<string | null>(null);

  const channel = PAYMENT_CHANNELS.find((c) => c.id === expanded) ?? null;
  const expandedSrc = expanded ? qrSources[expanded] : undefined;

  return (
    <div className="mb-[22px] flex flex-col gap-[10px]">
      {PAYMENT_CHANNELS.map((c) => (
        <ChannelRow
          key={c.id}
          channel={c}
          qr={qrSources[c.id]}
          onExpand={() => setExpanded(c.id)}
        />
      ))}

      {channel && expandedSrc ? (
        <QrDialog
          channel={channel}
          src={expandedSrc}
          onClose={() => setExpanded(null)}
        />
      ) : null}
    </div>
  );
}

function ChannelRow({
  channel,
  qr,
  onExpand,
}: {
  channel: PaymentChannel;
  qr: string | undefined;
  onExpand: () => void;
}) {
  return (
    <div className="flex items-center gap-[14px] rounded-[10px] border-[1.5px] border-line bg-paper p-[12px_14px]">
      <div className="h-[84px] w-[84px] flex-none">
        {qr ? (
          <Image
            src={qr}
            alt={`${channel.label} QR code for ${channel.number}`}
            width={168}
            height={168}
            className="h-full w-full rounded-lg object-contain"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg border-[1.5px] border-dashed border-line-strong text-center"
          >
            <span className="font-mono text-[13px] font-bold tracking-[0.16em] text-muted">
              QR
            </span>
            <span className="px-1 font-mono text-[8px] leading-[1.4] tracking-[0.1em] text-muted">
              ADD {channel.label} QR
            </span>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="font-mono text-[12px] font-bold tracking-[0.14em]">
          {channel.label}
        </div>
        <div className="mt-1 font-mono text-[14px]">{channel.number}</div>
        <div className="mt-[2px] font-mono text-[10px] leading-[1.5] text-muted">
          {channel.accountName}
        </div>
        {qr ? (
          <button
            type="button"
            onClick={onExpand}
            className="mt-2 cursor-pointer border-none bg-transparent p-0 font-mono text-[10px] font-bold tracking-[0.1em] text-accent underline underline-offset-[3px] transition-[transform,filter] duration-200 hover:translate-x-[3px] hover:brightness-75"
          >
            VIEW FULL SIZE ⤢
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** The QR blown up to scanning size, over its own scrim. */
function QrDialog({
  channel,
  src,
  onClose,
}: {
  channel: PaymentChannel;
  src: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Stop the wizard's own Escape handler from closing the whole drawer.
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key === "Tab") {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      opener?.focus();
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${channel.label} QR code`}>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className="animate-fade-in fixed inset-0 z-[120] bg-[rgba(25,27,32,0.74)]"
      />
      <div className="fixed top-1/2 left-1/2 z-[126] flex max-h-[90vh] w-[min(320px,84vw)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 overflow-y-auto rounded-xl bg-paper p-[14px] shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
        <Image
          src={src}
          alt={`${channel.label} QR code for ${channel.number}`}
          width={640}
          height={640}
          className="aspect-square w-full flex-none rounded-lg object-contain"
        />
        <div className="flex flex-col items-center gap-[6px] pb-1 text-center">
          <span className="font-mono text-[12px] font-bold tracking-[0.22em]">
            {channel.label}
          </span>
          <span className="font-mono text-[18px]">{channel.number}</span>
          <span className="font-mono text-[9px] tracking-[0.1em] text-muted">
            {channel.accountName}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mt-[6px] cursor-pointer rounded-md border-none bg-ink px-[22px] py-[11px] font-mono text-[10px] font-bold tracking-[0.14em] text-paper"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
