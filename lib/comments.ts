import "server-only";

import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";

export type RecipeComment = {
  id: string;
  recipeId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type CommentRow = Record<string, unknown>;

function toComment(row: CommentRow): RecipeComment {
  const { id, recipeId, authorName, body, createdAt } = row;
  if (
    typeof id !== "string" ||
    typeof recipeId !== "string" ||
    typeof authorName !== "string" ||
    typeof body !== "string" ||
    !(typeof createdAt === "string" || createdAt instanceof Date)
  ) {
    throw new Error("Database returned an invalid recipe comment.");
  }

  return {
    id,
    recipeId,
    authorName,
    body,
    createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
  };
}

export async function addComment(
  recipeId: string,
  authorName: string,
  body: string,
): Promise<RecipeComment> {
  const normalizedAuthor = authorName.trim();
  const normalizedBody = body.trim();
  if (!recipeId.trim()) throw new Error("Choose a recipe to comment on.");
  if (!normalizedAuthor || normalizedAuthor.length > 80) {
    throw new Error("Your name must be between 1 and 80 characters.");
  }
  if (!normalizedBody || normalizedBody.length > 1000) {
    throw new Error("A comment must be between 1 and 1000 characters.");
  }

  const id = randomUUID();
  const result = await getDb()`
    INSERT INTO recipe_comments (id, recipe_id, author_name, body)
    VALUES (${id}, ${recipeId}, ${normalizedAuthor}, ${normalizedBody})
    RETURNING
      id,
      recipe_id AS "recipeId",
      author_name AS "authorName",
      body,
      created_at AS "createdAt"
  `;
  const row = (result as unknown as CommentRow[])[0];
  if (!row) throw new Error("The comment was not saved.");
  return toComment(row);
}

export async function getCommentsForRecipe(recipeId: string): Promise<RecipeComment[]> {
  const result = await getDb()`
    SELECT
      id,
      recipe_id AS "recipeId",
      author_name AS "authorName",
      body,
      created_at AS "createdAt"
    FROM recipe_comments
    WHERE recipe_id = ${recipeId}
    ORDER BY created_at, id
  `;
  return (result as unknown as CommentRow[]).map(toComment);
}
