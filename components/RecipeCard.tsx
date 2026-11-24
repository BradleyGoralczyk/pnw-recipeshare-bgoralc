import Image from "next/image";
import Link from "next/link";

import { getAverageRating, type Recipe } from "@/lib/recipes";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const averageRating = getAverageRating(recipe.ratings);
  const ratingLabel =
    averageRating === null
      ? "Not rated yet"
      : `${averageRating.toFixed(1)} out of 5 from ${recipe.ratings.length} ratings`;

  return (
    <article className="recipe-card" aria-label={recipe.title}>
      <Link
        className="recipe-card-link"
        href={`/recipes/${recipe.id}`}
        aria-label={`Open ${recipe.title} recipe`}
      >
        <div className="recipe-photo-wrap">
          <Image
            alt={recipe.imageAlt}
            className="recipe-photo"
            height={800}
            src={recipe.imageUrl}
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            width={1200}
          />
        </div>
        <div className="recipe-card-content">
          <div className="recipe-tags" aria-label="Recipe cuisine and category">
            <span className="recipe-tag">{recipe.cuisine}</span>
            <span className="recipe-tag recipe-tag-secondary">
              {recipe.category}
            </span>
          </div>
          <h3 className="recipe-title">{recipe.title}</h3>
          <p className="recipe-rating" aria-label={ratingLabel}>
            <span className="rating-star" aria-hidden="true">
              ★
            </span>
            <span>
              {averageRating === null ? "Not rated yet" : averageRating.toFixed(1)}
            </span>
            {averageRating !== null && (
              <span className="rating-count">
                {recipe.ratings.length} ratings
              </span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
