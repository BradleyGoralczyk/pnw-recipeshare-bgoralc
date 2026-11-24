"use client";

import { useActionState } from "react";

import { rateRecipe, type RatingActionState } from "@/app/actions/ratings";

const initialState: RatingActionState = { error: null, success: false };

export function RatingControl({ recipeId }: { recipeId: string }) {
  const [state, formAction, pending] = useActionState(rateRecipe, initialState);

  return (
    <form action={formAction} className="rating-form">
      <input name="recipeId" type="hidden" value={recipeId} />
      <fieldset className="rating-options" disabled={pending}>
        <legend>Rate this recipe</legend>
        {[1, 2, 3, 4, 5].map((value) => (
          <label className="rating-option" key={value}>
            <input
              aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
              name="value"
              required
              type="radio"
              value={value}
            />
            <span aria-hidden="true">★</span>
            <span className="sr-only">{value}</span>
          </label>
        ))}
      </fieldset>
      <button className="submit-button rating-submit" disabled={pending} type="submit">
        {pending ? "Saving…" : "Submit rating"}
      </button>
      {state.error && <p className="field-error" role="alert">{state.error}</p>}
      {state.success && <p className="rating-success" role="status">Your rating was saved.</p>}
    </form>
  );
}
