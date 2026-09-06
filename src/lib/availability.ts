/**
 * Calendar + slot availability.
 *
 * ── Where this goes in the real system ──────────────────────────────────
 * The site never computes availability in production. Sentry owns operating
 * windows, turnaround, blackouts, lead time and the advance window, and
 * `GET /public/v1/slots?resource&date&package` returns start times already
 * filtered by all of them (studio-site-spec.md §3).
 *
 * What follows is the demo generator the design prototypes against. It is
 * deliberately pure and synchronous so the swap is a one-function change:
 * replace `slotsForDay` with a fetch of `/api/availability` and keep the
 * `Slot[]` shape. Every rule below is stated once, here, so there is no
 * second place that can disagree with the API once it lands.
 */

/** Days out from today before the earliest bookable date. */
export const MIN_NOTICE_DAYS = 1;
/** How far ahead the calendar opens. */
export const MAX_ADVANCE_DAYS = 45;
/** Months offered in the picker, counting the current one. */
export const MONTHS_SHOWN = 3;
/**
 * Month the picker opens on — index into `buildMonths()`. The demo blackout
 * and full-day markers sit in this month so their states are visible without
 * paging.
 */
export const INITIAL_MONTH_INDEX = 1;

export interface MonthRef {
  year: number;
  month: number;
  label: string;
}

export interface DayCell {
  /** Day of month, or null for the leading blanks before the 1st. */
  day: number | null;
  label: string;
  disabled: boolean;
  isToday: boolean;
}

export interface Slot {
  /** `9:00 AM` — the label is also the value the wizard carries forward. */
  label: string;
  taken: boolean;
}

export function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

/** The months offered in the picker, starting with `today`'s month. */
export function buildMonths(today: Date): MonthRef[] {
  return Array.from({ length: MONTHS_SHOWN }, (_, k) => {
    const d = new Date(today.getFullYear(), today.getMonth() + k, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth(),
      label: d.toLocaleString("en", { month: "long", year: "numeric" }),
    };
  });
}

/** Demo blackout: a three-day closure in the month the picker opens on. */
function isBlackout(monthIndex: number, day: number): boolean {
  return monthIndex === INITIAL_MONTH_INDEX && (day === 18 || day === 19 || day === 20);
}

/** Demo full day: every slot already taken, so the day shows an empty state. */
function isFullDay(monthIndex: number, day: number): boolean {
  return monthIndex === INITIAL_MONTH_INDEX && day === 26;
}

/**
 * One month of cells, Monday-first, with leading blanks so the 1st lands
 * under the right weekday.
 */
export function monthCells(months: MonthRef[], monthIndex: number, today: Date): DayCell[] {
  const { year, month } = months[monthIndex];
  const minDate = addDays(today, MIN_NOTICE_DAYS);
  const maxDate = addDays(today, MAX_ADVANCE_DAYS);

  const first = new Date(year, month, 1);
  // getDay() is Sunday-first; shift so Monday is column 0.
  const leading = (first.getDay() + 6) % 7;
  const lastDay = new Date(year, month + 1, 0).getDate();

  const cells: DayCell[] = [];
  for (let i = 0; i < leading; i++) {
    cells.push({ day: null, label: "", disabled: true, isToday: false });
  }
  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      label: String(day),
      disabled: date < minDate || date > maxDate || isBlackout(monthIndex, day),
      isToday: date.getTime() === today.getTime(),
    });
  }
  return cells;
}

/** The studio's fixed session start times, as [hour, minute] in 24h. */
const START_TIMES: readonly (readonly [number, number])[] = [
  [9, 0],
  [10, 0],
  [11, 30],
  [13, 0],
  [14, 30],
  [16, 0],
  [17, 0],
  [18, 0],
];

function timeLabel(hour: number, minute: number): string {
  const h12 = ((hour + 11) % 12) + 1;
  return `${h12}:${minute === 0 ? "00" : minute} ${hour < 12 ? "AM" : "PM"}`;
}

/**
 * Start times for one day. Returns `[]` for a full day so the caller can show
 * the "no open slots" state rather than a grid of struck-through buttons.
 */
export function slotsForDay(monthIndex: number, day: number): Slot[] {
  if (isFullDay(monthIndex, day)) return [];
  return START_TIMES.map(([hour, minute], i) => ({
    label: timeLabel(hour, minute),
    // Deterministic pseudo-bookings, so the same day always looks the same.
    taken: (day * 3 + i * 5) % 4 === 0 || (day % 7 === 0 && i > 5),
  }));
}

/** `Sat, Sep 12` — the heading above the slot grid. */
export function dayLabel(months: MonthRef[], monthIndex: number, day: number): string {
  const { year, month } = months[monthIndex];
  return new Date(year, month, day).toLocaleDateString("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
