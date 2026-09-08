import type { CollectionConfig } from 'payload'

/**
 * Users — the people who can sign in to the Payload admin: the studio owner
 * plus anyone trusted to edit the site's content.
 *
 * This is the one collection that must never be publicly readable, and the only
 * one where the `role` field is load-bearing rather than descriptive. The rules
 * below are what make the role mean anything:
 *
 *   - only an admin may add, remove, or change the role of a person,
 *   - anyone signed in may edit their own account (their name, their password),
 *   - nobody may promote themselves, which is why `role` carries its own
 *     field-level update rule on top of the collection's.
 *
 * Without these, Payload's default is "any authenticated user may do anything to
 * any user" — an editor could have deleted the owner's account.
 */

/** True for a signed-in admin. */
const isAdmin = ({ req }: { req: { user?: { role?: string | null } | null } }): boolean =>
  req.user?.role === 'admin'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  access: {
    // Signed in to see the team; never public.
    read: ({ req }) => Boolean(req.user),
    create: isAdmin,
    delete: isAdmin,
    // An admin edits anyone; everyone else is scoped to their own record by the
    // returned query, so this cannot be widened by crafting a request.
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'admin') return true
      return { id: { equals: req.user.id } }
    },
  },
  hooks: {
    beforeChange: [
      /**
       * The first account created is the studio owner, so it is an admin —
       * otherwise the rules above would lock everyone out of user management on
       * a fresh install, since the field defaults to editor.
       */
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        return totalDocs === 0 ? { ...data, role: 'admin' } : data
      },
    ],
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
      // Only an admin may set this, so an editor editing their own account
      // cannot make themselves an admin.
      access: {
        update: isAdmin,
      },
      admin: {
        position: 'sidebar',
        description:
          'Admins can add and remove the people who sign in. Editors can change everything about the site — words, photos, packages — but cannot touch the team. Only an admin can change this setting, and the very first account created is always an admin.',
      },
    },
  ],
}
