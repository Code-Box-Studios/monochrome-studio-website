import type { GlobalConfig } from 'payload'
import { revalidateGlobalOnChange } from '@/hooks/revalidateSite'

/**
 * Everything the site says about the studio itself: the copy on the hero and
 * the marquee, the Visit block, and the e-wallet channels shown on the payment
 * step. This is the Payload home of `STUDIO`, `PAYMENT_TERMS` and
 * `PAYMENT_CHANNELS` in `src/lib/studio.ts`; field names mirror those objects
 * so wiring the frontend is a swap, not a rewrite.
 *
 * Deliberately absent (spec section 4): prices, durations and downpayments,
 * which are read live from the products API so the site can never disagree
 * with the till, and anything to do with slots, holds, bookings or blocked
 * dates, which belong to the commerce API.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description:
      'Your studio name, address, hours, contact details and payment channels. Package prices are not edited here, they come straight from the till so the website and the counter always agree.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Studio',
          admin: {
            description: 'The name, the one-liners and the logo used across the whole site.',
          },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              admin: {
                description:
                  'The studio name, used in the browser tab, in search results and as the logo image description.',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              admin: {
                description:
                  'The short handwritten line beside the logo in the footer, e.g. "shoot today, prints today".',
              },
            },
            {
              name: 'positioning',
              type: 'textarea',
              admin: {
                description:
                  'The paragraph under the big headline on the home page. Two or three sentences on who you are and what a session includes. Plain text, line breaks are ignored.',
              },
            },
            {
              name: 'eyebrow',
              type: 'text',
              admin: {
                description:
                  'The small line in the top-right corner of the opening photo, e.g. "TAGUM CITY / BOOK ONLINE / WALK-INS WELCOME". Type it in capitals.',
              },
            },
            {
              name: 'marquee',
              type: 'textarea',
              admin: {
                description:
                  'The scrolling strip of announcements under the opening photo. It is printed twice back to back so it loops with no gap, so finish it with a separator and a space and the end will read cleanly where it meets the start.',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'The wordmark shown in the header and the footer. Upload a wide PNG with a transparent background. It is displayed about 54px tall, so give it plenty of resolution.',
              },
            },
            {
              name: 'timezone',
              type: 'text',
              defaultValue: 'Asia/Manila',
              admin: {
                description:
                  'Your time zone, e.g. Asia/Manila. At the moment it is only printed in the small line at the very bottom of the page; once bookings are switched on it is what dates and times will be shown in. Changing it does not change your bookable hours.',
              },
            },
          ],
        },
        {
          label: 'Visit',
          admin: {
            description: 'Where you are, when you are open, and how customers reach you.',
          },
          fields: [
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  name: 'lines',
                  type: 'text',
                  hasMany: true,
                  admin: {
                    description:
                      'The street address, one entry per printed line, e.g. "SMS BLDG, DOOR A20," then "SOBRECAREY ST., TAGUM CITY". Drag to reorder.',
                  },
                },
                {
                  name: 'landmark',
                  type: 'text',
                  admin: {
                    description:
                      'The "you cannot miss it" line printed under the address, e.g. "FRONTING IMELDA / RIZAL ELEMENTARY SCHOOL".',
                  },
                },
                {
                  name: 'locality',
                  type: 'text',
                  admin: {
                    description:
                      'City or town, e.g. Tagum City. Used by search engines and maps, not printed on its own.',
                  },
                },
                {
                  name: 'region',
                  type: 'text',
                  admin: {
                    description: 'Province or region, e.g. Davao del Norte. Used by search engines and maps.',
                  },
                },
                {
                  name: 'country',
                  type: 'text',
                  admin: {
                    description: 'Two-letter country code, e.g. PH. Used by search engines and maps.',
                  },
                },
              ],
            },
            {
              name: 'mapEmbedUrl',
              type: 'text',
              admin: {
                description:
                  'PENDING YOUR APPROVAL, leave this empty for now. Embedding a map loads a third party into your page and shares your visitors with it, so nothing is embedded until you say yes. Left empty, the Visit block shows a tidy placeholder tile instead. When you approve it, paste the "Embed a map" link here.',
              },
            },
            {
              name: 'hours',
              type: 'array',
              labels: { singular: 'Hours row', plural: 'Hours rows' },
              admin: {
                description:
                  'The opening-hours table in the Visit block. One row per line. These are for reading only, the bookable time slots are set in the booking system.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'Left column, e.g. "MON - SUN" or "OPEN DAILY".' },
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: { description: 'Right column, e.g. "9:00 AM - 7:00 PM".' },
                },
              ],
            },
            {
              name: 'contact',
              type: 'group',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  admin: {
                    description: 'The number as customers should read it, e.g. "0917 555 0142".',
                  },
                },
                {
                  name: 'phoneHref',
                  type: 'text',
                  admin: {
                    description:
                      'The same number in dialling form, so tapping it on a phone starts the call: tel: followed by the international number, e.g. "tel:+639175550142".',
                  },
                },
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    description: 'The inbox you actually read. Shown on the site as a clickable email link.',
                  },
                },
              ],
            },
            {
              name: 'socials',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              admin: {
                description: 'The social accounts listed under your contact details. One row per account.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'What the link says, e.g. "INSTAGRAM".' },
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'The full address of the page, starting with https:// . Open your profile and copy the link from the browser address bar.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Payments',
          admin: {
            description:
              'What customers see on the payment step. Amounts are not set here, the downpayment is worked out by the till from the package they picked.',
          },
          fields: [
            {
              name: 'paymentTerms',
              type: 'textarea',
              admin: {
                description:
                  'The small print under the payment instructions: refunds, rescheduling, and the warning never to pay anyone who messages them first. Plain text, no formatting.',
              },
            },
            {
              name: 'paymentChannels',
              type: 'array',
              labels: { singular: 'Payment channel', plural: 'Payment channels' },
              admin: {
                description:
                  'The accounts customers send the downpayment to. Each row becomes one card on the payment step, and removing a row takes it off the site immediately.',
              },
              fields: [
                {
                  name: 'channel',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'GCash', value: 'gcash' },
                    { label: 'Maya', value: 'maya' },
                    { label: 'Bank transfer', value: 'bank' },
                  ],
                  admin: {
                    description:
                      'Which kind of account this is. Pick one per row and do not add the same one twice.',
                  },
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'The heading on the card, e.g. "GCASH". Type it in capitals.' },
                },
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'The mobile number or account number customers send to. Check it character by character, this is where the money goes.',
                  },
                },
                {
                  name: 'accountName',
                  type: 'text',
                  admin: {
                    description:
                      'The account name as it appears in the app once they type the number in, so they can confirm they are paying the right person.',
                  },
                },
                {
                  name: 'qr',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description:
                      'LIVE PAYMENT SURFACE. Do not upload a QR code until the booking system is switched on. The moment a QR is here, anyone on the site can scan it and pay you with nothing recording what they paid for or holding their slot. Until then leave it empty and the site shows the account number with a marked placeholder where the QR will go. When the time comes, upload the square QR exported from your own app and check it scans through to the account above.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
