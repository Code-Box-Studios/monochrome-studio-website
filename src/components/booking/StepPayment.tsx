"use client";

import { useId } from "react";

import { useBooking } from "@/components/booking/BookingProvider";
import { PaymentChannels } from "@/components/booking/PaymentChannels";
import { countdown, pesoLabel } from "@/lib/format";
import { HOLD_MINUTES, PAYMENT_TERMS } from "@/lib/studio";

const HOLD_MS = HOLD_MINUTES * 60_000;
/** Below this the countdown goes red — the last stretch to finish paying. */
const URGENT_MS = 3 * 60_000;

const LABEL = "block font-mono text-[10px] tracking-[0.16em] text-muted mb-[7px]";

/** Step 4 — the hold is live, the money moves, the proof comes back. */
export function StepPayment() {
  const { state, totals, setField, setReceipt } = useBooking();
  const id = useId();

  const remaining = Math.max(0, state.holdEnd - state.now);
  const urgent = remaining < URGENT_MS;
  const heldUntil = state.holdEnd
    ? new Date(state.holdEnd).toLocaleTimeString("en", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="animate-step-in">
      <div className="mb-6 rounded-[10px] border-2 border-ink bg-paper p-[16px_18px_14px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 font-mono text-[9px] tracking-[0.2em] text-muted">
              SLOT HELD UNTIL
            </div>
            <div className="font-display text-[24px] tracking-[0.02em]">{heldUntil}</div>
          </div>
          {/* aria-live="off": a screen reader must not re-read the clock every
              second. The deadline is announced once, below. */}
          <div
            role="timer"
            aria-live="off"
            className={`font-mono text-[26px] font-bold tabular-nums ${
              urgent ? "text-accent" : "text-ink"
            }`}
          >
            {countdown(remaining)}
          </div>
        </div>
        <div className="mt-3 h-1 rounded bg-bone">
          <div
            className="h-1 rounded bg-accent transition-[width] duration-1000 ease-linear"
            style={{ width: `${Math.min(100, (remaining / HOLD_MS) * 100)}%` }}
          />
        </div>
        <p className="sr-only">
          Your slot is held until {heldUntil}. Send the downpayment and upload the receipt
          before then.
        </p>
      </div>

      <div className="mb-6">
        <div className="font-display text-[36px] leading-none sm:text-[42px]">
          {pesoLabel(totals.downpayment)}
        </div>
        <div className="mt-[6px] font-mono text-[10px] tracking-[0.14em] text-muted">
          DOWNPAYMENT DUE NOW · BALANCE {pesoLabel(totals.balance)} AT THE STUDIO
        </div>
      </div>

      <PaymentChannels />

      <div className="mb-[14px] rounded-lg bg-sand p-[14px_16px] font-mono text-[10.5px] leading-[1.8] tracking-[0.04em] text-ink-2">
        {PAYMENT_TERMS}
      </div>

      <div className="mb-7 rounded-lg border-[1.5px] border-dashed border-line-strong bg-paper p-[14px_16px]">
        <div className="mb-[6px] font-mono text-[9px] tracking-[0.2em] text-muted">
          YOUR STATUS PAGE — BOOKMARK IT
        </div>
        {/* Plain text, not a link: /b/[reference] is not a route on this site yet. */}
        <div className="font-mono text-[13px] font-bold break-all text-accent underline underline-offset-[3px]">
          monochrome.studio/b/{state.reference}
        </div>
        <div className="mt-[6px] font-sans text-[12px] leading-[1.5] text-muted">
          {"Always check it before sending money — it's the truth about this booking."}
        </div>
      </div>

      <div className="border-t border-line pt-[22px]">
        <div className="mb-4 font-mono text-[10px] tracking-[0.18em] text-muted">
          AFTER PAYING, PROVE IT —
        </div>

        <label className={LABEL} htmlFor={`${id}-payref`}>
          REFERENCE NO. FROM YOUR E-WALLET *
        </label>
        <input
          id={`${id}-payref`}
          name="payRef"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="e.g. 9021 3355 7810"
          value={state.payRef}
          onChange={(e) => setField("payRef", e.target.value)}
          className="w-full rounded-lg border-[1.5px] border-line-strong bg-paper px-4 py-[13px] font-mono text-[15px] tracking-[0.06em] text-ink transition-colors focus:border-ink"
        />

        <label
          htmlFor={`${id}-receipt`}
          className="mt-[18px] block cursor-pointer rounded-[10px] border-2 border-dashed border-line-strong bg-paper p-[18px] text-center transition-colors hover:border-ink focus-within:border-ink"
        >
          {/* sr-only rather than display:none — the picker has to stay keyboard-reachable. */}
          <input
            id={`${id}-receipt`}
            name="receipt"
            type="file"
            accept="image/*"
            className="sr-only"
            aria-invalid={state.receiptError ? true : undefined}
            aria-describedby={state.receiptError ? `${id}-receipt-err` : undefined}
            onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
          />
          {state.receipt ? (
            <span className="flex items-center gap-3 text-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.receipt.previewUrl}
                alt="Receipt preview"
                className="h-[46px] w-[46px] flex-none rounded-md border-[1.5px] border-line object-cover"
              />
              <span className="min-w-0">
                <span className="block font-mono text-[12px] break-all text-ink">
                  {state.receipt.name}
                </span>
                <span className="mt-[3px] block font-mono text-[10px] text-muted">
                  {state.receipt.meta} · CLICK TO REPLACE
                </span>
              </span>
            </span>
          ) : (
            <span className="font-mono text-[11px] leading-[1.8] tracking-[0.1em] text-muted">
              DROP YOUR RECEIPT SCREENSHOT HERE
              <br />
              JPG / PNG / HEIC · UP TO 10 MB
            </span>
          )}
        </label>

        {state.receiptError ? (
          <div
            id={`${id}-receipt-err`}
            role="alert"
            className="mt-[6px] font-mono text-[10px] leading-[1.6] text-accent"
          >
            {state.receiptError}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Shown in place of step 4 once the countdown reaches zero. */
export function HoldExpired() {
  return (
    <div className="animate-step-in py-9 text-center">
      <div className="mb-[14px] font-mono text-[12px] tracking-[0.2em] text-accent">
        ( HOLD EXPIRED )
      </div>
      <div className="mb-3 font-display text-[26px] tracking-[0.02em] sm:text-[30px]">
        YOUR HOLD LAPSED.
      </div>
      <p className="mx-auto max-w-[34ch] font-sans text-[14px] leading-[1.6] text-muted">
        The slot went back on the shelf — someone else may take it. Pick a new one; it takes
        a minute.
      </p>
    </div>
  );
}
