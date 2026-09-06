"use client";

import { useBooking } from "@/components/booking/BookingProvider";

/** Step 5 — the proof is in, a human takes it from here. */
export function StepDone() {
  const { state } = useBooking();

  return (
    <div role="status" className="animate-step-in pt-4">
      <div className="mb-[14px] font-mono text-[11px] tracking-[0.22em] text-muted">
        ( PROOF RECEIVED )
      </div>
      <div className="mb-2 font-display text-[26px] tracking-[0.02em] sm:text-[32px]">
        PROOF RECEIVED.
      </div>
      <div className="mb-4 font-sans text-[15px] leading-[1.6] text-muted">
        Salamat — a real human is checking your payment against the wallet now.
      </div>
      <p className="mb-[26px] max-w-[40ch] font-sans text-[14px] leading-[1.65] text-muted">
        {
          "Usually done within the hour during studio time. You'll get an email the moment it's confirmed."
        }
      </p>

      <div className="mb-4 rounded-[10px] border-2 border-ink bg-paper p-5 text-center">
        <div className="mb-2 font-mono text-[9px] tracking-[0.22em] text-muted">
          YOUR BOOKING REFERENCE
        </div>
        <div className="font-mono text-[22px] font-bold tracking-[0.18em] break-all sm:text-[26px]">
          {state.reference}
        </div>
      </div>

      {/* Plain text, not a link: /b/[reference] is not a route on this site yet. */}
      <div className="font-mono text-[11px] leading-[1.8] tracking-[0.04em] break-all text-muted">
        STATUS, ANY TIME →{" "}
        <span className="font-bold text-accent underline underline-offset-[3px]">
          monochrome.studio/b/{state.reference}
        </span>
      </div>
    </div>
  );
}
