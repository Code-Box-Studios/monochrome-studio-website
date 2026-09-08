import type { CollectionConfig } from 'payload'
import { revalidateOnChange, revalidateOnDelete } from '@/hooks/revalidateSite'

/**
 * RECENT WORK — the scattered print grid on the home page.
 *
 * Mirrors the `WORK` items in `src/lib/photos.ts`: one entry per print, with
 * the handwritten caption under it and the category its filter chip belongs to.
 * The scatter (tilt / stagger / reveal delay) stays in the component — it is
 * layout, not content, so the studio never has to think about it.
 */
export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'category', 'featured', 'order', 'updatedAt'],
    group: 'Content',
    description:
      'The photos in the RECENT WORK grid on the home page. Newest sessions first — visitors filter them by session type.',
  },
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'The session photo. Shot upright (portrait) works best — the grid crops everything to a 4:5 print.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'The handwritten line under the print, lowercase and casual. For example: "the red set — solo era" or "18th, with the spotlight". Leave blank to show the print with no caption.',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Solo', value: 'solo' },
        { label: 'Duo', value: 'duo' },
        { label: 'Collective', value: 'collective' },
        { label: 'Birthday', value: 'birthday' },
        { label: 'Graduation', value: 'graduation' },
      ],
      admin: {
        description:
          'Which filter chip this photo shows under. It is also printed in small caps beside the caption. (There is an ALL chip on the site, but it is not a choice here — it always shows everything.)',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first in the grid. Leave blank and the newest photos lead.',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Pin this session to the front of the grid — use it for the work you most want people to see.',
      },
    },
  ],
}
