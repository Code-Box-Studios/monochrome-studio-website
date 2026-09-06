"use client";

import { useBooking } from "@/components/booking/BookingProvider";
import {
  MONTHS_SHOWN,
  dayLabel,
  monthCells,
  type MonthRef,
} from "@/lib/availability";

const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;

/** Six skeletons, staggered .12s apart, matching the eight-slot grid's shape. */
const SKELETONS = [0, 1, 2, 3, 4, 5] as const;

const NAV_BASE =
  "grid h-[34px] w-[34px] place-items-center rounded-md border-[1.5px] font-mono text-[13px]";
const DAY_BASE =
  "h-[38px] rounded-full border-[1.5px] p-0 text-center font-sans text-[13px]";
const SLOT_BASE =
  "animate-pop-in rounded-lg border-[1.5px] p-[12px_4px] text-center font-mono text-[11px]";

/** `Saturday, September 12, 2026` — spoken, not shown. */
function fullDate(months: MonthRef[], monthIndex: number, day: number): string {
  const { year, month } = months[monthIndex];
  return new Date(year, month, day).toLocaleDateString("en", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function StepDateTime() {
  const { state, slots, setMonth, pickDay, pickSlot } = useBooking();
  const { months, monthIndex, selectedMonth, selectedDay, slotsLoading } = state;

  const cells = monthCells(months, monthIndex, state.today);
  const atFirstMonth = monthIndex === 0;
  const atLastMonth = monthIndex === MONTHS_SHOWN - 1;
  // A day whose every start time is already taken shows the empty state, not a
  // grid of struck-through buttons.
  const hasOpenSlot = slots.some((s) => !s.taken);

  return (
    <div>
      <div className="mb-[14px] flex animate-step-in items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          disabled={atFirstMonth}
          onClick={() => setMonth(monthIndex - 1)}
          className={`${NAV_BASE} ${
            atFirstMonth
              ? "cursor-default border-line text-faint"
              : "cursor-pointer border-line-strong text-ink hover:border-ink"
          }`}
        >
          ←
        </button>
        <span className="flex-1 text-center font-mono text-[12px] font-bold tracking-[0.2em] uppercase">
          {months[monthIndex].label}
        </span>
        <button
          type="button"
          aria-label="Next month"
          disabled={atLastMonth}
          onClick={() => setMonth(monthIndex + 1)}
          className={`${NAV_BASE} ${
            atLastMonth
              ? "cursor-default border-line text-faint"
              : "cursor-pointer border-line-strong text-ink hover:border-ink"
          }`}
        >
          →
        </button>
      </div>

      <div
        aria-hidden="true"
        className="mb-[6px] grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-muted"
      >
        {WEEKDAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (cell.day === null) {
            return <div key={`blank-${index}`} aria-hidden="true" className="h-[38px]" />;
          }
          const day = cell.day;
          const selected = selectedMonth === monthIndex && selectedDay === day;
          const edge =
            !selected && cell.isToday
              ? "border-dashed border-faint-2"
              : "border-transparent";
          const fill = selected
            ? "bg-accent font-semibold text-paper"
            : cell.disabled
              ? "cursor-default bg-transparent font-medium text-faint"
              : "cursor-pointer bg-transparent font-medium text-ink";

          return (
            <button
              key={day}
              type="button"
              disabled={cell.disabled}
              aria-pressed={selected}
              aria-label={fullDate(months, monthIndex, day)}
              onClick={() => pickDay(monthIndex, day)}
              className={`${DAY_BASE} ${edge} ${fill}`}
            >
              {cell.label}
            </button>
          );
        })}
      </div>

      <p className="mt-[10px] mb-0 font-mono text-[9px] leading-[1.7] tracking-[0.1em] text-faint-2">
        OPEN DAILY 9AM–7PM · FADED DATES ARE FULL, BLACKED OUT, OR OUTSIDE THE 45-DAY
        WINDOW · ALL TIMES ASIA/MANILA
      </p>

      {selectedMonth !== null && selectedDay !== null && (
        <>
          <h3 className="mt-[26px] mb-3 font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
            Open starts — {dayLabel(months, selectedMonth, selectedDay)}
          </h3>

          {slotsLoading ? (
            <div
              role="status"
              aria-busy="true"
              aria-label="Loading open start times"
              className="grid grid-cols-3 gap-2"
            >
              {SKELETONS.map((i) => (
                <div
                  key={i}
                  className="h-[40px] animate-pulse-slot rounded-md bg-bone"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          ) : hasOpenSlot ? (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((s, i) => {
                const selected = state.slot === s.label;
                const look = s.taken
                  ? "cursor-default border-bone bg-transparent font-normal text-faint line-through"
                  : selected
                    ? "cursor-pointer border-accent bg-accent font-bold text-paper"
                    : "cursor-pointer border-line-strong bg-paper font-normal text-ink";

                return (
                  <button
                    key={s.label}
                    type="button"
                    disabled={s.taken}
                    aria-pressed={selected}
                    aria-label={s.taken ? `${s.label} — already booked` : s.label}
                    onClick={() => pickSlot(s.label)}
                    style={{ animationDelay: `${i * 0.045}s` }}
                    className={`${SLOT_BASE} ${look}`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-line-strong p-[22px] text-center">
              <span className="font-mono text-[12px] text-muted">
                No open slots this day — try the next.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
