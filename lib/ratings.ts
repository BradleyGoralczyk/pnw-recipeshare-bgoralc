import "server-only";

import { randomUUID } from "node:crypto";

import { getDb } from "@/lib/db";

export type Rating = {
  id: string;
  recipeId: string;
  value: number;
};

type RatingRow = { id: unknown; recipeId: unknown; value: unknown };

export async function addRating(recipeId: string, value: number): Promise<Rating> {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("A rating must be a whole number from 1 to 5.");
  }

  const id = randomUUID();
  const result = await getDb()`
    INSERT INTO recipe_ratings (id, recipe_id, value)
    VALUES (${id}, ${recipeId}, ${value})
    RETURNING id, recipe_id AS "recipeId", value
  `;
  const row = (result as unknown as RatingRow[])[0];
  if (!row) throw new Error("The rating was not saved.");

  return {
    id: String(row.id),
    recipeId: String(row.recipeId),
    value: Number(row.value),
  };
}

export async function getRatingsForRecipe(recipeId: string): Promise<Rating[]> {
  const result = await getDb()`
    SELECT id, recipe_id AS "recipeId", value
    FROM recipe_ratings
    WHERE recipe_id = ${recipeId}
    ORDER BY created_at, id
  `;

  return (result as unknown as RatingRow[]).map((row) => ({
    id: String(row.id),
    recipeId: String(row.recipeId),
    value: Number(row.value),
  }));
}
