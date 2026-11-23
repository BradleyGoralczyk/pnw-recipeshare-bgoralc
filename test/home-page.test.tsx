import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "../app/page";

describe("home page", () => {
  it("renders the RecipeShare welcome page", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Welcome to RecipeShare" }),
    ).toBeInTheDocument();
  });
});
