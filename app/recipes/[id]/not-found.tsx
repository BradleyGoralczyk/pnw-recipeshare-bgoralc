import Link from "next/link";

export default function RecipeNotFound() {
  return (
    <main className="page-shell detail-shell">
      <section className="not-found-panel" aria-labelledby="not-found-heading">
        <p className="eyebrow">That page is off the menu</p>
        <h1 id="not-found-heading">Recipe not found</h1>
        <p className="intro-copy">
          We couldn’t find that recipe. It may have moved or the link may be incorrect.
        </p>
        <Link className="primary-link" href="/">
          Browse all recipes
        </Link>
      </section>
    </main>
  );
}
