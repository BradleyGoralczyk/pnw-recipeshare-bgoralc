import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "../app/page";

describe("home page recipe browsing", () => {
  it("shows recipe cards with a photo, title, cuisine, category, and average rating", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "Good food brings us together." }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(4);

    const curryCard = screen.getByRole("article", {
      name: "Golden Chickpea Curry",
    });

    expect(
      within(curryCard).getByRole("img", {
        name: "A colorful bowl of curry with fresh greens",
      }),
    ).toBeInTheDocument();
    expect(within(curryCard).getByText("Indian")).toBeInTheDocument();
    expect(within(curryCard).getByText("Main Dish")).toBeInTheDocument();
    expect(within(curryCard).getByText("4.7")).toBeInTheDocument();
    expect(within(curryCard).getByText("6 ratings")).toBeInTheDocument();
  });
});
