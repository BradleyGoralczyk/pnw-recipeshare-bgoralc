import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecipeFilters } from "@/components/RecipeFilters";
import { filterRecipes, sortRecipes } from "@/lib/recipe-model";
import { recipeFixtures } from "@/test/fixtures/recipes";

const testRecipes = [
  {
    ...recipeFixtures[0],
    id: "iranian-main",
    title: "Iranian Rice Pilaf",
    cuisine: "Iranian" as const,
    category: "Main Dish" as const,
  },
  {
    ...recipeFixtures[1],
    id: "iranian-snack",
    title: "Herb Bites",
    cuisine: "Iranian" as const,
    category: "Snack" as const,
    ingredients: ["2 cups rice", ...recipeFixtures[1].ingredients],
    ratings: [5],
  },
  {
    ...recipeFixtures[2],
    id: "chinese-main",
    cuisine: "Chinese" as const,
    category: "Main Dish" as const,
    ratings: [4],
  },
];

describe("recipe filters", () => {
  it("combines cuisine and category and returns all recipes when both are cleared", () => {
    expect(filterRecipes(testRecipes, "Iranian", "Main Dish").map((recipe) => recipe.id)).toEqual([
      "iranian-main",
    ]);
    expect(filterRecipes(testRecipes, "", "")).toEqual(testRecipes);
    expect(filterRecipes(testRecipes, "Iranian", "Dessert")).toEqual([]);
  });

  it("searches titles and ingredients and sorts highest rated first stably", () => {
    const riceRecipes = filterRecipes(testRecipes, "", "", "rice");
    expect(riceRecipes.map((recipe) => recipe.id)).toEqual([
      "iranian-main",
      "iranian-snack",
    ]);
    expect(
      filterRecipes(testRecipes, "Iranian", "Main Dish", "rice").map(
        (recipe) => recipe.id,
      ),
    ).toEqual(["iranian-main"]);

    expect(sortRecipes(riceRecipes, "highest-rated").map((recipe) => recipe.id)).toEqual([
      "iranian-snack",
      "iranian-main",
    ]);
    expect(sortRecipes(testRecipes, "newest")).toEqual(testRecipes);
  });

  it("combines multiple dietary tags with cuisine, category, and keyword filters", () => {
    expect(
      filterRecipes(testRecipes, "Iranian", "Main Dish", "rice", [
        "Vegetarian",
        "Gluten-free",
      ]).map((recipe) => recipe.id),
    ).toEqual(["iranian-main"]);
    expect(filterRecipes(testRecipes, "", "", "", ["Vegan"])).toEqual([]);
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
    expect(screen.getByRole("article", { name: "Iranian Rice Pilaf" })).toBeInTheDocument();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search recipes" }), {
      target: { value: "rice" },
    });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("article", { name: "Iranian Rice Pilaf" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters and search" }));
    expect(screen.getAllByRole("article")).toHaveLength(testRecipes.length);
    expect(screen.getByLabelText("Cuisine")).toHaveValue("");
    expect(screen.getByLabelText("Category")).toHaveValue("");
    expect(screen.getByRole("searchbox", { name: "Search recipes" })).toHaveValue("");
    expect(screen.getByRole("checkbox", { name: "Vegetarian" })).not.toBeChecked();

    fireEvent.click(screen.getByRole("checkbox", { name: "Vegetarian" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("article", { name: "Iranian Rice Pilaf" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear filters and search" }));

    fireEvent.change(screen.getByLabelText("Sort by"), {
      target: { value: "highest-rated" },
    });
    expect(screen.getAllByRole("article")[0]).toHaveAttribute("aria-label", "Herb Bites");

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
