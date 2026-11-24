import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RecipeForm } from "@/components/RecipeForm";
import HomePage from "@/app/page";
import { addRecipe, getRecipes } from "@/lib/recipes";
import { CATEGORIES, CUISINES } from "@/lib/recipe-model";
import { submitRecipeForm } from "@/lib/recipe-submission";
import { createRecipe } from "@/app/actions/recipes";
import { recipeFixtures } from "@/test/fixtures/recipes";

vi.mock("@/app/actions/recipes", () => ({
  createRecipe: vi.fn(async () => ({ errors: {} })),
}));
vi.mock("@/lib/recipes", () => ({
  addRecipe: vi.fn(async () => undefined),
  getRecipes: vi.fn(async () => recipeFixtures),
}));

afterEach(() => {
  cleanup();
  vi.mocked(addRecipe).mockReset();
  vi.mocked(addRecipe).mockResolvedValue(undefined);
  vi.mocked(getRecipes).mockReset();
  vi.mocked(getRecipes).mockResolvedValue(recipeFixtures);
});

function makeValidRecipeForm(): FormData {
  const formData = new FormData();
  formData.set("authorName", "Alex Rivera");
  formData.set("title", "Lemon Herb Rice");
  formData.set("cuisine", "American");
  formData.set("category", "Main Dish");
  formData.set("ingredients", "2 cups rice\n1 lemon\nFresh parsley");
  formData.set("steps", "Rinse the rice.\nCook until tender.\nAdd lemon and herbs.");
  formData.set("prepTimeMinutes", "25");
  formData.set("imageUrl", "https://example.com/lemon-rice.jpg");
  formData.set("videoUrl", "https://www.youtube.com/watch?v=example");
  formData.append("dietaryTags", "Vegetarian");
  return formData;
}

describe("add recipe form", () => {
  it("uses the fixed cuisine and category choices and includes every required field", () => {
    render(<RecipeForm />);

    expect(screen.getByLabelText("Author name")).toBeRequired();
    expect(screen.getByLabelText("Recipe title")).toBeRequired();
    expect(screen.getByLabelText("Ingredients")).toBeRequired();
    expect(screen.getByLabelText("Preparation steps")).toBeRequired();
    expect(screen.getByLabelText("Prep time in minutes")).toBeRequired();
    expect(screen.getByLabelText("Image URL")).toBeRequired();
    expect(screen.getByLabelText("Video URL (optional)")).not.toBeRequired();
    expect(screen.getByRole("checkbox", { name: "Vegetarian" })).not.toBeRequired();

    const cuisineOptions = within(
      screen.getByRole("combobox", { name: "Cuisine" }),
    ).getAllByRole("option");
    const categoryOptions = within(
      screen.getByRole("combobox", { name: "Category" }),
    ).getAllByRole("option");

    expect(cuisineOptions.slice(1).map((option) => option.textContent)).toEqual(
      [...CUISINES],
    );
    expect(
      categoryOptions.slice(1).map((option) => option.textContent),
    ).toEqual([...CATEGORIES]);
  });

  it("reports every missing field and does not save an incomplete recipe", async () => {
    const result = await submitRecipeForm(new FormData());

    expect(result.recipe).toBeNull();
    expect(result.errors).toMatchObject({
      authorName: expect.any(String),
      title: expect.any(String),
      cuisine: expect.any(String),
      category: expect.any(String),
      ingredients: expect.any(String),
      steps: expect.any(String),
      prepTimeMinutes: expect.any(String),
      imageUrl: expect.any(String),
    });
    expect(addRecipe).not.toHaveBeenCalled();
  });

  it("rejects unsafe video links and unknown dietary tags on the server", async () => {
    const formData = makeValidRecipeForm();
    formData.set("videoUrl", "javascript:alert(1)");
    formData.append("dietaryTags", "Made-up tag");

    const result = await submitRecipeForm(formData);

    expect(result.recipe).toBeNull();
    expect(result.errors.videoUrl).toBe("Video URL must start with http:// or https://.");
    expect(result.errors.dietaryTags).toBe("Choose dietary tags from the available options.");
    expect(addRecipe).not.toHaveBeenCalled();
  });

  it("shows field-specific validation errors after a form submission", async () => {
    vi.mocked(createRecipe).mockResolvedValueOnce({
      errors: {
        authorName: "Author name is required.",
        title: "Recipe title is required.",
        cuisine: "Choose a cuisine.",
        category: "Choose a category.",
        ingredients: "Add at least one ingredient.",
        steps: "Add at least one preparation step.",
        prepTimeMinutes: "Enter a whole number of minutes greater than zero.",
        imageUrl: "Enter a valid image URL.",
      },
      values: {
        authorName: "Alex Rivera",
        title: "Lemon Herb Rice",
        cuisine: "American",
        category: "Main Dish",
        ingredients: "2 cups rice\n1 lemon",
        steps: "Rinse the rice.",
        prepTimeMinutes: "25",
        imageUrl: "not a valid URL",
      },
    });

    render(<RecipeForm />);
    fireEvent.change(screen.getByLabelText("Author name"), {
      target: { value: "Alex Rivera" },
    });
    fireEvent.change(screen.getByLabelText("Recipe title"), {
      target: { value: "Lemon Herb Rice" },
    });
    fireEvent.change(screen.getByLabelText("Cuisine"), {
      target: { value: "American" },
    });
    fireEvent.change(screen.getByLabelText("Category"), {
      target: { value: "Main Dish" },
    });
    fireEvent.change(screen.getByLabelText("Ingredients"), {
      target: { value: "2 cups rice\n1 lemon" },
    });
    fireEvent.change(screen.getByLabelText("Preparation steps"), {
      target: { value: "Rinse the rice." },
    });
    fireEvent.change(screen.getByLabelText("Prep time in minutes"), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByLabelText("Image URL"), {
      target: { value: "not a valid URL" },
    });
    const form = screen
      .getByRole("button", { name: "Share recipe" })
      .closest("form");
    if (!form) throw new Error("The recipe form should be present");
    fireEvent.submit(form);

    expect(await screen.findByText("Author name is required.")).toBeInTheDocument();
    expect(screen.getByText("Recipe title is required.")).toBeInTheDocument();
    expect(screen.getByText("Choose a cuisine.")).toBeInTheDocument();
    expect(screen.getByText("Choose a category.")).toBeInTheDocument();
    expect(screen.getByText("Add at least one ingredient.")).toBeInTheDocument();
    expect(screen.getByText("Add at least one preparation step.")).toBeInTheDocument();
    expect(screen.getByText("Enter a valid image URL.")).toBeInTheDocument();
    expect(screen.getByLabelText("Recipe title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Author name")).toHaveValue("Alex Rivera");
    expect(screen.getByLabelText("Recipe title")).toHaveValue("Lemon Herb Rice");
    expect(screen.getByLabelText("Cuisine")).toHaveValue("American");
    expect(screen.getByLabelText("Category")).toHaveValue("Main Dish");
    expect(screen.getByLabelText("Ingredients")).toHaveValue(
      "2 cups rice\n1 lemon",
    );
    expect(screen.getByLabelText("Preparation steps")).toHaveValue(
      "Rinse the rice.",
    );
    expect(screen.getByLabelText("Prep time in minutes")).toHaveValue(25);
    expect(screen.getByLabelText("Image URL")).toHaveValue("not a valid URL");
  });

  it("saves a complete recipe and shows its card on the home page", async () => {
    const result = await submitRecipeForm(makeValidRecipeForm());

    expect(result.errors).toEqual({});
    expect(result.recipe).not.toBeNull();
    if (!result.recipe) throw new Error("Expected the valid recipe to be saved");

    expect(addRecipe).toHaveBeenCalledWith(result.recipe);
    expect(result.recipe).toMatchObject({
      videoUrl: "https://www.youtube.com/watch?v=example",
      dietaryTags: ["Vegetarian"],
    });
    vi.mocked(getRecipes).mockResolvedValue([result.recipe, ...recipeFixtures]);
    render(await HomePage());

    const recipeCard = screen.getByRole("article", {
      name: "Lemon Herb Rice",
    });
    expect(within(recipeCard).getByText("American")).toBeInTheDocument();
    expect(within(recipeCard).getByText("Main Dish")).toBeInTheDocument();
    const recipePhoto = within(recipeCard).getByRole("img", {
      name: "Photo of Lemon Herb Rice",
    });
    expect(recipePhoto).toHaveAttribute(
      "src",
      "https://example.com/lemon-rice.jpg",
    );
    expect(within(recipeCard).getByText("Not rated yet")).toBeInTheDocument();
  });
});
