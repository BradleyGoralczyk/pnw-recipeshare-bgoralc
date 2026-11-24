import { describe, expect, it } from "vitest";

import { sampleRecipes } from "../db/seed.mjs";
import { catalogRecipes } from "../db/recipe-catalog.mjs";
import { CATEGORIES, CUISINES, DIETARY_TAGS } from "@/lib/recipe-model";

describe("community recipe catalog", () => {
  it("covers each cuisine and category exactly once across catalog and samples", () => {
    const recipes = [...sampleRecipes, ...catalogRecipes];
    expect(recipes).toHaveLength(CUISINES.length * CATEGORIES.length);

    for (const cuisine of CUISINES) {
      for (const category of CATEGORIES) {
        expect(recipes.filter((recipe) => recipe.cuisine === cuisine && recipe.category === category))
          .toHaveLength(1);
      }
    }
  });

  it("provides complete recipes with valid tags and public Blob photos", () => {
    expect(new Set(catalogRecipes.map((recipe) => recipe.id)).size).toBe(catalogRecipes.length);

    for (const recipe of catalogRecipes) {
      expect(recipe.title.trim()).not.toBe("");
      expect(recipe.ingredients.length).toBeGreaterThanOrEqual(3);
      expect(recipe.steps.length).toBeGreaterThanOrEqual(3);
      expect(recipe.prepTimeMinutes).toBeGreaterThan(0);
      expect(recipe.dietaryTags.every((tag) => (DIETARY_TAGS as readonly string[]).includes(tag))).toBe(true);
      expect(recipe.ingredients.join(" ")).not.toContain("undefined");
      expect(recipe.imageUrl).toMatch(/^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\/recipe-images\//);
      expect(recipe.imageAlt).toMatch(/^Representative photo/);
    }
  });

  it("assigns a distinct image to every recipe photo available in the source manifest", () => {
    const individuallyPhotographed = catalogRecipes.filter((recipe) =>
      recipe.imageUrl.includes("/recipe-images/catalog/recipes/"),
    );
    expect(individuallyPhotographed.length).toBeGreaterThan(0);
    expect(new Set(individuallyPhotographed.map((recipe) => recipe.imageUrl)).size)
      .toBe(individuallyPhotographed.length);
  });
});
