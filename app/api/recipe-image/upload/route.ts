import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import {
  MAX_RECIPE_IMAGE_SIZE_BYTES,
  RECIPE_IMAGE_CONTENT_TYPES,
} from "@/lib/recipe-image";

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("recipe-images/")) {
          throw new Error("Uploads must use the recipe-images path.");
        }

        return {
          allowedContentTypes: [...RECIPE_IMAGE_CONTENT_TYPES],
          maximumSizeInBytes: MAX_RECIPE_IMAGE_SIZE_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 5 * 60 * 1000,
        };
      },
    });

    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Image upload could not be authorized." },
      { status: 400 },
    );
  }
}
