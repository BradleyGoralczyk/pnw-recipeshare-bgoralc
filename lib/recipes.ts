import "server-only";

import { getDb } from "@/lib/db";
import {
  CATEGORIES,
  CUISINES,
  DIETARY_TAGS,
  type Category,
  type Cuisine,
  type DietaryTag,
  type Recipe,
} from "@/lib/recipe-model";

type RecipeRow = Record<string, unknown>;

function readString(row: RecipeRow, field: string): string {
  const value = row[field];
  if (typeof value !== "string") {
    throw new Error(`Database returned an invalid recipe ${field}.`);
  }
  return value;
}

function readStringList(value: unknown, field: string): string[] {
  const parsed: unknown = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === "string")) {
    throw new Error(`Database returned an invalid recipe ${field}.`);
  }
  return parsed;
}

function readRatings(value: unknown): number[] {
  const parsed: unknown = typeof value === "string" ? JSON.parse(value) : value;
  if (
    !Array.isArray(parsed) ||
    !parsed.every((item) => Number.isInteger(item) && item >= 1 && item <= 5)
  ) {
    throw new Error("Database returned invalid recipe ratings.");
  }
  return parsed;
}

function readDietaryTags(value: unknown): DietaryTag[] {
  const tags = readStringList(value, "dietary tags");
  if (!tags.every((tag) => (DIETARY_TAGS as readonly string[]).includes(tag))) {
    throw new Error("Database returned an unsupported recipe dietary tag.");
  }
  return tags as DietaryTag[];
}

function toRecipe(row: RecipeRow): Recipe {
  const cuisine = readString(row, "cuisine");
  const category = readString(row, "category");
  const prepTimeMinutes = row.prepTimeMinutes;

  if (!(CUISINES as readonly string[]).includes(cuisine)) {
    throw new Error("Database returned an unsupported recipe cuisine.");
  }
  if (!(CATEGORIES as readonly string[]).includes(category)) {
    throw new Error("Database returned an unsupported recipe category.");
  }
  if (typeof prepTimeMinutes !== "number" || !Number.isInteger(prepTimeMinutes)) {
    throw new Error("Database returned an invalid recipe prep time.");
  }

  return {
    id: readString(row, "id"),
    authorName: readString(row, "authorName"),
    title: readString(row, "title"),
    cuisine: cuisine as Cuisine,
    category: category as Category,
    ingredients: readStringList(row.ingredients, "ingredients"),
    steps: readStringList(row.steps, "steps"),
    prepTimeMinutes,
    imageUrl: readString(row, "imageUrl"),
    imageAlt: readString(row, "imageAlt"),
    ratings: readRatings(row.ratings),
    videoUrl:
      row.videoUrl === null || typeof row.videoUrl === "string"
        ? row.videoUrl
        : (() => { throw new Error("Database returned an invalid recipe video URL."); })(),
    dietaryTags: readDietaryTags(row.dietaryTags),
  };
}

const recipeSelect = `
  SELECT
    recipe.id,
    recipe.author_name AS "authorName",
    recipe.title,
    recipe.cuisine,
    recipe.category,
    recipe.ingredients,
    recipe.steps,
    recipe.prep_time_minutes AS "prepTimeMinutes",
    recipe.image_url AS "imageUrl",
    recipe.image_alt AS "imageAlt",
    recipe.video_url AS "videoUrl",
    recipe.dietary_tags AS "dietaryTags",
    COALESCE(
      (
        SELECT json_agg(rating.value ORDER BY rating.created_at, rating.id)
        FROM recipe_ratings AS rating
        WHERE rating.recipe_id = recipe.id
      ),
      '[]'::json
    ) AS ratings
  FROM recipes AS recipe
`;

export async function getRecipes(): Promise<Recipe[]> {
  const result = await getDb().query(
    `${recipeSelect} ORDER BY recipe.created_at DESC`,
    [],
  );
  return (result as unknown as RecipeRow[]).map(toRecipe);
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  const result = await getDb().query(
    `${recipeSelect} WHERE recipe.id = $1 LIMIT 1`,
    [id],
  );
  const row = (result as unknown as RecipeRow[])[0];
  return row ? toRecipe(row) : undefined;
}

export async function addRecipe(recipe: Recipe): Promise<void> {
  await getDb()`
    INSERT INTO recipes (
      id,
      author_name,
      title,
      cuisine,
      category,
      ingredients,
      steps,
      prep_time_minutes,
      image_url,
      image_alt,
      video_url,
      dietary_tags
    )
    VALUES (
      ${recipe.id},
      ${recipe.authorName},
      ${recipe.title},
      ${recipe.cuisine},
      ${recipe.category},
      ${JSON.stringify(recipe.ingredients)}::jsonb,
      ${JSON.stringify(recipe.steps)}::jsonb,
      ${recipe.prepTimeMinutes},
      ${recipe.imageUrl},
      ${recipe.imageAlt},
      ${recipe.videoUrl},
      ${JSON.stringify(recipe.dietaryTags)}::jsonb
    )
  `;
}
