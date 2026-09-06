"use client";

import { useEffect, useRef } from "react";

import { useBooking } from "@/components/booking/BookingProvider";
import { selectedProduct, type Step } from "@/components/booking/booking-state";
import { dayLabel } from "@/lib/availability";

import { StepDateTime } from "./StepDateTime";
import { StepDetails } from "./StepDetails";
import { StepDone } from "./StepDone";
import { StepPackage } from "./StepPackage";
import { HoldExpired, StepPayment } from "./StepPayment";

const TITLE_ID = "booking-wizard-title";

const TITLES: Record<Step, string> = {
  1: "Pick a package",
  2: "When are you free?",
  3: "Who's coming?",
  4: "Almost yours.",
  5: "Salamat!",
};

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Tabbable descendants in DOM order, skipping anything display:none. */
function focusablesIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0,
  );
}

interface PrimaryAction {
  label: string;
  onClick: () => void;
  disabled: boolean;
}

/**
 * The booking drawer. Every step of the flow is hosted here, so the page is
 * never lost behind the customer and the chrome — progress, summary, one
 * primary button — stays identical from package to receipt.
 */
export function BookingWizard() {
  const { state, expired, closeWizard, goto, back, restart, submitDetails } = useBooking();
  const { open, step } = state;

  const panelRef = useRef<HTMLElement>(null);

  // Hand focus to the panel on open, and give it back to whatever opened us.
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.focus();
    return () => opener?.focus();
  }, [open]);

  // Escape closes; Tab cycles inside the panel instead of wandering off into
  // the page behind it.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeWizard();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const items = focusablesIn(panel);
      if (items.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !panel.contains(active);

      // `active === panel` matters on the very first Shift+Tab after opening:
      // focus sits on the panel itself, which `contains()` reports as inside,
      // so without this the browser default would walk out the back of the
      // dialog.
      if (event.shiftKey && (outside || active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (outside || active === last)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeWizard]);

  if (!open) return null;

  const product = selectedProduct(state);

  const summary: string[] = [];
  if (product) {
    summary.push(
      product.perHead && state.headcount > 1 ? `${product.name} × ${state.headcount}` : product.name,
    );
  }
  if (state.selectedMonth !== null && state.selectedDay !== null) {
    summary.push(dayLabel(state.months, state.selectedMonth, state.selectedDay).toUpperCase());
  }
  if (state.slot) summary.push(state.slot);

  const primary: PrimaryAction = expired
    ? { label: "PICK A NEW SLOT", onClick: restart, disabled: false }
    : step === 2
      ? {
          label: state.slot ? `CONTINUE — ${state.slot}` : "PICK A TIME TO CONTINUE",
          onClick: () => goto(3),
          disabled: state.slot === null,
        }
      : step === 3
        ? { label: "HOLD THIS SLOT", onClick: submitDetails, disabled: false }
        : step === 4
          ? {
              label: "SEND PROOF OF PAYMENT",
              onClick: () => goto(5),
              disabled: state.payRef.trim().length === 0 || state.receipt === null,
            }
          : { label: "BACK TO THE SITE", onClick: closeWizard, disabled: false };

  const showBack = step >= 2 && step <= 4 && !expired;

  return (
    <>
      {/* Click-outside-to-close. Hidden from assistive tech — the panel's own
          close button is the accessible route out. */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={closeWizard}
        className="fixed inset-0 z-[90] animate-fade-in border-none bg-[rgba(25,27,32,0.55)]"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        className="fixed top-0 right-0 bottom-0 z-[95] flex w-[min(472px,100vw)] animate-wiz-in flex-col bg-paper shadow-[-28px_0_70px_rgba(20,22,28,0.35)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line p-[16px_20px] sm:p-[16px_26px]">
          <div className="min-w-0">
            <div className="mb-[3px] font-mono text-[9px] tracking-[0.24em] text-muted">
              MONOCHROME STUDIO — BOOKING
            </div>
            <h2 id={TITLE_ID} className="font-display text-[21px] font-normal tracking-[0.02em]">
              {expired ? "Hold expired" : TITLES[step]}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeWizard}
            aria-label="Close booking"
            className="h-9 w-9 shrink-0 cursor-pointer rounded-md border-[1.5px] border-line-strong bg-transparent font-mono text-[15px] text-ink transition-colors hover:border-ink"
          >
            <span aria-hidden>✕</span>
          </button>
        </div>

        {/* Advancing a step swaps the whole panel but leaves focus on the
            primary button, so without this a screen-reader user gets no cue
            that anything happened. */}
        <p aria-live="polite" className="sr-only">
          {expired
            ? "Your hold expired. Pick a new slot."
            : `Step ${step} of 5: ${TITLES[step]}`}
        </p>

        <div className="h-[3px] bg-bone" aria-hidden>
          <div
            className="h-[3px] bg-accent transition-[width] duration-[350ms] ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-[14px] border-b border-line p-[10px_20px] sm:p-[10px_26px]">
          <span className="shrink-0 font-mono text-[9px] tracking-[0.18em] whitespace-nowrap text-muted">
            STEP {step} OF 5
          </span>
          <span className="truncate text-right font-mono text-[10px] tracking-[0.06em] text-ink">
            {summary.join(" · ")}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-[26px]">
          {step === 1 && <StepPackage />}
          {step === 2 && <StepDateTime />}
          {step === 3 && <StepDetails />}
          {step === 4 && (expired ? <HoldExpired /> : <StepPayment />)}
          {step === 5 && <StepDone />}
        </div>

        {step >= 2 && (
          <div className="flex gap-3 border-t border-line bg-paper p-[16px_20px] sm:p-[16px_26px]">
            {showBack && (
              <button
                type="button"
                onClick={back}
                className="shrink-0 cursor-pointer rounded-lg border-[1.5px] border-line-strong bg-transparent px-3 py-[14px] font-mono text-[11px] tracking-[0.12em] text-ink transition-colors hover:border-ink sm:px-5"
              >
                ← BACK
              </button>
            )}
            <button
              type="button"
              onClick={primary.onClick}
              disabled={primary.disabled}
              className={`flex-1 rounded-lg border-none px-3 py-[15px] font-mono text-[11px] leading-[1.35] font-bold tracking-[0.14em] text-balance text-paper sm:px-5 ${
                primary.disabled
                  ? "cursor-default bg-line-strong"
                  : "cursor-pointer bg-accent transition-[filter] hover:brightness-[0.92]"
              }`}
            >
              {primary.label}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
