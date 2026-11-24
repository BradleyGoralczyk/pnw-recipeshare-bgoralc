import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "../app/page";
import { getAverageRating, recipes } from "@/lib/recipes";

describe("home page recipe browsing", () => {
  it("shows recipe cards with a photo, title, cuisine, category, and average rating", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Good food brings us together." }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(recipes.length);

    for (const recipe of recipes) {
      const card = screen.getByRole("article", { name: recipe.title });
      const averageRating = getAverageRating(recipe.ratings);

      expect(
        within(card).getByRole("link", {
          name: `Open ${recipe.title} recipe`,
        }),
      ).toHaveAttribute("href", `/recipes/${recipe.id}`);

      if (averageRating === null) {
        throw new Error(`${recipe.title} should have sample ratings`);
      }

      expect(
        within(card).getByRole("img", { name: recipe.imageAlt }),
      ).toBeInTheDocument();
      expect(within(card).getByText(recipe.cuisine)).toBeInTheDocument();
      expect(within(card).getByText(recipe.category)).toBeInTheDocument();
      expect(
        within(card).getByText(averageRating.toFixed(1)),
      ).toBeInTheDocument();
      expect(
        within(card).getByText(`${recipe.ratings.length} ratings`),
      ).toBeInTheDocument();
    }
  });
});
