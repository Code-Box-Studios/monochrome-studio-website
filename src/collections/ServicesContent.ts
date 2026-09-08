import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'
import { revalidateOnChange, revalidateOnDelete } from '@/hooks/revalidateSite'

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
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
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
          'The photo for this package. The packages section has one photo per family of packages — original, birthday, graduation — so the photo shown is the one from whichever package in that family is ticked "featured" below. The ID packages are printed as type on black and have no photo.',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor({}),
      admin: {
        description:
          'NOT SHOWN ON THE SITE YET. There is no per-package page for this to appear on, so anything written here is stored and waiting. A short paragraph or two about the package — what the session feels like, who it suits. Do not repeat the price here.',
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
          'The small print under this family of packages, one line per row — e.g. "FREE 10 ENHANCED IMAGES", "OUTFIT CHANGE", "UNLIMITED PROPS". They are printed on one line separated by dots, in this order; drag the rows to reorder them. As with the photo, the lines used are the ones from whichever package in the family is ticked "featured".',
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
          'NOT SHOWN ON THE SITE YET, for the same reason as the description above. Extra sample photos for this package. For photos that do appear on the home page, use the Portfolio collection.',
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
        description:
          'Lower numbers appear first in the price list for this family of packages. Leave blank to fall back to the booking system order.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description:
          'Tick to let this package speak for its family on the home page: its photo and its small print are the ones shown above and below that price list. Tick it on one package per family — original, birthday, graduation, ID.',
      },
    },
  ],
}
