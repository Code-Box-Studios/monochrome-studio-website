"use client";

import { useBooking } from "@/components/booking/BookingProvider";
import { pesoLabel } from "@/lib/format";
import {
  GROUP_LABELS,
  productsIn,
  type Product,
  type ProductGroup,
} from "@/lib/products";

const GROUPS: readonly ProductGroup[] = ["orig", "bday", "grad", "id"];

/** `3–4 PAX · 15 MIN · ₱599 · HOLD ₱200` */
function metaLine(product: Product): string {
  const price = `${pesoLabel(product.price)}${product.perHead ? "/HEAD" : ""}`;
  return `${product.pax} · ${product.duration} · ${price} · HOLD ${pesoLabel(
    product.downpayment,
  )}`;
}

export function StepPackage() {
  const { pickProduct } = useBooking();

  return (
    <div>
      <p className="m-0 mb-[10px] animate-step-in font-sans text-[14px] leading-[1.6] text-muted">
        Prices are the studio&rsquo;s published packages — what you see is what you pay.
        The downpayment holds your slot.
      </p>

      {GROUPS.map((group, groupIndex) => (
        <section key={group}>
          <h3
            className={`${
              groupIndex === 0 ? "mt-[18px]" : "mt-[26px]"
            } mb-[2px] font-mono text-[10px] font-bold tracking-[0.22em] text-muted`}
          >
            {GROUP_LABELS[group]}
          </h3>

          {productsIn(group).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => pickProduct(product.id)}
              // flex-wrap lets the long meta line drop under the name on a
              // narrow phone instead of pushing the drawer sideways.
              className="flex w-full cursor-pointer flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-[4px] border-b border-line bg-transparent p-[16px_4px] text-left hover:bg-sand"
            >
              <span className="font-display text-[17px] font-normal tracking-[0.02em] text-ink">
                {product.name}
              </span>
              <span className="font-mono text-[10px] tracking-[0.06em] text-muted sm:whitespace-nowrap">
                {metaLine(product)} →
              </span>
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}
