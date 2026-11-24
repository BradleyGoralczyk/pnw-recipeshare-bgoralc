import { beforeEach, describe, expect, it, vi } from "vitest";

import { rateRecipe } from "@/app/actions/ratings";
import { addRating } from "@/lib/ratings";
import { revalidatePath } from "next/cache";

vi.mock("@/lib/ratings", () => ({ addRating: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function ratingForm(recipeId: string, value: string): FormData {
  const formData = new FormData();
  formData.set("recipeId", recipeId);
  formData.set("value", value);
  return formData;
}

describe("rating action", () => {
  beforeEach(() => {
    vi.mocked(addRating).mockReset();
    vi.mocked(revalidatePath).mockReset();
  });

  it.each(["0", "6", "2.5", "not a number"])(
    "rejects invalid rating %s without saving",
    async (value) => {
      const result = await rateRecipe(
        { error: null, success: false },
        ratingForm("recipe-1", value),
      );

      expect(result.error).toBe("Choose a rating from 1 to 5 stars.");
      expect(addRating).not.toHaveBeenCalled();
    },
  );

  it.each(["1", "5"])("accepts the boundary rating %s", async (value) => {
    const result = await rateRecipe(
      { error: null, success: false },
      ratingForm("recipe-1", value),
    );

    expect(result).toEqual({ error: null, success: true });
    expect(addRating).toHaveBeenCalledWith("recipe-1", Number(value));
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/recipes/recipe-1");
  });
});
