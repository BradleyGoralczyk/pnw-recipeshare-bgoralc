import Link from "next/link";

import { RecipeCard } from "@/components/RecipeCard";
import { recipes } from "@/lib/recipes";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="welcome-panel" aria-labelledby="welcome-heading">
        <div className="welcome-copy">
          <p className="eyebrow">A little inspiration for your table</p>
          <h1 id="welcome-heading">Good food brings us together.</h1>
          <p className="intro-copy">
            Find something new to cook, shared from kitchens around the world.
          </p>
          <Link className="hero-link" href="/recipes/new">
            Share a recipe <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="welcome-stamp" aria-hidden="true">
          <span>Recipes</span>
          <span>worth</span>
          <span>sharing</span>
          <span className="stamp-star">✳</span>
        </div>
      </section>

      <section
        className="recipes-section"
        aria-labelledby="recipes-heading"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">From the community</p>
            <h2 id="recipes-heading">A taste of everywhere</h2>
          </div>
          <p className="section-note">A few favorites to get you started</p>
        </div>
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </main>
  );
}
