import fs from "node:fs";
import path from "node:path";

import { PHOTOS, type PhotoId } from "./photos";
import { PAYMENT_CHANNELS } from "./studio";

const PHOTO_DIR = path.join(process.cwd(), "public", "photos");
const BRAND_DIR = path.join(process.cwd(), "public", "brand");
const EXTENSIONS = [".avif", ".webp", ".jpg", ".jpeg", ".png"];

/**
 * Maps each declared photo id to a public URL, for the files that actually
 * exist on disk. Resolved on the server at render time so dropping a file into
 * `public/photos/` is the whole install step — no manifest edit, no rebuild of
 * any list. Ids with no file are simply absent and render their placeholder.
 */
export function resolvePhotos(): Partial<Record<PhotoId, string>> {
  let entries: string[];
  try {
    entries = fs.readdirSync(PHOTO_DIR);
  } catch {
    return {};
  }

  const byBase = new Map<string, string>();
  for (const entry of entries) {
    const ext = path.extname(entry).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;
    const base = path.basename(entry, ext);
    // First match by extension preference wins, so an .avif beats a .png.
    const existing = byBase.get(base);
    if (existing && EXTENSIONS.indexOf(path.extname(existing).toLowerCase()) <= EXTENSIONS.indexOf(ext)) {
      continue;
    }
    byBase.set(base, entry);
  }

  const resolved: Partial<Record<PhotoId, string>> = {};
  for (const id of Object.keys(PHOTOS) as PhotoId[]) {
    const file = byBase.get(id);
    if (file) resolved[id] = `/photos/${file}`;
  }
  return resolved;
}

/**
 * Which payment QR images the studio has actually supplied.
 *
 * Same drop-in contract as the photos: the files named by `PAYMENT_CHANNELS[].qr`
 * are not in the repo, because a QR for a live payment account is config, not a
 * design asset. Drop them into `public/brand/` and the payment step starts
 * rendering them — including the full-size view — with no code change.
 */
export function resolvePaymentQrs(): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const channel of PAYMENT_CHANNELS) {
    const file = channel.qr.replace(/^\/brand\//, "");
    try {
      if (fs.statSync(path.join(BRAND_DIR, file)).isFile()) {
        resolved[channel.id] = channel.qr;
      }
    } catch {
      // Not supplied yet — the step renders its placeholder instead.
    }
  }
  return resolved;
}
