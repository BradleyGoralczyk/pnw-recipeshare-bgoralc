"use client";

import { useActionState, useState } from "react";

import {
  createRecipe,
  type RecipeFormState,
} from "@/app/actions/recipes";
import type { RecipeFormField } from "@/lib/recipe-form";
import { CATEGORIES, CUISINES } from "@/lib/recipe-model";

const initialState: RecipeFormState = { errors: {} };

const fieldLabels: Record<RecipeFormField, string> = {
  authorName: "Author name",
  title: "Recipe title",
  cuisine: "Cuisine",
  category: "Category",
  ingredients: "Ingredients",
  steps: "Preparation steps",
  prepTimeMinutes: "Prep time in minutes",
  imageUrl: "Image URL",
};

export function RecipeForm() {
  const [draft, setDraft] = useState<Record<string, string>>({
    authorName: "",
    title: "",
    cuisine: "",
    category: "",
    ingredients: "",
    steps: "",
    prepTimeMinutes: "",
    imageUrl: "",
  });
  const [state, formAction, isPending] = useActionState(
    createRecipe,
    initialState,
  );

  function errorFor(field: RecipeFormField) {
    const error = state.errors[field];
    if (!error) return null;

    return (
      <p className="field-error" id={`${field}-error`} role="alert">
        {error}
      </p>
    );
  }

  function fieldProps(field: RecipeFormField) {
    const hasError = Boolean(state.errors[field]);

    return {
      "aria-invalid": hasError,
      "aria-describedby": hasError ? `${field}-error` : undefined,
      id: field,
      name: field,
      required: true,
    };
  }

  function updateDraft(field: RecipeFormField, value: string) {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  }

  return (
    <form
      action={formAction}
      className="recipe-form"
      noValidate
      onReset={(event) => event.preventDefault()}
    >
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="authorName">{fieldLabels.authorName}</label>
          <input
            {...fieldProps("authorName")}
            autoComplete="name"
            onChange={(event) => updateDraft("authorName", event.target.value)}
            value={draft.authorName}
            maxLength={80}
            placeholder="Your name"
            type="text"
          />
          {errorFor("authorName")}
        </div>

        <div className="form-field">
          <label htmlFor="title">{fieldLabels.title}</label>
          <input
            {...fieldProps("title")}
            onChange={(event) => updateDraft("title", event.target.value)}
            value={draft.title}
            maxLength={120}
            placeholder="e.g. Golden Chickpea Curry"
            type="text"
          />
          {errorFor("title")}
        </div>

        <div className="form-field">
          <label htmlFor="cuisine">{fieldLabels.cuisine}</label>
          <select
            {...fieldProps("cuisine")}
            onChange={(event) => updateDraft("cuisine", event.target.value)}
            value={draft.cuisine}
          >
            <option disabled value="">
              Choose a cuisine
            </option>
            {CUISINES.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
          {errorFor("cuisine")}
        </div>

        <div className="form-field">
          <label htmlFor="category">{fieldLabels.category}</label>
          <select
            {...fieldProps("category")}
            onChange={(event) => updateDraft("category", event.target.value)}
            value={draft.category}
          >
            <option disabled value="">
              Choose a category
            </option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errorFor("category")}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="ingredients">{fieldLabels.ingredients}</label>
          <textarea
            {...fieldProps("ingredients")}
            onChange={(event) => updateDraft("ingredients", event.target.value)}
            value={draft.ingredients}
            placeholder={"One ingredient per line\n2 cups rice\n1 tablespoon olive oil"}
            rows={5}
          />
          <span className="field-hint">Enter one ingredient on each line.</span>
          {errorFor("ingredients")}
        </div>

        <div className="form-field form-field-wide">
          <label htmlFor="steps">{fieldLabels.steps}</label>
          <textarea
            {...fieldProps("steps")}
            onChange={(event) => updateDraft("steps", event.target.value)}
            value={draft.steps}
            placeholder={"One step per line\nRinse the rice.\nCook until tender."}
            rows={5}
          />
          <span className="field-hint">Enter one step on each line.</span>
          {errorFor("steps")}
        </div>

        <div className="form-field">
          <label htmlFor="prepTimeMinutes">
            {fieldLabels.prepTimeMinutes}
          </label>
          <input
            {...fieldProps("prepTimeMinutes")}
            onChange={(event) => updateDraft("prepTimeMinutes", event.target.value)}
            value={draft.prepTimeMinutes}
            min={1}
            placeholder="30"
            step={1}
            type="number"
          />
          {errorFor("prepTimeMinutes")}
        </div>

        <div className="form-field">
          <label htmlFor="imageUrl">{fieldLabels.imageUrl}</label>
          <input
            {...fieldProps("imageUrl")}
            autoCapitalize="none"
            onChange={(event) => updateDraft("imageUrl", event.target.value)}
            value={draft.imageUrl}
            placeholder="https://example.com/food-photo.jpg"
            type="url"
          />
          <span className="field-hint">Link to a food photo (no people).</span>
          {errorFor("imageUrl")}
        </div>
      </div>

      <div className="form-actions">
        <p className="form-required-note">All fields are required.</p>
        <button className="submit-button" disabled={isPending} type="submit">
          {isPending ? "Saving recipe…" : "Share recipe"}
        </button>
      </div>
    </form>
  );
}
