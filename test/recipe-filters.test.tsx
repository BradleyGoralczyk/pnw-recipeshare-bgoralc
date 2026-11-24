import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecipeFilters } from "@/components/RecipeFilters";
import { filterRecipes } from "@/lib/recipe-model";
import { recipeFixtures } from "@/test/fixtures/recipes";

const testRecipes = [
  { ...recipeFixtures[0], id: "iranian-main", cuisine: "Iranian" as const, category: "Main Dish" as const },
  { ...recipeFixtures[1], id: "iranian-snack", cuisine: "Iranian" as const, category: "Snack" as const },
  { ...recipeFixtures[2], id: "chinese-main", cuisine: "Chinese" as const, category: "Main Dish" as const },
];

describe("recipe filters", () => {
  it("combines cuisine and category and returns all recipes when both are cleared", () => {
    expect(filterRecipes(testRecipes, "Iranian", "Main Dish").map((recipe) => recipe.id)).toEqual([
      "iranian-main",
    ]);
    expect(filterRecipes(testRecipes, "", "")).toEqual(testRecipes);
    expect(filterRecipes(testRecipes, "Iranian", "Dessert")).toEqual([]);
  });

  it("lets visitors combine, clear, and apply filters with a no-match message", () => {
    render(<RecipeFilters recipes={testRecipes} />);

    fireEvent.change(screen.getByLabelText("Cuisine"), {
      target: { value: "Iranian" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Main Dish" },
    });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("article", { name: "Golden Chickpea Curry" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getAllByRole("article")).toHaveLength(testRecipes.length);
    expect(screen.getByLabelText("Cuisine")).toHaveValue("");
    expect(screen.getByLabelText("Category")).toHaveValue("");

    fireEvent.change(screen.getByLabelText("Cuisine"), {
      target: { value: "Iranian" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Dessert" },
    });
    expect(screen.getByRole("status")).toHaveTextContent("No recipes found");
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
