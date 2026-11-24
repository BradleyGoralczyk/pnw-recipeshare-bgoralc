import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RecipeDetailsPage from "@/app/recipes/[id]/page";
import { getRecipeById } from "@/lib/recipes";
import { recipeFixtures } from "@/test/fixtures/recipes";

vi.mock("@/lib/recipes", () => ({ getRecipeById: vi.fn() }));
vi.mock("@/app/actions/ratings", () => ({ rateRecipe: vi.fn() }));

beforeEach(() => {
  vi.mocked(getRecipeById).mockReset();
});

describe("recipe detail page", () => {
  it("shows all recipe fields and the author for a known recipe", async () => {
    const recipe = recipeFixtures[0];
    vi.mocked(getRecipeById).mockResolvedValue(recipe);
    const page = await RecipeDetailsPage({
      params: Promise.resolve({ id: recipe.id }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: recipe.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(recipe.authorName)).toBeInTheDocument();
    expect(screen.getByText(recipe.cuisine)).toBeInTheDocument();
    expect(screen.getByText(recipe.category)).toBeInTheDocument();
    expect(screen.getByText("Vegetarian")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Watch recipe video" })).toHaveAttribute(
      "href",
      recipe.videoUrl,
    );
    expect(
      screen.getByRole("img", { name: recipe.imageAlt }),
    ).toBeInTheDocument();
    expect(screen.getByText(`${recipe.prepTimeMinutes} minutes`)).toBeInTheDocument();
    expect(screen.getByText("4.7 out of 5")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Rate this recipe" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "1 star" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "5 stars" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit rating" })).toBeInTheDocument();

    const ingredientsSection = screen.getByRole("region", {
      name: "Ingredients",
    });
    const ingredients = within(ingredientsSection).getByRole("list");
    for (const ingredient of recipe.ingredients) {
      expect(within(ingredients).getByText(ingredient)).toBeInTheDocument();
    }

    const stepsSection = screen.getByRole("region", { name: "How to make it" });
    const steps = within(stepsSection).getByRole("list");
    for (const step of recipe.steps) {
      expect(within(steps).getByText(step)).toBeInTheDocument();
    }
  });

  it("returns no recipe for an unknown ID so the route can show not found", async () => {
    vi.mocked(getRecipeById).mockResolvedValue(undefined);
    await expect(getRecipeById("not-a-real-recipe")).resolves.toBeUndefined();
  });
});
