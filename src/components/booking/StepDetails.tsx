"use client";

import { useId } from "react";

import { useBooking } from "@/components/booking/BookingProvider";
import { selectedProduct } from "@/components/booking/booking-state";
import { HOLD_MINUTES } from "@/lib/studio";

const LABEL =
  "block font-mono text-[10px] tracking-[0.16em] text-muted mb-[7px]";
const FIELD =
  "w-full rounded-lg border-[1.5px] border-line-strong bg-paper px-4 py-[13px] font-sans text-[15px] text-ink transition-colors focus:border-ink";
const ERROR = "mt-[5px] font-mono text-[10px] leading-[1.6] text-accent";
const STEP_BTN =
  "h-[38px] w-[38px] shrink-0 cursor-pointer rounded-lg border-[1.5px] border-line-strong bg-transparent font-mono text-[16px] text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line-strong";

/** Step 3 — who is coming, and how we reach them on the day. */
export function StepDetails() {
  const { state, setField, adjustHeadcount } = useBooking();
  const product = selectedProduct(state);
  const id = useId();

  const maxPax = product ? product.maxPax : 12;
  const paxNote = product
    ? `(${product.pax}${product.perHead ? " — PRICE MULTIPLIES" : ""})`
    : "";

  return (
    <div className="relative animate-step-in">
      <p className="mb-[22px] font-sans text-[14px] leading-[1.6] text-muted">
        Almost there — submitting this holds your slot for {HOLD_MINUTES} minutes while you
        pay.
      </p>

      <div className="flex flex-col gap-[18px]">
        <div>
          <label className={LABEL} htmlFor={`${id}-name`}>
            NAME *
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Juana de la Cruz"
            value={state.name}
            onChange={(e) => setField("name", e.target.value)}
            aria-invalid={state.errName ? true : undefined}
            aria-describedby={state.errName ? `${id}-name-err` : undefined}
            className={FIELD}
          />
          {state.errName ? (
            <div id={`${id}-name-err`} role="alert" className={ERROR}>
              {state.errName}
            </div>
          ) : null}
        </div>

        <div>
          <label className={LABEL} htmlFor={`${id}-mobile`}>
            MOBILE * — FOR DAY-OF COORDINATION
          </label>
          <input
            id={`${id}-mobile`}
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0917 555 0000"
            value={state.mobile}
            onChange={(e) => setField("mobile", e.target.value)}
            aria-invalid={state.errMobile ? true : undefined}
            aria-describedby={state.errMobile ? `${id}-mobile-err` : undefined}
            className={FIELD}
          />
          {state.errMobile ? (
            <div id={`${id}-mobile-err`} role="alert" className={ERROR}>
              {state.errMobile}
            </div>
          ) : null}
        </div>

        <div>
          <label className={LABEL} htmlFor={`${id}-email`}>
            EMAIL — FOR YOUR CONFIRMATION (OPTIONAL)
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={state.email}
            onChange={(e) => setField("email", e.target.value)}
            className={FIELD}
          />
        </div>

        <div role="group" aria-labelledby={`${id}-pax`}>
          <span id={`${id}-pax`} className={LABEL}>
            HOW MANY OF YOU? {paxNote}
          </span>
          <div className="flex items-center gap-[14px]">
            <button
              type="button"
              onClick={() => adjustHeadcount(-1)}
              disabled={state.headcount <= 1}
              aria-label="One fewer person"
              className={STEP_BTN}
            >
              −
            </button>
            <span
              role="status"
              aria-live="polite"
              className="min-w-[2ch] text-center font-display text-[20px]"
            >
              {state.headcount}
            </span>
            <button
              type="button"
              onClick={() => adjustHeadcount(1)}
              disabled={state.headcount >= maxPax}
              aria-label="One more person"
              className={STEP_BTN}
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className={LABEL} htmlFor={`${id}-notes`}>
            OCCASION / NOTES — PET? EXTRA BACKDROP? PROPS?
          </label>
          <textarea
            id={`${id}-notes`}
            name="notes"
            rows={3}
            placeholder="Grad photos for my sister, plus one very excited corgi"
            value={state.notes}
            onChange={(e) => setField("notes", e.target.value)}
            className={`${FIELD} resize-y leading-[1.5]`}
          />
        </div>
      </div>

      {/* Spam control: humans never see this, bots fill it. Inert until the
          wizard posts to a real endpoint, which must drop any submission
          that carries a value here. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          id={`${id}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
