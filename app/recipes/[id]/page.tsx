import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { isRecipeImageOptimizable } from "@/lib/image-url";
import { getAverageRating } from "@/lib/recipe-model";
import { getRecipeById } from "@/lib/recipes";
import { RatingControl } from "@/components/RatingControl";
import { ServingsScaler } from "@/components/ServingsScaler";

export const dynamic = "force-dynamic";

type RecipeDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailsPage({
  params,
}: RecipeDetailsPageProps) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  const averageRating = getAverageRating(recipe.ratings);

  return (
    <main className="page-shell detail-shell">
      <Link className="back-link" href="/">
        <span aria-hidden="true">←</span> All recipes
      </Link>

      <article className="recipe-detail">
        <div className="recipe-detail-copy">
          <div className="recipe-tags" aria-label="Recipe cuisine, category, and dietary tags">
            <span className="recipe-tag">{recipe.cuisine}</span>
            <span className="recipe-tag recipe-tag-secondary">
              {recipe.category}
            </span>
            {recipe.dietaryTags.map((tag) => (
              <span className="recipe-tag recipe-tag-dietary" key={tag}>{tag}</span>
            ))}
          </div>

          <h1>{recipe.title}</h1>
          <p className="recipe-author">
            Shared by <span>{recipe.authorName}</span>
          </p>

          <div className="detail-meta">
            <p className="detail-prep-time">
              <span className="meta-label">Prep time</span>
              <span>{recipe.prepTimeMinutes} minutes</span>
            </p>
            <p
              className="recipe-rating detail-rating"
              aria-label={
                averageRating === null
                  ? "Not rated yet"
                  : `${averageRating.toFixed(1)} out of 5 from ${recipe.ratings.length} ratings`
              }
            >
              <span className="rating-star" aria-hidden="true">
                ★
              </span>
              <span>
                {averageRating === null
                  ? "Not rated yet"
                  : `${averageRating.toFixed(1)} out of 5`}
              </span>
              {averageRating !== null && (
                <span className="rating-count">
                  {recipe.ratings.length} ratings
                </span>
              )}
            </p>
          </div>
          <RatingControl recipeId={recipe.id} />
          {recipe.videoUrl && (
            <p className="recipe-video-link">
              <a href={recipe.videoUrl} rel="noreferrer" target="_blank">
                Watch recipe video
              </a>
            </p>
          )}

          <section className="detail-section" aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading">Ingredients</h2>
            <ServingsScaler ingredients={recipe.ingredients} />
          </section>

          <section className="detail-section" aria-labelledby="steps-heading">
            <h2 id="steps-heading">How to make it</h2>
            <ol className="step-list">
              {recipe.steps.map((step, index) => (
                <li key={`${index}-${step}`}>
                  <span className="step-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="recipe-detail-photo-wrap">
          <Image
            alt={recipe.imageAlt}
            className="recipe-detail-photo"
            height={1200}
            unoptimized={!isRecipeImageOptimizable(recipe.imageUrl)}
            src={recipe.imageUrl}
            sizes="(max-width: 800px) 100vw, 50vw"
            width={1200}
          />
          <p className="image-caption">A recipe shared with care</p>
        </div>
      </article>
    </main>
  );
}
