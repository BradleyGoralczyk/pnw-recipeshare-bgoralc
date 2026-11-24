import Link from "next/link";

import { RecipeForm } from "@/components/RecipeForm";

export default function NewRecipePage() {
  return (
    <main className="page-shell form-shell">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> All recipes
      </Link>
      <section className="form-panel" aria-labelledby="new-recipe-heading">
        <div className="form-heading">
          <p className="eyebrow">Pass a good thing along</p>
          <h1 id="new-recipe-heading">Share a recipe</h1>
          <p className="intro-copy">
            Add the details so someone else can make it in their kitchen.
          </p>
        </div>
        <RecipeForm />
      </section>
    </main>
  );
}
