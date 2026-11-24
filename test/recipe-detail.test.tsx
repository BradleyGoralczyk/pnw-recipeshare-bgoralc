import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import RecipeDetailsPage from "@/app/recipes/[id]/page";
import { getRecipeById, recipes } from "@/lib/recipes";

describe("recipe detail page", () => {
  it("shows all recipe fields and the author for a known recipe", async () => {
    const recipe = recipes[0];
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
    expect(
      screen.getByRole("img", { name: recipe.imageAlt }),
    ).toBeInTheDocument();
    expect(screen.getByText(`${recipe.prepTimeMinutes} minutes`)).toBeInTheDocument();
    expect(screen.getByText("4.7 out of 5")).toBeInTheDocument();

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

  it("returns no recipe for an unknown ID so the route can show not found", () => {
    expect(getRecipeById("not-a-real-recipe")).toBeUndefined();
  });
});
