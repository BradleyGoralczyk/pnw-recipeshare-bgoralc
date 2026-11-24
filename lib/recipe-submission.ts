import { randomUUID } from "node:crypto";

import { addRecipe, type Recipe } from "@/lib/recipes";
import { validateRecipeForm, type RecipeFormErrors } from "@/lib/recipe-form";

export type RecipeSubmissionResult = {
  recipe: Recipe | null;
  errors: RecipeFormErrors;
};

export function submitRecipeForm(formData: FormData): RecipeSubmissionResult {
  const validation = validateRecipeForm(formData);

  if (!validation.data) {
    return { recipe: null, errors: validation.errors };
  }

  const recipe: Recipe = {
    ...validation.data,
    id: randomUUID(),
    imageAlt: `Photo of ${validation.data.title}`,
    ratings: [],
  };

  addRecipe(recipe);

  return { recipe, errors: {} };
}
