export const CUISINES = [
  "American",
  "Arabic",
  "Chinese",
  "German",
  "Indian",
  "Iranian",
  "Italian",
  "Japanese",
  "Mexican",
  "Other",
] as const;

export const CATEGORIES = [
  "Breakfast",
  "Main Dish",
  "Fast Food",
  "Soup",
  "Salad",
  "Dessert",
  "Snack",
  "Drink",
] as const;

export const DIETARY_TAGS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Nut-free",
] as const;

export type Cuisine = (typeof CUISINES)[number];
export type Category = (typeof CATEGORIES)[number];
export type DietaryTag = (typeof DIETARY_TAGS)[number];
export type RecipeSort = "newest" | "highest-rated";

export interface RecipeImageCredit {
  creator: string;
  sourcePage: string;
  license: string;
  licenseUrl: string;
}

export interface Recipe {
  id: string;
  authorName: string;
  title: string;
  cuisine: Cuisine;
  category: Category;
  ingredients: string[];
  steps: string[];
  prepTimeMinutes: number;
  imageUrl: string;
  imageAlt: string;
  imageCredit?: RecipeImageCredit;
  ratings: number[];
  videoUrl: string | null;
  dietaryTags: DietaryTag[];
}

export function getAverageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null;

  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Number(average.toFixed(1));
}

export function filterRecipes(
  recipeList: Recipe[],
  cuisine: Cuisine | "",
  category: Category | "",
  keyword = "",
  dietaryTags: DietaryTag[] = [],
): Recipe[] {
  const normalizedKeyword = keyword.trim().toLocaleLowerCase();

  return recipeList.filter(
    (recipe) =>
      (!cuisine || recipe.cuisine === cuisine) &&
      (!category || recipe.category === category) &&
      (!normalizedKeyword ||
        recipe.title.toLocaleLowerCase().includes(normalizedKeyword) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLocaleLowerCase().includes(normalizedKeyword),
        )) &&
      dietaryTags.every((tag) => recipe.dietaryTags.includes(tag)),
  );
}

export function sortRecipes(
  recipeList: Recipe[],
  sort: RecipeSort,
): Recipe[] {
  if (sort === "newest") return [...recipeList];

  return recipeList
    .map((recipe, index) => ({ recipe, index }))
    .sort((left, right) => {
      const leftRating = getAverageRating(left.recipe.ratings) ?? 0;
      const rightRating = getAverageRating(right.recipe.ratings) ?? 0;
      return rightRating - leftRating || left.index - right.index;
    })
    .map(({ recipe }) => recipe);
}
