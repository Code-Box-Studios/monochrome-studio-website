# Monochrome Studio — website

The marketing site and self-serve booking wizard for Monochrome Studio, Tagum City.

Implemented from the **`Monochrome Studio v5`** design-canvas artboard
(`claude.ai/design/p/3c8f81d6-05ae-4957-a943-f1447e1814c5`). That artboard is the
visual source of truth: layout, copy, type and colour all come from it.

Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind CSS v4 · pnpm

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm lint
```

---

## What is in here

| Area | State |
| --- | --- |
| Landing page — header, hero, marquee, packages, portfolio, how-it-works, testimonials, FAQ, CTA band, visit, footer | Built |
| Booking wizard — 5 steps, hold countdown, slot grid, proof upload, hold-expired and done states | Built, driving demo data |
| Responsive layout (the artboard was desktop-only; mobile is implemented from scratch) | Built |
| SEO — metadata, OpenGraph, `PhotographyBusiness` + `FAQPage` JSON-LD | Built |
| Payload CMS at `/admin` — the studio profile, the page layout, portfolio, testimonials, FAQ, per-package copy | Built, and driving the page |
| The bookings-API proxies, transactional email, the confirm-poller | **Not built** — see [Integration seams](#integration-seams) |

The wizard is fully interactive but **not yet transactional**: availability, holds
and payment proof are local state. Nothing is persisted and no money moves.

### What the admin actually drives

Sections are blocks on the `landing-page` global. Dragging one reorders the live
page, removing one takes it off — along with its entry in the header and footer
menus, so a link can never point at a section that is gone. The `( 01 )` numerals
are counted from the rendered order rather than stored, and `{holdMinutes}` and
`{count}` are substituted at render so copy about the hold window or the number
of questions cannot go stale.

Every getter falls back to the launch copy in `src/lib/*`. A missing
`DATABASE_URI`, an unreachable database and an empty collection all degrade to
the same page, which is why this deploys with or without a database.

Still code-driven, deliberately: package prices, durations and downpayments come
from `src/lib/products.ts` (the products-API seam) so the page can never disagree
with the till; the four backdrop swatches; the payment channels and terms, which
stay in code until the bookings API is live.

---

## Assets you need to add

### Session photography — required

`public/photos/` ships empty. The design-canvas API caps asset downloads at
256 KiB and truncated every session photo mid-file (only 10–22% of each PNG
survived), so importing them would have meant committing corrupt images.

Drop real files into `public/photos/` using these names — any of
`.avif` `.webp` `.jpg` `.jpeg` `.png`, preferred in that order:

| File | Frame | What belongs in it |
| --- | --- | --- |
| `hero` | 16:9 landscape | A real session in the room |
| `session-original` | 4:5 | A session from the original packages |
| `session-birthday` | 4:5 | Birthday session — number balloon + set-up |
| `session-graduation` | 4:5 | Graduation — toga + glam |
| `studio-room` | 3:4 | The room between sessions — backdrops + props wall |
| `work-1` … `work-6` | 4:5 | Portfolio: solo, collective, duo, graduation, birthday, kids theme |

They are picked up on the next render — no code change, no manifest edit.
`src/lib/photos.server.ts` scans the directory; `src/lib/photos.ts` holds the alt
text and art-direction note for each slot. Until a file exists, that slot renders
its art-direction note in place, so the layout is always complete and it is
obvious what is missing.

### Payment QR codes — add these LAST

> **Do not add real payment details until the bookings API is wired up.**
>
> The wizard is convincing but not transactional: it mints a reference with
> `Math.random()`, says the slot is held, shows payment instructions and tells
> the customer *"a real human is checking your payment"* — and then stores
> nothing, emails nobody, and 404s on the status link it just told them to
> bookmark. Today the account number is the artboard's fake `0917 555 0142`, so
> no money can move. Swap in the studio's real QR and number **before** the API
> exists and you have a live till with no booking system behind it: customers
> pay, and the booking is gone.
>
> Wire the three seams in [Integration seams](#integration-seams) first, or
> disable the step-4 submit and label the flow a preview.

The payment step reads `PAYMENT_CHANNELS` in `src/lib/studio.ts` and expects
`public/brand/qr-gcash.png` and `public/brand/qr-maya.png`. These are **not**
committed on purpose: a QR code for a live payment account is a payment surface,
not a design asset. When the backend is ready, add the studio's real QR images
and update the numbers and account names in `PAYMENT_CHANNELS` at the same time.

Same drop-in contract as the photos — `resolvePaymentQrs()` checks which files
exist, so adding them lights up both the 84px thumbnail and the full-size
"VIEW FULL SIZE ⤢" view with no code change. Until then each channel shows its
account number with a labelled placeholder where the QR goes.

### Already here

`public/brand/monochrome-logo.png` — the studio logotype, imported intact.

---

## Layout of the code

```
src/
├─ app/
│  ├─ layout.tsx        fonts, metadata, LocalBusiness JSON-LD, skip link
│  ├─ page.tsx          composes the page inside the two providers
│  └─ globals.css       design tokens (@theme), keyframes, base + reveal styles
├─ components/
│  ├─ sections/         one file per landing-page section
│  ├─ booking/          the wizard: provider, reducer, shell, five steps
│  └─ ui/               Photo, PhotoProvider (+ lightbox), Reveal,
│                       SectionHeading, BookButton, ColorBar
└─ lib/
   ├─ studio.ts         studio profile, hours, payment channels, terms
   ├─ products.ts       the 13 published packages
   ├─ availability.ts   calendar + slot rules (the demo generator)
   ├─ photos.ts         photo manifest, alt text, portfolio items
   ├─ photos.server.ts  resolves which photo + QR files actually exist
   └─ format.ts         peso + countdown formatting
```

**Design tokens** live once, in `globals.css` under `@theme`, and are used by
name everywhere (`bg-cream`, `text-muted`, `border-line`, `font-display`, …).
Change the accent in one place and the whole site follows.

---

## Integration seams

The spec (`studio-site-spec.md`) puts commerce behind a bookings API: it owns
availability, holds, payments and verification, and this site owns pixels,
content and customer email. Three places are shaped for that swap and nothing
else needs to move:

1. **`src/lib/availability.ts`** — the demo slot generator. Replace `slotsForDay`
   with a fetch of `/api/availability` and keep the `Slot[]` shape. Every
   rule (lead time, advance window, blackouts, start times) is stated once here
   so there is no second place to disagree with the API.
2. **`BookingProvider.submitDetails`** (`src/components/booking/BookingProvider.tsx`)
   — currently mints a local reference and hold expiry. This becomes
   `POST /api/book` with an `Idempotency-Key`; the reference, downpayment and
   hold expiry all come from the response, and the countdown is sourced from it
   rather than computed.
3. **`BookingProvider.setReceipt`** — currently validates and previews the file
   locally. The submit on step 4 becomes
   `POST /api/bookings/{ref}/proof` (multipart). Per the spec this is a
   **relay, never retain**: the screenshot must not be written to this app's
   database or storage.

Prices already come from `src/lib/products.ts` rather than being hard-coded into
the markup, so pointing that module at `GET /products` is a one-file change and
the marketing page cannot disagree with the till.

Also still to build, in rough order: the thin proxy route handlers with zod
validation, Resend emails, and the confirm-poller cron.

### Database changes

`push` is off in `payload.config.ts`. Payload otherwise syncs the config's schema
straight to the database on any run where `NODE_ENV !== 'production'` — including
`pnpm seed` and one-off scripts — and there is only one database here, the live
one. So a field change means generating a migration and running it:

```bash
pnpm exec payload migrate:create <name>   # writes src/migrations/
pnpm exec payload migrate                 # applies it
```

The deploy build command must run `payload migrate` before `next build`.

> **One-time cleanup needed before the first deploy.** `payload_migrations`
> carries a `dev` row, left by a dev-mode push that happened before `push` was
> turned off. While that row is there, `payload migrate` opens an interactive
> prompt — *"you've dynamically pushed changes to your database … data loss will
> occur. Would you like to proceed?"* — which a CI build cannot answer, so the
> deploy stalls or skips the migration.
>
> The database schema is already correct: the one pending migration
> (`faq_note_count_token`) is a `SET DEFAULT` that the push already applied. So
> the fix is bookkeeping, not DDL — record that migration as run and drop the
> `dev` marker:
>
> ```sql
> DELETE FROM payload_migrations WHERE batch = -1;
> ```
>
> Match on `batch = -1`, which is the condition the code actually tests
> (`@payloadcms/drizzle/dist/migrate.js`), not on the name. Do not hand-insert a
> row for the pending migration — once the marker is gone, `payload migrate`
> runs it and records it itself, and the migration is an idempotent
> `ALTER … SET DEFAULT` that the dev push had already applied.
>
> Verified behaviour with the marker present, stdin closed as in CI:
> `pnpm payload migrate` renders the prompt and never returns. There is no flag
> to skip it — `--force-accept-warning` is wired only to `migrate:create` and
> `migrate:fresh`, while `case 'migrate'` calls `adapter.migrate()` with no
> arguments.

`pnpm seed` fills an empty admin with the launch content so the studio has
something to edit rather than a blank form. It skips anything already there —
collections with documents, and globals that have been written — so running it
twice never overwrites the studio's own words.

---

## Notes on the implementation

- **The artboard is desktop-only** (it is wrapped in `min-width: 1080px`). The
  mobile layout is new work, built mobile-first, because the spec is explicit
  that the wizard's primary device is a phone. Section shell is
  `mx-auto max-w-[1240px] px-5 md:px-10 lg:px-14`.
- **Scroll reveals** render visible on the server and only hide themselves once
  JS has run *and* the element is still below the fold — so nothing above the
  fold flashes, and with JS off or `prefers-reduced-motion` set, nothing is ever
  hidden.
- **The wizard is a real dialog**: focus moves in on open, is trapped while open,
  returns to the opener on close, and Escape closes.
- **Times are Asia/Manila.** There is no DST, which is why the demo generator can
  use plain local dates. Real slot maths belongs in the API, not here.
- The footer's "SLOTS + DOWNPAYMENTS ARE DEMO DATA FOR THIS PROTOTYPE" line is
  true today. Remove it when the API is wired.

## Environment

Copy `.env.example` to `.env.local`. Nothing in it is required for the site to
run today; the variables are the contract for the phases above.
