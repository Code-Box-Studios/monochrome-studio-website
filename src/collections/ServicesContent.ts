import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

/**
 * The marketing layer around each bookable package.
 *
 * Price, duration and downpayment are deliberately NOT stored here: they are
 * read live from the bookings API (`GET /public/v1/products`) so the website can
 * never disagree with the till — see studio-site-spec.md §4. Everything in this
 * collection is editorial copy keyed to a product id from that API.
 */
export const ServicesContent: CollectionConfig = {
  slug: 'services-content',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'productId',
    defaultColumns: ['productId', 'title', 'featured', 'order', 'updatedAt'],
    group: 'Content',
    description:
      'Photos and wording for each package. Prices, session lengths and downpayments are not edited here — those come from the booking system so the website always matches the counter.',
  },
  fields: [
    {
      name: 'productId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description:
          'The package code from the booking system — it has to match exactly, or this content will not show up. Current codes: solo, duo, colA, colB, colC, colD, bdayA, bdayB, kids, gradS, gradG, gradP, idpkg.',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description:
          'Optional. Leave blank to use the package name from the booking system (e.g. "GRAD GOLD"). Fill this in only when you want the website to show a different name.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'The single photo used for this package on the packages section and in listings.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description:
          'A short paragraph or two about the package — what the session feels like, who it suits. Do not repeat the price here.',
      },
    },
    {
      name: 'inclusions',
      type: 'array',
      labels: {
        singular: 'Inclusion',
        plural: 'Inclusions',
      },
      admin: {
        description:
          'The bullet list shown under the package, one line per row — e.g. "FREE 10 ENHANCED IMAGES", "OUTFIT CHANGE", "UNLIMITED PROPS". Drag the rows to reorder them.',
      },
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      labels: {
        singular: 'Gallery photo',
        plural: 'Gallery photos',
      },
      admin: {
        description:
          'Extra sample photos for this package, shown after the cover image. Drag the rows to change the order they appear in.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first. Leave blank to fall back to the booking system order.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Tick to highlight this package on the homepage.',
      },
    },
  ],
}
