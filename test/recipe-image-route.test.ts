import { afterEach, describe, expect, it, vi } from "vitest";

const { handleUploadMock } = vi.hoisted(() => ({ handleUploadMock: vi.fn() }));
vi.mock("@vercel/blob/client", () => ({ handleUpload: handleUploadMock }));

import { POST } from "@/app/api/recipe-image/upload/route";
import { MAX_RECIPE_IMAGE_SIZE_BYTES, RECIPE_IMAGE_CONTENT_TYPES } from "@/lib/recipe-image";

afterEach(() => vi.clearAllMocks());

describe("public recipe image upload route", () => {
  it("only issues short-lived tokens for bounded recipe image uploads", async () => {
    handleUploadMock.mockResolvedValue({ type: "blob.generate-client-token" });
    const response = await POST(
      new Request("https://recipeshare.test/api/recipe-image/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "blob.generate-client-token" }),
      }),
    );

    expect(response.status).toBe(200);
    const options = handleUploadMock.mock.calls[0]?.[0];
    const tokenOptions = await options.onBeforeGenerateToken("recipe-images/photo", null, false);
    expect(tokenOptions.allowedContentTypes).toEqual([...RECIPE_IMAGE_CONTENT_TYPES]);
    expect(tokenOptions.maximumSizeInBytes).toBe(MAX_RECIPE_IMAGE_SIZE_BYTES);
    expect(tokenOptions.addRandomSuffix).toBe(true);
    expect(tokenOptions.validUntil).toBeGreaterThan(Date.now());
  });

  it("rejects paths outside the recipe image namespace", async () => {
    handleUploadMock.mockResolvedValue({ type: "blob.generate-client-token" });
    await POST(
      new Request("https://recipeshare.test/api/recipe-image/upload", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "blob.generate-client-token" }),
      }),
    );

    const options = handleUploadMock.mock.calls[0]?.[0];
    await expect(options.onBeforeGenerateToken("other/photo", null, false)).rejects.toThrow(
      "Uploads must use the recipe-images path.",
    );
  });
});
