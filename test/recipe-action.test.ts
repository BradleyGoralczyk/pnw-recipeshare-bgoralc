import { afterEach, describe, expect, it, vi } from "vitest";

const { revalidatePathMock, redirectMock, addRecipeMock } = vi.hoisted(() => ({
  revalidatePathMock: vi.fn(),
  redirectMock: vi.fn((path: string) => {
    throw new Error(`NEXT_REDIRECT:${path}`);
  }),
  addRecipeMock: vi.fn(async () => undefined),
}));

vi.mock("next/cache", () => ({ revalidatePath: revalidatePathMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("@/lib/recipes", () => ({ addRecipe: addRecipeMock }));

import { createRecipe } from "@/app/actions/recipes";

afterEach(() => {
  vi.clearAllMocks();
});

function makeValidRecipeForm(): FormData {
  const formData = new FormData();
  formData.set("authorName", "Sam Patel");
  formData.set("title", "Cardamom Oat Porridge");
  formData.set("cuisine", "Indian");
  formData.set("category", "Breakfast");
  formData.set("ingredients", "1 cup oats\n2 cups milk\n1/4 teaspoon cardamom");
  formData.set("steps", "Bring milk to a simmer.\nStir in oats and cardamom.");
  formData.set("prepTimeMinutes", "15");
  formData.set("imageUrl", "https://example.com/cardamom-oats.jpg");
  return formData;
}

describe("create recipe server action", () => {
  it("returns field errors without saving or revalidating when required values are missing", async () => {
    const state = await createRecipe({ errors: {} }, new FormData());

    expect(state.errors.authorName).toBe("Author name is required.");
    expect(state.errors.title).toBe("Recipe title is required.");
    expect(state.errors.cuisine).toBe("Choose a cuisine.");
    expect(state.errors.category).toBe("Choose a category.");
    expect(state.errors.ingredients).toBe("Add at least one ingredient.");
    expect(state.errors.steps).toBe("Add at least one preparation step.");
    expect(state.errors.prepTimeMinutes).toBe(
      "Enter a whole number of minutes greater than zero.",
    );
    expect(state.errors.imageUrl).toBe("Enter a valid image URL.");
    expect(addRecipeMock).not.toHaveBeenCalled();
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  it("returns the submitted values so the form can preserve a draft after validation fails", async () => {
    const formData = makeValidRecipeForm();
    formData.set("title", "  My unfinished recipe  ");
    formData.set("imageUrl", "not a URL yet");

    const state = await createRecipe({ errors: {} }, formData);

    expect(state.errors.imageUrl).toBe("Enter a valid image URL.");
    expect(state.values).toEqual({
      authorName: "Sam Patel",
      title: "  My unfinished recipe  ",
      cuisine: "Indian",
      category: "Breakfast",
      ingredients: "1 cup oats\n2 cups milk\n1/4 teaspoon cardamom",
      steps: "Bring milk to a simmer.\nStir in oats and cardamom.",
      prepTimeMinutes: "15",
      imageUrl: "not a URL yet",
    });
  });

  it("saves a valid recipe, refreshes the home page, and redirects there", async () => {
    const submission = createRecipe({ errors: {} }, makeValidRecipeForm());

    await expect(submission).rejects.toThrow("NEXT_REDIRECT:/");

    expect(revalidatePathMock).toHaveBeenCalledWith("/");
    expect(redirectMock).toHaveBeenCalledWith("/");
    expect(addRecipeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Cardamom Oat Porridge",
        authorName: "Sam Patel",
        ingredients: expect.arrayContaining(["1 cup oats"]),
      }),
    );
  });
});
