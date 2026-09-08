import type { CollectionConfig } from 'payload'

/**
 * Customer quotes shown on the homepage testimonial band.
 *
 * Mirrors the `QUOTES` array in `src/components/sections/Testimonials.tsx`,
 * where each card renders the star row, the quote, and a `cite` line built as
 * `NAME — ATTRIBUTION` (e.g. "KAT R. — GRADUATION GOLD").
 *
 * Content only: no prices, durations or downpayments live here — those are read
 * live from the products API so the site can never disagree with the till.
 */
export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'attribution', 'rating', 'featured', 'order'],
    group: 'Content',
    description:
      'Short customer quotes for the homepage. Three of them fit across the band on a wide screen.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description:
          'Who said it, the way it should appear on the card — e.g. "KAT R." or "THE DIZON FAMILY". The site shows this in capitals.',
      },
    },
    {
      name: 'attribution',
      type: 'text',
      admin: {
        description:
          'The package or context shown after the name — e.g. "GRADUATION GOLD", "SOLO", "COLLECTIVE A". The site adds the dash between the two, so do not type one here. Leave blank to show the name on its own.',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'What they said, in their words. Type the sentence only — the site adds the quotation marks around it. One or two sentences reads best; long quotes make the card taller than the two beside it.',
      },
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        description: 'Stars shown above the quote, from 1 to 5. Leave at 5 unless the review really was lower.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional photo of the customer. The current homepage cards are text only, so this is only used if the layout starts showing faces.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Tick to pick this quote for the homepage band.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lowest number shows first, left to right. Leave blank and it falls to the end.',
      },
    },
  ],
}
