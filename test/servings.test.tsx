import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ServingsScaler } from "@/components/ServingsScaler";
import { scaleIngredient } from "@/lib/servings";

describe("servings scaler", () => {
  it("scales decimal, simple fraction, and mixed fraction quantities", () => {
    expect(scaleIngredient("2 cups rice", 2)).toBe("1 cups rice");
    expect(scaleIngredient("1/2 teaspoon salt", 8)).toBe("1 teaspoon salt");
    expect(scaleIngredient("1 1/2 cups flour", 2)).toBe("0.75 cups flour");
  });

  it("leaves ingredients without a leading quantity unchanged", () => {
    expect(scaleIngredient("Salt to taste", 8)).toBe("Salt to taste");
  });

  it("updates the displayed ingredient quantities when servings change", () => {
    render(<ServingsScaler ingredients={["2 cups rice", "Salt to taste"]} />);

    fireEvent.change(screen.getByLabelText("Servings"), {
      target: { value: "8" },
    });

    expect(screen.getByText("4 cups rice")).toBeInTheDocument();
    expect(screen.getByText("Salt to taste")).toBeInTheDocument();
  });
});
