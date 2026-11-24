"use server";

import { revalidatePath } from "next/cache";

import { addRating } from "@/lib/ratings";

export type RatingActionState = { error: string | null; success: boolean };

export async function rateRecipe(
  _previousState: RatingActionState,
  formData: FormData,
): Promise<RatingActionState> {
  const recipeId = formData.get("recipeId");
  const rawValue = formData.get("value");
  const value = typeof rawValue === "string" ? Number(rawValue) : NaN;

  if (typeof recipeId !== "string" || !recipeId.trim()) {
    return { error: "Choose a recipe to rate.", success: false };
  }
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return { error: "Choose a rating from 1 to 5 stars.", success: false };
  }

  try {
    await addRating(recipeId, value);
  } catch {
    return { error: "Your rating could not be saved. Please try again.", success: false };
  }

  revalidatePath("/");
  revalidatePath(`/recipes/${recipeId}`);
  return { error: null, success: true };
}
