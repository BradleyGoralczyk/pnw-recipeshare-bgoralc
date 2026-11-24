import { afterEach, describe, expect, it, vi } from "vitest";

const { addCommentMock, revalidatePathMock } = vi.hoisted(() => ({
  addCommentMock: vi.fn(async () => undefined),
  revalidatePathMock: vi.fn(),
}));

vi.mock("@/lib/comments", () => ({ addComment: addCommentMock }));
vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));

import { createComment } from "@/app/actions/comments";

afterEach(() => vi.clearAllMocks());

function commentForm(recipeId: string, authorName: string, body: string): FormData {
  const formData = new FormData();
  formData.set("recipeId", recipeId);
  formData.set("authorName", authorName);
  formData.set("body", body);
  return formData;
}

describe("create comment action", () => {
  it("rejects missing and oversized fields without saving", async () => {
    const state = await createComment(
      { errors: {} },
      commentForm("", " ", "x".repeat(1001)),
    );

    expect(state.errors).toMatchObject({
      form: "Choose a recipe to comment on.",
      authorName: "Your name must be between 1 and 80 characters.",
      body: "A comment must be between 1 and 1000 characters.",
    });
    expect(addCommentMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("saves a valid comment and revalidates its recipe detail page", async () => {
    const state = await createComment(
      { errors: {} },
      commentForm("recipe-1", "Mina", "Very tasty!"),
    );

    expect(addCommentMock).toHaveBeenCalledWith("recipe-1", "Mina", "Very tasty!");
    expect(revalidatePathMock).toHaveBeenCalledWith("/recipes/recipe-1");
    expect(state).toMatchObject({ success: true, errors: {} });
  });
});
