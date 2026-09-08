import type { Block, GlobalConfig } from 'payload'
import { revalidateGlobalOnChange } from '@/hooks/revalidateSite'

/**
 * The landing page layout.
 *
 * One block per section the home page actually renders (see `src/app/page.tsx`).
 * A block holds only the copy that section owns — headings, notes, CTA labels.
 * The lists a section displays stay in their own collections (portfolio images,
 * testimonial quotes, FAQ entries) and the package prices, durations and
 * downpayments are read live from the products API, never stored here, so the
 * page can never disagree with the till.
 *
 * The `( 01 )`-style numerals belong to the five heading-bearing sections only
 * (packages, portfolio, how-it-works, FAQ, visit). Hero, testimonials and the
 * CTA band carry no numeral, so the sequence is not the block position.
 */

const heroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero — opening frame', plural: 'Hero sections' },
  fields: [
    {
      name: 'headlineLine1',
      type: 'text',
      required: true,
      defaultValue: '15 MINUTES.',
      admin: {
        description: 'First line of the big headline over the photo. Example: "15 MINUTES."',
      },
    },
    {
      name: 'headlineAccentWord',
      type: 'text',
      required: true,
      defaultValue: 'UNLIMITED',
      admin: {
        description:
          'The one word printed in the studio red at the start of the second line. Example: "UNLIMITED".',
      },
    },
    {
      name: 'headlineLine2',
      type: 'text',
      defaultValue: 'SHOTS.',
      admin: {
        description: 'The rest of the second line, printed in white after the red word. Example: "SHOTS."',
      },
    },
    {
      name: 'subParagraph',
      type: 'textarea',
      admin: {
        description:
          'The short paragraph under the headline. Leave blank to use the positioning line from Site Settings. Two sentences at most — longer text covers the photo.',
      },
    },
    {
      name: 'primaryCtaLabel',
      type: 'text',
      defaultValue: 'BOOK A SLOT',
      admin: {
        description: 'Label on the red button. It always opens the booking wizard.',
      },
    },
    {
      name: 'secondaryCtaLabel',
      type: 'text',
      defaultValue: 'SEE PACKAGES ↓',
      admin: {
        description:
          'Label on the outlined button beside it. It jumps down to the packages section, so it is hidden automatically if you take that section off the page — it can never point at something that is not there.',
      },
    },
  ],
}

const packagesBlock: Block = {
  slug: 'packages',
  interfaceName: 'PackagesBlock',
  labels: { singular: 'Packages & prices', plural: 'Packages sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'PACKAGES',
      admin: { description: 'Section heading. Set in capitals to match the rest of the page.' },
    },
    {
      name: 'note',
      type: 'text',
      defaultValue: "THE STUDIO'S PUBLISHED PRICES — WHAT YOU SEE IS WHAT YOU PAY",
      admin: {
        description:
          'Small line printed to the right of the heading on wide screens. Keep it to one line — it is hidden on phones.',
      },
    },
    {
      name: 'polaroidCaption',
      type: 'text',
      defaultValue: 'unlimited shots, keep your favorites',
      admin: {
        description:
          'Handwritten caption under the taped photo beside the original packages table. A few words, lowercase.',
      },
    },
    {
      name: 'backdropHeading',
      type: 'text',
      defaultValue: 'BACKDROP COLORS',
      admin: { description: 'Heading on the colour-swatch strip at the bottom of the section.' },
    },
    {
      name: 'backdropNote',
      type: 'textarea',
      defaultValue: 'ONE FREE WITH EVERY PACKAGE\nEXTRA COLOR +₱100',
      admin: {
        description:
          'Small note beside the colour swatches. One thought per line. The four swatch colours are the studio’s actual backdrops and are set in code, not here. Every package price on this page is read live from the booking system — never type package prices here.',
      },
    },
  ],
}

const portfolioBlock: Block = {
  slug: 'portfolio',
  interfaceName: 'PortfolioBlock',
  labels: { singular: 'Recent work gallery', plural: 'Recent work sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'RECENT WORK',
      admin: { description: 'Section heading above the photo grid.' },
    },
    {
      name: 'note',
      type: 'text',
      defaultValue: 'REAL SESSIONS, LATEST FIRST',
      admin: {
        description:
          'Small line printed to the right of the heading on wide screens. The photos and their captions live in the Portfolio collection, not here.',
      },
    },
  ],
}

const howItWorksBlock: Block = {
  slug: 'howItWorks',
  interfaceName: 'HowItWorksBlock',
  labels: { singular: 'How it works — steps', plural: 'How it works sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'HOW IT WORKS',
      admin: { description: 'Section heading above the numbered steps.' },
    },
    {
      name: 'note',
      type: 'text',
      admin: {
        description: 'Optional small line printed to the right of the heading on wide screens.',
      },
    },
    {
      name: 'photoCaption',
      type: 'text',
      defaultValue: 'the room, between sessions',
      admin: {
        description:
          'Handwritten caption under the taped photo of the studio room. A few words, lowercase.',
      },
    },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      labels: { singular: 'Step', plural: 'Steps' },
      admin: {
        description:
          'The steps a customer goes through, in order. They are numbered 01, 02, 03 automatically — drag to reorder. Three steps is the design; more than four makes the column very tall.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { description: 'Short step title, e.g. "Book a slot".' },
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
          admin: {
            description:
              'One or two sentences explaining the step. Write {holdMinutes} anywhere and the live hold window from the booking system is filled in, so this copy never goes stale.',
          },
        },
      ],
    },
  ],
}

const testimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Customer quotes', plural: 'Customer quote sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description:
          'Optional heading above the quote cards. The design ships without one — leave this blank to keep the cards on their own.',
      },
    },
    {
      name: 'note',
      type: 'text',
      admin: {
        description:
          'Optional small line beside the heading. The quotes themselves are edited in the Testimonials collection; add, hide or reorder them there.',
      },
    },
  ],
}

const faqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ — ask us anything', plural: 'FAQ sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'ASK US ANYTHING',
      admin: { description: 'Section heading above the questions.' },
    },
    {
      name: 'note',
      type: 'text',
      defaultValue: 'THE {count} THAT COME UP MOST',
      admin: {
        description:
          'Small line printed to the right of the heading on wide screens. Write {count} and the number of questions you have published is spelled out in its place, so this line stays true when you add or remove one. The questions and answers themselves live in the FAQ collection.',
      },
    },
  ],
}

const ctaBandBlock: Block = {
  slug: 'ctaBand',
  interfaceName: 'CtaBandBlock',
  labels: { singular: 'Call-to-action band', plural: 'Call-to-action bands' },
  fields: [
    {
      name: 'headline',
      type: 'textarea',
      required: true,
      defaultValue: "THE CALENDAR IS HONEST — IF IT SHOWS A SLOT, IT'S YOURS.",
      admin: {
        description:
          'The one big line across the red band. Capitals, one sentence — this band is nothing but the line and the button.',
      },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'BOOK A SLOT',
      admin: { description: 'Label on the button. It opens the booking wizard.' },
    },
    {
      name: 'reassurance',
      type: 'text',
      defaultValue: 'HELD {holdMinutes} MIN WHILE YOU PAY · NO ACCOUNT NEEDED',
      admin: {
        description:
          'Small line under the button. Write {holdMinutes} and the live hold window from the booking system is filled in.',
      },
    },
  ],
}

const visitBlock: Block = {
  slug: 'visit',
  interfaceName: 'VisitBlock',
  labels: { singular: 'Visit — map & address', plural: 'Visit sections' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'VISIT',
      admin: { description: 'Section heading above the map.' },
    },
    {
      name: 'note',
      type: 'text',
      admin: {
        description:
          'Optional small line beside the heading. The address, opening hours, phone, email and social links all come from Site Settings so they can never disagree with the footer.',
      },
    },
  ],
}

export const LandingPage: GlobalConfig = {
  slug: 'landing-page',
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  label: 'Landing Page',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Content',
    description:
      'The home page, section by section. Drag a section to move it, or remove one to take it off the page.',
  },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page sections',
      admin: {
        description:
          'These are the sections of the home page, in the order visitors see them. Drag a section to move it and the live page reorders to match; remove one and it disappears from the page, along with its link in the menu. Each section holds only its own wording — photos, quotes, questions and prices are edited in their own places and follow the section wherever you put it. The ( 01 ) ( 02 ) numerals are counted from this order, so they stay correct however you arrange things, and the scrolling ticker travels with the opening frame. Add each section once: a second copy of one is ignored.',
      },
      blocks: [
        heroBlock,
        packagesBlock,
        portfolioBlock,
        howItWorksBlock,
        testimonialsBlock,
        faqBlock,
        ctaBandBlock,
        visitBlock,
      ],
    },
  ],
}
