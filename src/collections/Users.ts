import type { CollectionConfig } from 'payload'

/**
 * Users — the people who can sign in to the Payload admin: the studio owner
 * plus anyone trusted to edit the site's content.
 *
 * Access is intentionally left at Payload's defaults (authenticated only).
 * This is the one collection that must NOT be publicly readable.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Full name',
      admin: {
        description:
          'The name shown around the admin instead of a bare email address, e.g. "Jess Baguio".',
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        position: 'sidebar',
        description:
          'Admins can manage other people who sign in; editors can change the site content but not the team.',
      },
    },
  ],
}
