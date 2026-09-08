import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Push CMS edits to the live page.
 *
 * The landing page is statically rendered (`export const revalidate = false`),
 * so without this an edit would sit invisible until the next deploy. These
 * hooks drop the cached render the moment content changes, which is the whole
 * point of the CMS from the studio owner's side.
 *
 * `revalidatePath` is a no-op outside a Next request context — the seed script
 * and the Payload CLI both run there — so these are safe to attach everywhere.
 */
function revalidateHome(context: { req?: { payload?: { logger?: { info: (m: string) => void } } } }) {
  try {
    revalidatePath("/");
  } catch (error) {
    // Never let a cache miss fail the write the studio just made.
    context.req?.payload?.logger?.info(
      `[revalidate] skipped: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export const revalidateOnChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidateHome({ req });
  return doc;
};

export const revalidateOnDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidateHome({ req });
  return doc;
};

export const revalidateGlobalOnChange: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidateHome({ req });
  return doc;
};
