import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateOnChange, revalidateOnDelete } from '@/hooks/revalidateSite'
import type { CollectionConfig } from 'payload'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order', 'updatedAt'],
    group: 'Content',
    description:
      'The questions in the "Ask us anything" section. These are also what Google reads to build the drop-down answers under the studio\'s search result, so write them the way you would answer at the counter.',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description:
          'Ask it the way a customer would — "Is the downpayment refundable?" reads better than "Downpayment policy".',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      editor: lexicalEditor({}),
      required: true,
      admin: {
        description:
          'Answer in one short paragraph. Search engines strip the formatting and quote the plain words, so keep the full answer in the sentences themselves — do not rely on bold, bullets or links to carry the meaning.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description:
          'Lowest number shows first. Put the questions people actually ask most at the top.',
      },
    },
  ],
}
