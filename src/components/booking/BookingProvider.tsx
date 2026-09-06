"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";

import { slotsForDay, type Slot } from "@/lib/availability";
import { priceFor } from "@/lib/products";
import { HOLD_MINUTES } from "@/lib/studio";
import {
  bookingReducer,
  initialBookingState,
  isExpired,
  isValidPhMobile,
  makeReference,
  selectedProduct,
  type BookingState,
  type Step,
} from "./booking-state";

/** How long the fake `/slots` round-trip takes, so the skeleton is visible. */
const SLOT_FETCH_MS = 620;
const MAX_RECEIPT_BYTES = 10 * 1024 * 1024;

type EditableField = "name" | "mobile" | "email" | "notes" | "payRef";

interface BookingContextValue {
  state: BookingState;
  /**
   * Payment-channel id -> QR image URL, for the QRs the studio has actually
   * supplied. Resolved on the server; absent ids render a placeholder.
   */
  qrSources: Record<string, string>;
  /** Derived money for this booking. */
  totals: { price: number; downpayment: number; balance: number };
  expired: boolean;
  slots: Slot[];

  openWizard: (productId?: string | null) => void;
  closeWizard: () => void;
  pickProduct: (productId: string) => void;
  setMonth: (monthIndex: number) => void;
  pickDay: (monthIndex: number, day: number) => void;
  pickSlot: (slot: string) => void;
  setField: (field: EditableField, value: string) => void;
  adjustHeadcount: (delta: number) => void;
  submitDetails: () => void;
  setReceipt: (file: File | null) => void;
  goto: (step: Step) => void;
  back: () => void;
  restart: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

export function BookingProvider({
  children,
  qrSources = {},
}: {
  children: ReactNode;
  qrSources?: Record<string, string>;
}) {
  // `new Date()` never reaches SSR output — the wizard is closed on the first
  // render — and `open` recaptures it, so a tab left open overnight still gets
  // the right "today".
  const [state, dispatch] = useReducer(bookingReducer, null, () =>
    initialBookingState(new Date()),
  );

  const previewUrl = useRef<string | null>(null);

  const expired = isExpired(state);
  const product = selectedProduct(state);

  /* ---- countdown: only ticks while a live hold is on screen ----
     `expired` must be in the guard: once the clock crosses zero the step and
     holdEnd both stay put, so without it the interval would keep dispatching
     forever behind the hold-expired screen, re-rendering every consumer of
     this context once a second to show nothing new. */
  useEffect(() => {
    if (!state.open || state.step !== 4 || !state.holdEnd || expired) return;
    const id = setInterval(() => dispatch({ type: "tick", now: Date.now() }), 1000);
    return () => clearInterval(id);
  }, [state.open, state.step, state.holdEnd, expired]);

  /* ---- the fake /slots round-trip ---- */
  useEffect(() => {
    if (!state.slotsLoading) return;
    const id = setTimeout(() => dispatch({ type: "slotsLoaded" }), SLOT_FETCH_MS);
    return () => clearTimeout(id);
  }, [state.slotsLoading, state.selectedMonth, state.selectedDay]);

  /* ---- lock the page behind the drawer ---- */
  useEffect(() => {
    if (!state.open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [state.open]);

  /* ---- release the last object URL on unmount ---- */
  useEffect(
    () => () => {
      if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    },
    [],
  );

  const openWizard = useCallback((productId: string | null = null) => {
    dispatch({ type: "open", productId, today: new Date() });
  }, []);

  const closeWizard = useCallback(() => dispatch({ type: "close" }), []);

  const pickProduct = useCallback(
    (productId: string) => dispatch({ type: "pickProduct", productId }),
    [],
  );

  const setMonth = useCallback(
    (monthIndex: number) => dispatch({ type: "setMonth", monthIndex }),
    [],
  );

  const pickDay = useCallback(
    (monthIndex: number, day: number) => dispatch({ type: "pickDay", monthIndex, day }),
    [],
  );

  const pickSlot = useCallback((slot: string) => dispatch({ type: "pickSlot", slot }), []);

  const setField = useCallback(
    (field: EditableField, value: string) => dispatch({ type: "setField", field, value }),
    [],
  );

  const adjustHeadcount = useCallback(
    (delta: number) => dispatch({ type: "adjustHeadcount", delta }),
    [],
  );

  const goto = useCallback((step: Step) => dispatch({ type: "goto", step }), []);
  const back = useCallback(() => dispatch({ type: "back" }), []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);

  /**
   * Step 3 to 4. In the shipped system this is `POST /api/book`, which forwards
   * to the bookings API with an Idempotency-Key and returns the real reference
   * and hold expiry; the countdown is sourced from that response, never
   * computed here.
   */
  const submitDetails = useCallback(() => {
    const errName = state.name.trim() ? "" : "WE NEED A NAME FOR THE BOOKING.";
    const errMobile = isValidPhMobile(state.mobile)
      ? ""
      : "ENTER A PH MOBILE, E.G. 0917 555 0000.";

    if (errName || errMobile) {
      dispatch({ type: "validationFailed", errName, errMobile });
      return;
    }

    const now = Date.now();
    dispatch({
      type: "hold",
      now,
      holdEnd: now + HOLD_MINUTES * 60_000,
      reference: makeReference(),
    });
  }, [state.name, state.mobile]);

  const setReceipt = useCallback((file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      dispatch({
        type: "receiptError",
        message: "THAT IS NOT AN IMAGE — JPG, PNG, OR HEIC PLEASE.",
      });
      return;
    }
    if (file.size > MAX_RECEIPT_BYTES) {
      dispatch({
        type: "receiptError",
        message: "OVER 10 MB — SCREENSHOT THE RECEIPT INSTEAD OF PHOTOGRAPHING IT.",
      });
      return;
    }

    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    const url = URL.createObjectURL(file);
    previewUrl.current = url;

    const size =
      file.size > 1_048_576
        ? `${(file.size / 1_048_576).toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;
    const kind = (file.type.split("/")[1] || "IMG").toUpperCase();

    dispatch({
      type: "setReceipt",
      receipt: { name: file.name, meta: `${size.toUpperCase()} · ${kind}`, previewUrl: url },
    });
  }, []);

  const totals = useMemo(() => {
    if (!product) return { price: 0, downpayment: 0, balance: 0 };
    const price = priceFor(product, state.headcount);
    const downpayment = product.downpayment;
    return { price, downpayment, balance: Math.max(0, price - downpayment) };
  }, [product, state.headcount]);

  const slots = useMemo<Slot[]>(
    () =>
      state.selectedMonth != null && state.selectedDay != null
        ? slotsForDay(state.selectedMonth, state.selectedDay)
        : [],
    [state.selectedMonth, state.selectedDay],
  );

  const value = useMemo<BookingContextValue>(
    () => ({
      state,
      qrSources,
      totals,
      expired,
      slots,
      openWizard,
      closeWizard,
      pickProduct,
      setMonth,
      pickDay,
      pickSlot,
      setField,
      adjustHeadcount,
      submitDetails,
      setReceipt,
      goto,
      back,
      restart,
    }),
    [
      state,
      qrSources,
      totals,
      expired,
      slots,
      openWizard,
      closeWizard,
      pickProduct,
      setMonth,
      pickDay,
      pickSlot,
      setField,
      adjustHeadcount,
      submitDetails,
      setReceipt,
      goto,
      back,
      restart,
    ],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}
