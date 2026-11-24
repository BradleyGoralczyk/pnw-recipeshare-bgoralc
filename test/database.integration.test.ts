// @vitest-environment node

import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getDb } from "@/lib/db";
import { addRating, getRatingsForRecipe } from "@/lib/ratings";
import { addRecipe, getRecipeById, getRecipes } from "@/lib/recipes";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
const recipeId = randomUUID();

describe.skipIf(!hasDatabaseUrl)("Neon persistence integration", () => {
  afterAll(async () => {
    await getDb()`DELETE FROM recipes WHERE id = ${recipeId}`;
  });

  it("creates and reads recipes and ratings from the configured database", async () => {
    const recipe = {
      id: recipeId,
      authorName: "Database Test",
      title: "Neon Persistence Check",
      cuisine: "Iranian" as const,
      category: "Main Dish" as const,
      ingredients: ["1 cup rice", "1 tablespoon oil"],
      steps: ["Rinse the rice.", "Cook until tender."],
      prepTimeMinutes: 20,
      imageUrl: "https://example.com/neon-persistence.jpg",
      imageAlt: "A bowl of rice",
      ratings: [],
    };

    await addRecipe(recipe);
    const savedRecipe = await getRecipeById(recipeId);

    expect(savedRecipe).toMatchObject({
      ...recipe,
      ratings: [],
    });
    await expect(getRecipes()).resolves.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: recipeId, title: recipe.title })]),
    );

    const savedRating = await addRating(recipeId, 4);
    expect(savedRating).toMatchObject({ recipeId, value: 4 });
    await expect(getRatingsForRecipe(recipeId)).resolves.toEqual([savedRating]);
    await expect(getRecipeById(recipeId)).resolves.toMatchObject({
      id: recipeId,
      ratings: [4],
    });
  });

  it("rejects invalid rating values before they reach the database", async () => {
    await expect(addRating(recipeId, 0)).rejects.toThrow(
      "A rating must be a whole number from 1 to 5.",
    );
    await expect(addRating(recipeId, 6)).rejects.toThrow(
      "A rating must be a whole number from 1 to 5.",
    );
  });
});
