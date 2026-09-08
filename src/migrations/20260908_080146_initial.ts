import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_portfolio_category" AS ENUM('solo', 'duo', 'collective', 'birthday', 'graduation');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_site_settings_payment_channels_channel" AS ENUM('gcash', 'maya', 'bank');
  CREATE TABLE "services_content_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "services_content_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "services_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" varchar NOT NULL,
  	"title" varchar,
  	"cover_image_id" integer,
  	"description" jsonb,
  	"order" numeric,
  	"featured" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "portfolio" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"category" "enum_portfolio_category" NOT NULL,
  	"order" numeric,
  	"featured" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"attribution" varchar,
  	"quote" varchar NOT NULL,
  	"rating" numeric DEFAULT 5,
  	"avatar_id" integer,
  	"featured" boolean,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_content_id" integer,
  	"portfolio_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_payment_channels" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"channel" "enum_site_settings_payment_channels_channel" NOT NULL,
  	"label" varchar NOT NULL,
  	"number" varchar NOT NULL,
  	"account_name" varchar,
  	"qr_id" integer
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"tagline" varchar,
  	"positioning" varchar,
  	"eyebrow" varchar,
  	"marquee" varchar,
  	"logo_id" integer,
  	"timezone" varchar DEFAULT 'Asia/Manila',
  	"address_landmark" varchar,
  	"address_locality" varchar,
  	"address_region" varchar,
  	"address_country" varchar,
  	"map_embed_url" varchar,
  	"contact_phone" varchar,
  	"contact_phone_href" varchar,
  	"contact_email" varchar,
  	"payment_terms" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "landing_page_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline_line1" varchar DEFAULT '15 MINUTES.' NOT NULL,
  	"headline_accent_word" varchar DEFAULT 'UNLIMITED' NOT NULL,
  	"headline_line2" varchar DEFAULT 'SHOTS.',
  	"sub_paragraph" varchar,
  	"primary_cta_label" varchar DEFAULT 'BOOK A SLOT',
  	"secondary_cta_label" varchar DEFAULT 'SEE PACKAGES ↓',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_packages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'PACKAGES',
  	"note" varchar DEFAULT 'THE STUDIO''S PUBLISHED PRICES — WHAT YOU SEE IS WHAT YOU PAY',
  	"polaroid_caption" varchar DEFAULT 'unlimited shots, keep your favorites',
  	"backdrop_heading" varchar DEFAULT 'BACKDROP COLORS',
  	"backdrop_note" varchar DEFAULT 'ONE FREE WITH EVERY PACKAGE
  EXTRA COLOR +₱100',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_portfolio" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'RECENT WORK',
  	"note" varchar DEFAULT 'REAL SESSIONS, LATEST FIRST',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "landing_page_blocks_how_it_works" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'HOW IT WORKS',
  	"note" varchar,
  	"photo_caption" varchar DEFAULT 'the room, between sessions',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'ASK US ANYTHING',
  	"note" varchar DEFAULT 'THE FIVE THAT COME UP MOST',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_cta_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar DEFAULT 'THE CALENDAR IS HONEST — IF IT SHOWS A SLOT, IT''S YOURS.' NOT NULL,
  	"cta_label" varchar DEFAULT 'BOOK A SLOT',
  	"reassurance" varchar DEFAULT 'HELD {holdMinutes} MIN WHILE YOU PAY · NO ACCOUNT NEEDED',
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page_blocks_visit" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'VISIT',
  	"note" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "landing_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "services_content_inclusions" ADD CONSTRAINT "services_content_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_content_gallery" ADD CONSTRAINT "services_content_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services_content_gallery" ADD CONSTRAINT "services_content_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_content" ADD CONSTRAINT "services_content_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "portfolio" ADD CONSTRAINT "portfolio_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_content_fk" FOREIGN KEY ("services_content_id") REFERENCES "public"."services_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolio"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_hours" ADD CONSTRAINT "site_settings_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_payment_channels" ADD CONSTRAINT "site_settings_payment_channels_qr_id_media_id_fk" FOREIGN KEY ("qr_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_payment_channels" ADD CONSTRAINT "site_settings_payment_channels_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_hero" ADD CONSTRAINT "landing_page_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_packages" ADD CONSTRAINT "landing_page_blocks_packages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_portfolio" ADD CONSTRAINT "landing_page_blocks_portfolio_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_how_it_works_steps" ADD CONSTRAINT "landing_page_blocks_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page_blocks_how_it_works"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_how_it_works" ADD CONSTRAINT "landing_page_blocks_how_it_works_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_testimonials" ADD CONSTRAINT "landing_page_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_faq" ADD CONSTRAINT "landing_page_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_cta_band" ADD CONSTRAINT "landing_page_blocks_cta_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "landing_page_blocks_visit" ADD CONSTRAINT "landing_page_blocks_visit_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_content_inclusions_order_idx" ON "services_content_inclusions" USING btree ("_order");
  CREATE INDEX "services_content_inclusions_parent_id_idx" ON "services_content_inclusions" USING btree ("_parent_id");
  CREATE INDEX "services_content_gallery_order_idx" ON "services_content_gallery" USING btree ("_order");
  CREATE INDEX "services_content_gallery_parent_id_idx" ON "services_content_gallery" USING btree ("_parent_id");
  CREATE INDEX "services_content_gallery_image_idx" ON "services_content_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "services_content_product_id_idx" ON "services_content" USING btree ("product_id");
  CREATE INDEX "services_content_cover_image_idx" ON "services_content" USING btree ("cover_image_id");
  CREATE INDEX "services_content_updated_at_idx" ON "services_content" USING btree ("updated_at");
  CREATE INDEX "services_content_created_at_idx" ON "services_content" USING btree ("created_at");
  CREATE INDEX "portfolio_image_idx" ON "portfolio" USING btree ("image_id");
  CREATE INDEX "portfolio_updated_at_idx" ON "portfolio" USING btree ("updated_at");
  CREATE INDEX "portfolio_created_at_idx" ON "portfolio" USING btree ("created_at");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_services_content_id_idx" ON "payload_locked_documents_rels" USING btree ("services_content_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_id_idx" ON "payload_locked_documents_rels" USING btree ("portfolio_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_hours_order_idx" ON "site_settings_hours" USING btree ("_order");
  CREATE INDEX "site_settings_hours_parent_id_idx" ON "site_settings_hours" USING btree ("_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_payment_channels_order_idx" ON "site_settings_payment_channels" USING btree ("_order");
  CREATE INDEX "site_settings_payment_channels_parent_id_idx" ON "site_settings_payment_channels" USING btree ("_parent_id");
  CREATE INDEX "site_settings_payment_channels_qr_idx" ON "site_settings_payment_channels" USING btree ("qr_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "landing_page_blocks_hero_order_idx" ON "landing_page_blocks_hero" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_hero_parent_id_idx" ON "landing_page_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_hero_path_idx" ON "landing_page_blocks_hero" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_packages_order_idx" ON "landing_page_blocks_packages" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_packages_parent_id_idx" ON "landing_page_blocks_packages" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_packages_path_idx" ON "landing_page_blocks_packages" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_portfolio_order_idx" ON "landing_page_blocks_portfolio" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_portfolio_parent_id_idx" ON "landing_page_blocks_portfolio" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_portfolio_path_idx" ON "landing_page_blocks_portfolio" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_how_it_works_steps_order_idx" ON "landing_page_blocks_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_how_it_works_steps_parent_id_idx" ON "landing_page_blocks_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_how_it_works_order_idx" ON "landing_page_blocks_how_it_works" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_how_it_works_parent_id_idx" ON "landing_page_blocks_how_it_works" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_how_it_works_path_idx" ON "landing_page_blocks_how_it_works" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_testimonials_order_idx" ON "landing_page_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_testimonials_parent_id_idx" ON "landing_page_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_testimonials_path_idx" ON "landing_page_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_faq_order_idx" ON "landing_page_blocks_faq" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_faq_parent_id_idx" ON "landing_page_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_faq_path_idx" ON "landing_page_blocks_faq" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_cta_band_order_idx" ON "landing_page_blocks_cta_band" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_cta_band_parent_id_idx" ON "landing_page_blocks_cta_band" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_cta_band_path_idx" ON "landing_page_blocks_cta_band" USING btree ("_path");
  CREATE INDEX "landing_page_blocks_visit_order_idx" ON "landing_page_blocks_visit" USING btree ("_order");
  CREATE INDEX "landing_page_blocks_visit_parent_id_idx" ON "landing_page_blocks_visit" USING btree ("_parent_id");
  CREATE INDEX "landing_page_blocks_visit_path_idx" ON "landing_page_blocks_visit" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_content_inclusions" CASCADE;
  DROP TABLE "services_content_gallery" CASCADE;
  DROP TABLE "services_content" CASCADE;
  DROP TABLE "portfolio" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_hours" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings_payment_channels" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "landing_page_blocks_hero" CASCADE;
  DROP TABLE "landing_page_blocks_packages" CASCADE;
  DROP TABLE "landing_page_blocks_portfolio" CASCADE;
  DROP TABLE "landing_page_blocks_how_it_works_steps" CASCADE;
  DROP TABLE "landing_page_blocks_how_it_works" CASCADE;
  DROP TABLE "landing_page_blocks_testimonials" CASCADE;
  DROP TABLE "landing_page_blocks_faq" CASCADE;
  DROP TABLE "landing_page_blocks_cta_band" CASCADE;
  DROP TABLE "landing_page_blocks_visit" CASCADE;
  DROP TABLE "landing_page" CASCADE;
  DROP TYPE "public"."enum_portfolio_category";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_site_settings_payment_channels_channel";`)
}
