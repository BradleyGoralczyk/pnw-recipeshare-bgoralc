"use client";

import { useState } from "react";

import { RecipeCard } from "@/components/RecipeCard";
import {
  CATEGORIES,
  CUISINES,
  filterRecipes,
  type Category,
  type Cuisine,
  type Recipe,
} from "@/lib/recipe-model";

export function RecipeFilters({ recipes }: { recipes: Recipe[] }) {
  const [cuisine, setCuisine] = useState<Cuisine | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const matchingRecipes = filterRecipes(recipes, cuisine, category);

  function clearFilters() {
    setCuisine("");
    setCategory("");
  }

  return (
    <>
      <div className="recipe-filters" aria-label="Filter recipes">
        <div className="filter-field">
          <label htmlFor="cuisine-filter">Cuisine</label>
          <select
            id="cuisine-filter"
            name="cuisine"
            value={cuisine}
            onChange={(event) => setCuisine(event.target.value as Cuisine | "")}
          >
            <option value="">All cuisines</option>
            {CUISINES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="category-filter">Category</label>
          <select
            id="category-filter"
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category | "")}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <button className="clear-filters-button" onClick={clearFilters} type="button">
          Clear filters
        </button>
      </div>

      {matchingRecipes.length > 0 ? (
        <div className="recipe-grid" aria-live="polite">
          {matchingRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="no-recipes-message" role="status">
          No recipes found
        </p>
      )}
    </>
  );
}
