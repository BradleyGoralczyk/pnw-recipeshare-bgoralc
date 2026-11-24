// @vitest-environment node

import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getDb } from "@/lib/db";
import { addRating, getRatingsForRecipe } from "@/lib/ratings";
import { getAverageRating } from "@/lib/recipe-model";
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
      videoUrl: "https://www.youtube.com/watch?v=example",
      dietaryTags: ["Gluten-free", "Dairy-free"] as ("Gluten-free" | "Dairy-free")[],
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

    const firstSavedRating = await addRating(recipeId, 1);
    const lastSavedRating = await addRating(recipeId, 5);
    expect(firstSavedRating).toMatchObject({ recipeId, value: 1 });
    expect(lastSavedRating).toMatchObject({ recipeId, value: 5 });
    const savedRatings = await getRatingsForRecipe(recipeId);
    expect(savedRatings).toEqual([firstSavedRating, lastSavedRating]);
    await expect(getRecipeById(recipeId)).resolves.toMatchObject({
      id: recipeId,
      ratings: [1, 5],
    });
    expect(getAverageRating(savedRatings.map((rating) => rating.value))).toBe(3);
  });

  it("rejects invalid rating values before they reach the database", async () => {
    await expect(addRating(recipeId, 0)).rejects.toThrow(
      "A rating must be a whole number from 1 to 5.",
    );
    await expect(addRating(recipeId, 6)).rejects.toThrow(
      "A rating must be a whole number from 1 to 5.",
    );
  });

  it("seeds the two distinct sample recipes without duplicates on repeat runs", async () => {
    const seedScript = fileURLToPath(new URL("../db/seed.mjs", import.meta.url));
    for (let run = 0; run < 2; run += 1) {
      const result = spawnSync(process.execPath, [seedScript], {
        encoding: "utf8",
        env: process.env,
      });
      expect(result.status).toBe(0);
    }

    const seededRecipes = await getDb()`
      SELECT id, cuisine, category, COUNT(*)::int AS count
      FROM recipes
      WHERE id IN (
        'recipeshare-sample-persian-herb-salad',
        'recipeshare-sample-italian-tiramisu'
      )
      GROUP BY id, cuisine, category
      ORDER BY id
    `;

    expect(seededRecipes).toEqual([
      {
        id: "recipeshare-sample-italian-tiramisu",
        cuisine: "Italian",
        category: "Dessert",
        count: 1,
      },
      {
        id: "recipeshare-sample-persian-herb-salad",
        cuisine: "Iranian",
        category: "Salad",
        count: 1,
      },
    ]);
  });
});
