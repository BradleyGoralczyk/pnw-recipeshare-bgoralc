import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CommentForm } from "@/components/CommentForm";

vi.mock("@/app/actions/comments", () => ({
  createComment: vi.fn(async () => ({ errors: {} })),
}));

describe("comment form", () => {
  it("provides labeled author and comment fields with a submit button", () => {
    render(<CommentForm recipeId="recipe-1" />);

    expect(screen.getByLabelText("Your name")).toBeRequired();
    expect(screen.getByLabelText("Comment")).toBeRequired();
    expect(screen.getByRole("button", { name: "Post comment" })).toBeInTheDocument();
  });
});
