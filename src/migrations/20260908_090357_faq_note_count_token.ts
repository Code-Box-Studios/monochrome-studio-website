import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_page_blocks_faq" ALTER COLUMN "note" SET DEFAULT 'THE {count} THAT COME UP MOST';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "landing_page_blocks_faq" ALTER COLUMN "note" SET DEFAULT 'THE FIVE THAT COME UP MOST';`)
}
