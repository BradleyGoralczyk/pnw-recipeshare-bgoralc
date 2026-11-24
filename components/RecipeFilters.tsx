"use client";

import { useState } from "react";

import { RecipeCard } from "@/components/RecipeCard";
import {
  CATEGORIES,
  CUISINES,
  filterRecipes,
  sortRecipes,
  type Category,
  type Cuisine,
  type Recipe,
  type RecipeSort,
} from "@/lib/recipe-model";

export function RecipeFilters({ recipes }: { recipes: Recipe[] }) {
  const [cuisine, setCuisine] = useState<Cuisine | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState<RecipeSort>("newest");
  const matchingRecipes = sortRecipes(
    filterRecipes(recipes, cuisine, category, keyword),
    sort,
  );

  function clearFilters() {
    setCuisine("");
    setCategory("");
    setKeyword("");
    setSort("newest");
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
        <div className="filter-field filter-field-search">
          <label htmlFor="recipe-search">Search recipes</label>
          <input
            autoComplete="off"
            id="recipe-search"
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Title or ingredient"
            type="search"
            value={keyword}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="recipe-sort">Sort by</label>
          <select
            id="recipe-sort"
            name="sort"
            onChange={(event) => setSort(event.target.value as RecipeSort)}
            value={sort}
          >
            <option value="newest">Newest</option>
            <option value="highest-rated">Highest rated</option>
          </select>
        </div>
        <button className="clear-filters-button" onClick={clearFilters} type="button">
          Clear filters and search
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
