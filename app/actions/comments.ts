"use server";

import { revalidatePath } from "next/cache";

import { addComment } from "@/lib/comments";

export type CommentFormState = {
  errors: { authorName?: string; body?: string; form?: string };
  values?: { authorName: string; body: string };
  success?: boolean;
};

export async function createComment(
  _previousState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const recipeIdValue = formData.get("recipeId");
  const authorValue = formData.get("authorName");
  const bodyValue = formData.get("body");
  const recipeId = typeof recipeIdValue === "string" ? recipeIdValue.trim() : "";
  const authorName = typeof authorValue === "string" ? authorValue.trim() : "";
  const body = typeof bodyValue === "string" ? bodyValue.trim() : "";
  const errors: CommentFormState["errors"] = {};

  if (!recipeId) errors.form = "Choose a recipe to comment on.";
  if (!authorName || authorName.length > 80) {
    errors.authorName = "Your name must be between 1 and 80 characters.";
  }
  if (!body || body.length > 1000) {
    errors.body = "A comment must be between 1 and 1000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { authorName, body } };
  }

  try {
    await addComment(recipeId, authorName, body);
  } catch {
    return {
      errors: { form: "Your comment could not be saved. Please try again." },
      values: { authorName, body },
    };
  }

  revalidatePath(`/recipes/${recipeId}`);
  return { errors: {}, success: true, values: { authorName, body: "" } };
}
