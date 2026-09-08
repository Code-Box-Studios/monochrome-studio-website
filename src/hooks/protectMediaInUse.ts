import { APIError, type CollectionBeforeDeleteHook } from "payload";

/**
 * Refuses to delete an image a portfolio entry is still using.
 *
 * A portfolio row's image is required, so its column is NOT NULL — but Payload
 * generates the foreign key as `ON DELETE set null`. Deleting a media document
 * therefore asks Postgres to write NULL into a NOT NULL column, which fails.
 * Without this guard the studio gets a raw constraint error after the file has
 * already been taken off disk: the picture is gone and the row that pointed at
 * it is still there.
 *
 * Stopping first means nothing is destroyed and the message says what to do.
 */
export const protectMediaInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  const { totalDocs } = await req.payload.count({
    collection: "portfolio",
    where: { image: { equals: id } },
    req,
  });

  if (totalDocs > 0) {
    throw new APIError(
      `This photo is still used by ${totalDocs} entry in Recent Work. ` +
        `Remove it from there first, or swap in a different photo, then delete it here.`,
      400,
    );
  }
};
