import {
  CATEGORIES,
  CUISINES,
  DIETARY_TAGS,
  type Category,
  type Cuisine,
  type DietaryTag,
  type Recipe,
} from "@/lib/recipe-model";

export type RecipeFormField =
  | "authorName"
  | "title"
  | "cuisine"
  | "category"
  | "ingredients"
  | "steps"
  | "prepTimeMinutes"
  | "imageUrl"
  | "videoUrl"
  | "dietaryTags";

export type RecipeFormErrors = Partial<Record<RecipeFormField, string>>;

export type RecipeDraft = Omit<Recipe, "id" | "imageAlt" | "ratings">;

export type RecipeFormValidation = {
  data: RecipeDraft | null;
  errors: RecipeFormErrors;
};

function readText(formData: FormData, field: RecipeFormField): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function isCuisine(value: string): value is Cuisine {
  return (CUISINES as readonly string[]).includes(value);
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

function isDietaryTag(value: string): value is DietaryTag {
  return (DIETARY_TAGS as readonly string[]).includes(value);
}

function readList(formData: FormData, field: "ingredients" | "steps"): string[] {
  return readText(formData, field)
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function validateRecipeForm(formData: FormData): RecipeFormValidation {
  const errors: RecipeFormErrors = {};
  const authorName = readText(formData, "authorName");
  const title = readText(formData, "title");
  const cuisineValue = readText(formData, "cuisine");
  const categoryValue = readText(formData, "category");
  const ingredients = readList(formData, "ingredients");
  const steps = readList(formData, "steps");
  const prepTimeValue = readText(formData, "prepTimeMinutes");
  const imageUrl = readText(formData, "imageUrl");
  const videoUrlValue = readText(formData, "videoUrl");
  const dietaryTagValues = formData.getAll("dietaryTags");
  const dietaryTags = [...new Set(dietaryTagValues.filter(
    (value): value is string => typeof value === "string",
  ))];

  if (!authorName) errors.authorName = "Author name is required.";
  if (!title) errors.title = "Recipe title is required.";

  let cuisine: Cuisine | undefined;
  if (!cuisineValue) {
    errors.cuisine = "Choose a cuisine.";
  } else if (!isCuisine(cuisineValue)) {
    errors.cuisine = "Choose a cuisine from the list.";
  } else {
    cuisine = cuisineValue;
  }

  let category: Category | undefined;
  if (!categoryValue) {
    errors.category = "Choose a category.";
  } else if (!isCategory(categoryValue)) {
    errors.category = "Choose a category from the list.";
  } else {
    category = categoryValue;
  }

  if (ingredients.length === 0) {
    errors.ingredients = "Add at least one ingredient.";
  }
  if (steps.length === 0) {
    errors.steps = "Add at least one preparation step.";
  }

  const prepTimeMinutes = Number(prepTimeValue);
  if (!prepTimeValue || !Number.isInteger(prepTimeMinutes) || prepTimeMinutes < 1) {
    errors.prepTimeMinutes = "Enter a whole number of minutes greater than zero.";
  }

  let parsedImageUrl: URL | undefined;
  try {
    parsedImageUrl = new URL(imageUrl);
  } catch {
    errors.imageUrl = "Enter a valid image URL.";
  }
  if (
    parsedImageUrl &&
    parsedImageUrl.protocol !== "https:" &&
    parsedImageUrl.protocol !== "http:"
  ) {
    errors.imageUrl = "Image URL must start with http:// or https://.";
  }

  let parsedVideoUrl: URL | null = null;
  if (videoUrlValue) {
    try {
      parsedVideoUrl = new URL(videoUrlValue);
    } catch {
      errors.videoUrl = "Enter a valid video URL or leave the field empty.";
    }
    if (
      parsedVideoUrl &&
      parsedVideoUrl.protocol !== "https:" &&
      parsedVideoUrl.protocol !== "http:"
    ) {
      errors.videoUrl = "Video URL must start with http:// or https://.";
    }
  }

  const validatedDietaryTags: DietaryTag[] = [];
  for (const tag of dietaryTags) {
    if (!isDietaryTag(tag)) {
      errors.dietaryTags = "Choose dietary tags from the available options.";
      continue;
    }
    validatedDietaryTags.push(tag);
  }

  if (
    Object.keys(errors).length > 0 ||
    !cuisine ||
    !category ||
    !parsedImageUrl
  ) {
    return { data: null, errors };
  }

  return {
    data: {
      authorName,
      title,
      cuisine,
      category,
      ingredients,
      steps,
      prepTimeMinutes,
      imageUrl: parsedImageUrl.href,
      videoUrl: parsedVideoUrl?.href ?? null,
      dietaryTags: validatedDietaryTags,
    },
    errors: {},
  };
}
