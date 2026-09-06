import {
  buildMonths,
  INITIAL_MONTH_INDEX,
  MONTHS_SHOWN,
  startOfDay,
  type MonthRef,
} from "@/lib/availability";
import { getProduct, type Product } from "@/lib/products";

export type Step = 1 | 2 | 3 | 4 | 5;

export interface ReceiptFile {
  name: string;
  /** `1.4 MB · PNG` */
  meta: string;
  previewUrl: string;
}

export interface BookingState {
  open: boolean;
  step: Step;
  productId: string | null;

  /** Midnight today, captured when the wizard opens. */
  today: Date;
  months: MonthRef[];
  monthIndex: number;
  selectedMonth: number | null;
  selectedDay: number | null;
  slotsLoading: boolean;
  slot: string | null;

  name: string;
  mobile: string;
  email: string;
  headcount: number;
  notes: string;
  errName: string;
  errMobile: string;

  /** Epoch ms at which the hold lapses; 0 before a hold exists. */
  holdEnd: number;
  now: number;
  reference: string;

  payRef: string;
  receipt: ReceiptFile | null;
  receiptError: string;
}

export type BookingAction =
  | { type: "open"; productId: string | null; today: Date }
  | { type: "close" }
  | { type: "pickProduct"; productId: string }
  | { type: "setMonth"; monthIndex: number }
  | { type: "pickDay"; monthIndex: number; day: number }
  | { type: "slotsLoaded" }
  | { type: "pickSlot"; slot: string }
  | { type: "setField"; field: "name" | "mobile" | "email" | "notes" | "payRef"; value: string }
  | { type: "adjustHeadcount"; delta: number }
  | { type: "validationFailed"; errName: string; errMobile: string }
  | { type: "hold"; holdEnd: number; reference: string; now: number }
  | { type: "tick"; now: number }
  | { type: "setReceipt"; receipt: ReceiptFile }
  | { type: "receiptError"; message: string }
  | { type: "goto"; step: Step }
  | { type: "back" }
  | { type: "restart" };

function emptyDaySelection<T extends BookingState>(state: T): T {
  return { ...state, selectedMonth: null, selectedDay: null, slot: null, slotsLoading: false };
}

export function initialBookingState(today: Date): BookingState {
  const day = startOfDay(today);
  return {
    open: false,
    step: 1,
    productId: null,
    today: day,
    months: buildMonths(day),
    monthIndex: INITIAL_MONTH_INDEX,
    selectedMonth: null,
    selectedDay: null,
    slotsLoading: false,
    slot: null,
    name: "",
    mobile: "",
    email: "",
    headcount: 1,
    notes: "",
    errName: "",
    errMobile: "",
    holdEnd: 0,
    now: 0,
    reference: "",
    payRef: "",
    receipt: null,
    receiptError: "",
  };
}

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "open": {
      const product = getProduct(action.productId);
      const today = startOfDay(action.today);
      return {
        ...emptyDaySelection(state),
        open: true,
        // Deep-linking from a package card skips straight to the calendar.
        step: action.productId ? 2 : 1,
        productId: action.productId,
        headcount: product ? product.basePax : 1,
        today,
        months: buildMonths(today),
        monthIndex: INITIAL_MONTH_INDEX,
      };
    }

    case "close":
      return { ...state, open: false };

    case "pickProduct": {
      const product = getProduct(action.productId);
      return {
        ...emptyDaySelection(state),
        step: 2,
        productId: action.productId,
        headcount: product ? product.basePax : 1,
      };
    }

    case "setMonth":
      return {
        ...state,
        monthIndex: Math.min(MONTHS_SHOWN - 1, Math.max(0, action.monthIndex)),
      };

    case "pickDay":
      return {
        ...state,
        selectedMonth: action.monthIndex,
        selectedDay: action.day,
        slot: null,
        slotsLoading: true,
      };

    case "slotsLoaded":
      return { ...state, slotsLoading: false };

    case "pickSlot":
      return { ...state, slot: action.slot };

    case "setField": {
      const next = { ...state, [action.field]: action.value } as BookingState;
      // Clear the inline error as soon as the customer edits the field.
      if (action.field === "name") next.errName = "";
      if (action.field === "mobile") next.errMobile = "";
      return next;
    }

    case "adjustHeadcount": {
      const product = getProduct(state.productId);
      const max = product ? product.maxPax : 12;
      return {
        ...state,
        headcount: Math.min(max, Math.max(1, state.headcount + action.delta)),
      };
    }

    case "validationFailed":
      return { ...state, errName: action.errName, errMobile: action.errMobile };

    case "hold":
      return {
        ...state,
        errName: "",
        errMobile: "",
        step: 4,
        holdEnd: action.holdEnd,
        now: action.now,
        reference: action.reference,
      };

    case "tick":
      return { ...state, now: action.now };

    case "setReceipt":
      return { ...state, receipt: action.receipt, receiptError: "" };

    case "receiptError":
      return { ...state, receipt: null, receiptError: action.message };

    case "goto":
      return { ...state, step: action.step };

    case "back":
      return { ...state, step: Math.max(1, state.step - 1) as Step };

    case "restart":
      // The hold lapsed: drop it and send them back to the calendar.
      return { ...emptyDaySelection(state), step: 2, holdEnd: 0 };

    default:
      return state;
  }
}

/** A hold exists, we are on the payment step, and the clock has run out. */
export function isExpired(state: BookingState): boolean {
  return state.step === 4 && state.holdEnd > 0 && state.holdEnd - state.now <= 0;
}

export function selectedProduct(state: BookingState): Product | null {
  return getProduct(state.productId);
}

/**
 * PH mobile: `09XXXXXXXXX` (11 digits) or `639XXXXXXXXX` (12 digits).
 * Punctuation and spacing are ignored so people can paste however they like.
 */
export function isValidPhMobile(input: string): boolean {
  const digits = input.replace(/[^0-9]/g, "");
  return (
    (digits.length === 11 && digits.startsWith("09")) ||
    (digits.length === 12 && digits.startsWith("639"))
  );
}

/** `MNC-4F7QK` — unambiguous, so nobody reads an O as a zero down the phone. */
export function makeReference(): string {
  return (
    "MNC-" +
    Math.random().toString(36).slice(2, 7).toUpperCase().replace(/[O0]/g, "X")
  );
}
