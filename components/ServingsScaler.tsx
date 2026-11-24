"use client";

import { useState } from "react";

import { scaleIngredient } from "@/lib/servings";

const BASE_SERVINGS = 4;

export function ServingsScaler({ ingredients }: { ingredients: string[] }) {
  const [servings, setServings] = useState(BASE_SERVINGS);

  return (
    <>
      <div className="servings-control">
        <label htmlFor="servings">Servings</label>
        <input
          id="servings"
          max={24}
          min={1}
          onChange={(event) => {
            const nextServings = Number(event.target.value);
            if (Number.isInteger(nextServings) && nextServings >= 1 && nextServings <= 24) {
              setServings(nextServings);
            }
          }}
          type="number"
          value={servings}
        />
      </div>
      <ul className="ingredient-list">
        {ingredients.map((ingredient) => (
          <li key={ingredient}>{scaleIngredient(ingredient, servings, BASE_SERVINGS)}</li>
        ))}
      </ul>
    </>
  );
}
