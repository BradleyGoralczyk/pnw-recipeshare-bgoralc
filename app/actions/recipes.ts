"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { submitRecipeForm } from "@/lib/recipe-submission";
import type { RecipeFormErrors } from "@/lib/recipe-form";

export type RecipeFormState = {
  errors: RecipeFormErrors;
  values?: Record<string, string>;
};

const formFields = [
  "authorName",
  "title",
  "cuisine",
  "category",
  "ingredients",
  "steps",
  "prepTimeMinutes",
  "imageUrl",
  "videoUrl",
] as const;

function readFormValues(formData: FormData): Record<string, string> {
  return {
    ...Object.fromEntries(
    formFields.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
    ),
    dietaryTags: formData
      .getAll("dietaryTags")
      .filter((value): value is string => typeof value === "string")
      .join(", "),
  };
}

export async function createRecipe(
  _previousState: RecipeFormState,
  formData: FormData,
): Promise<RecipeFormState> {
  const result = await submitRecipeForm(formData);

  if (!result.recipe) {
    return { errors: result.errors, values: readFormValues(formData) };
  }

  revalidatePath("/");
  redirect("/");
}
