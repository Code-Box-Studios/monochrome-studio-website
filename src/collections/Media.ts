import type { CollectionConfig } from 'payload'
import { protectMediaInUse } from '@/hooks/protectMediaInUse'
import { revalidateOnChange, revalidateOnDelete } from '@/hooks/revalidateSite'

/**
 * Media — every public image on the site.
 *
 * Hero frame, portfolio samples, package thumbnails and logos all live here.
 * The site reads images out of this collection through `upload` relationships,
 * so anything uploaded here is publicly readable by design.
 *
 * The generated sizes mirror how the page actually uses photography:
 *   thumbnail (400w)  admin list rows and small package thumbnails
 *   card      (800w)  portfolio grid tiles (portrait 4/5 crops)
 *   hero     (1600w)  the full-bleed hero and any wide feature image
 *
 * Only a width is set on each size, so the original aspect ratio is preserved
 * (the site mixes 16/9, 4/5 and 3/4 frames) and `withoutEnlargement` keeps a
 * small original from being upscaled into a blurry "large" file.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'caption', 'updatedAt'],
    group: 'Content',
    description:
      'Photos and logos used across the site. Upload the highest-quality original you have — smaller versions are generated automatically.',
  },
  access: {
    read: () => true,
  },
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        withoutEnlargement: true,
      },
      {
        name: 'card',
        width: 800,
        withoutEnlargement: true,
      },
      {
        name: 'hero',
        width: 1600,
        withoutEnlargement: true,
      },
    ],
  },
  hooks: {
    beforeDelete: [protectMediaInUse],
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe what is in the photo in one short sentence, e.g. "A birthday session with a number balloon". This is what blind visitors hear instead of the image and what shows if the photo fails to load — it is required by accessibility law, not a nice-to-have. Do not write "photo" or "image"; just say what is happening.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'NOT SHOWN ON THE SITE. Your own note about this file, to help you find it again in this list. The caption printed under a photo on the home page is the one on the Recent Work entry, not this.',
      },
    },
  ],
}
