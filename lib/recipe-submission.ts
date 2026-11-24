import { randomUUID } from "node:crypto";

import { addRecipe } from "@/lib/recipes";
import type { Recipe } from "@/lib/recipe-model";
import { validateRecipeForm, type RecipeFormErrors } from "@/lib/recipe-form";

export type RecipeSubmissionResult = {
  recipe: Recipe | null;
  errors: RecipeFormErrors;
};

export async function submitRecipeForm(
  formData: FormData,
): Promise<RecipeSubmissionResult> {
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

  await addRecipe(recipe);

  return { recipe, errors: {} };
}
