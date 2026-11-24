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

export type Cuisine = (typeof CUISINES)[number];
export type Category = (typeof CATEGORIES)[number];

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
  ratings: number[];
}

export function getAverageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null;

  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return Number(average.toFixed(1));
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.id === id);
}

// Starter recipes use Unsplash photos; all images are food-only and served from
// Unsplash's image CDN. Recipe and rating persistence will be added with M6.
export const recipes: Recipe[] = [
  {
    id: "chickpea-curry",
    authorName: "Nila Rahimi",
    title: "Golden Chickpea Curry",
    cuisine: "Indian",
    category: "Main Dish",
    ingredients: [
      "2 cans chickpeas, drained",
      "1 onion, diced",
      "2 tablespoons curry paste",
      "1 can coconut milk",
      "2 cups spinach",
    ],
    steps: [
      "Soften the onion in a large pan over medium heat.",
      "Stir in the curry paste, chickpeas, and coconut milk.",
      "Simmer for 15 minutes, fold in the spinach, and serve warm.",
    ],
    prepTimeMinutes: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A colorful bowl of curry with fresh greens",
    ratings: [5, 4, 5, 5, 4, 5],
  },
  {
    id: "steamed-dumplings",
    authorName: "Mei Chen",
    title: "Ginger Vegetable Dumplings",
    cuisine: "Chinese",
    category: "Snack",
    ingredients: [
      "24 round dumpling wrappers",
      "2 cups finely chopped cabbage",
      "1 cup grated carrot",
      "1 tablespoon grated ginger",
      "2 tablespoons soy sauce",
    ],
    steps: [
      "Mix the vegetables, ginger, and soy sauce in a bowl.",
      "Add a spoonful of filling to each wrapper and seal the edges.",
      "Steam for 8 minutes and serve with a dipping sauce.",
    ],
    prepTimeMinutes: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Steamed dumplings arranged on a plate",
    ratings: [4, 5, 5, 4, 5],
  },
  {
    id: "shoyu-ramen",
    authorName: "Hana Mori",
    title: "Weeknight Shoyu Ramen",
    cuisine: "Japanese",
    category: "Main Dish",
    ingredients: [
      "2 portions ramen noodles",
      "4 cups vegetable broth",
      "3 tablespoons soy sauce",
      "2 soft-boiled eggs",
      "2 green onions, sliced",
    ],
    steps: [
      "Warm the broth with the soy sauce in a saucepan.",
      "Cook the ramen noodles according to the package directions.",
      "Divide noodles and broth between bowls; top with egg and green onion.",
    ],
    prepTimeMinutes: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "A steaming bowl of ramen topped with noodles and garnish",
    ratings: [5, 5, 4, 5, 4, 5, 5],
  },
  {
    id: "margherita-pizza",
    authorName: "Luca Bianchi",
    title: "Simple Margherita Pizza",
    cuisine: "Italian",
    category: "Fast Food",
    ingredients: [
      "1 prepared pizza dough",
      "1/2 cup crushed tomatoes",
      "6 ounces fresh mozzarella",
      "Fresh basil leaves",
      "1 tablespoon olive oil",
    ],
    steps: [
      "Heat the oven to 475°F (245°C). Stretch the dough onto a baking tray.",
      "Spread on the tomatoes and scatter mozzarella over the top.",
      "Bake until the crust is golden, then finish with basil and olive oil.",
    ],
    prepTimeMinutes: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Freshly baked pizza topped with tomato and cheese",
    ratings: [4, 5, 5, 4],
  },
];
