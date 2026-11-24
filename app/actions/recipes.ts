"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { submitRecipeForm } from "@/lib/recipe-submission";
import type { RecipeFormErrors } from "@/lib/recipe-form";

export type RecipeFormState = {
  errors: RecipeFormErrors;
};

export async function createRecipe(
  _previousState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const result = submitRecipeForm(formData);

  if (!result.recipe) {
    return { errors: result.errors };
  }

  revalidatePath("/");
  redirect("/");
}
