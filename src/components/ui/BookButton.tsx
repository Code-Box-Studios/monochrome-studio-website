"use client";

import { useBooking } from "@/components/booking/BookingProvider";

type Tone = "accent" | "ink";
type Size = "sm" | "md" | "lg";

const TONES: Record<Tone, string> = {
  accent: "bg-accent text-paper",
  ink: "bg-ink text-paper",
};

const SIZES: Record<Size, string> = {
  sm: "px-[22px] py-3 text-[11px]",
  md: "px-[30px] py-4 text-[12px]",
  lg: "px-[34px] py-[18px] text-[12px]",
};

interface BookButtonProps {
  /** Deep-links the wizard to a package and skips straight to the calendar. */
  productId?: string | null;
  tone?: Tone;
  size?: Size;
  className?: string;
  children?: React.ReactNode;
}

/**
 * The primary call to action. Every instance on the page opens the same
 * wizard, so the flow can never fork.
 */
export function BookButton({
  productId = null,
  tone = "accent",
  size = "md",
  className = "",
  children = "BOOK A SLOT",
}: BookButtonProps) {
  const { openWizard } = useBooking();

  return (
    <button
      type="button"
      onClick={() => openWizard(productId)}
      className={`cursor-pointer rounded-md border-none font-mono font-bold tracking-[0.14em] transition-[transform,box-shadow] duration-200 hover:scale-[1.04] hover:shadow-[0_12px_26px_rgba(0,0,0,0.28)] ${TONES[tone]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * The inline "BOOK →" affordance used inside price tables — an underlined
 * accent link that nudges right on hover.
 */
export function BookInline({
  productId,
  size = "md",
  label = "BOOK →",
}: {
  productId: string;
  size?: "sm" | "md";
  label?: string;
}) {
  const { openWizard } = useBooking();

  return (
    <button
      type="button"
      onClick={() => openWizard(productId)}
      className={`cursor-pointer border-none bg-transparent p-0 font-mono font-bold text-accent underline underline-offset-[3px] transition-[transform,filter] duration-200 hover:translate-x-1 hover:brightness-75 ${
        size === "sm"
          ? "text-[10px] tracking-[0.08em]"
          : "text-[11px] tracking-[0.1em] underline-offset-4"
      }`}
    >
      {label}
    </button>
  );
}
