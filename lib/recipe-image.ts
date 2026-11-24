export const RECIPE_IMAGE_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_RECIPE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export function isAllowedRecipeImage(file: Pick<File, "type" | "size">): boolean {
  return (
    (RECIPE_IMAGE_CONTENT_TYPES as readonly string[]).includes(file.type) &&
    file.size > 0 &&
    file.size <= MAX_RECIPE_IMAGE_SIZE_BYTES
  );
}
