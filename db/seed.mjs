import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { catalogRecipes } from "./recipe-catalog.mjs";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

export const sampleRecipes = [
  {
    id: "recipeshare-sample-persian-herb-salad",
    authorName: "RecipeShare Kitchen",
    title: "Persian Herb and Cucumber Salad",
    cuisine: "Iranian",
    category: "Salad",
    ingredients: [
      "2 cucumbers, diced",
      "3 ripe tomatoes, diced",
      "1 small red onion, finely chopped",
      "1/2 cup fresh parsley and mint, chopped",
      "2 tablespoons lemon juice",
      "1 tablespoon olive oil",
    ],
    steps: [
      "Combine the cucumbers, tomatoes, onion, parsley, and mint in a bowl.",
      "Whisk the lemon juice and olive oil together, then toss with the vegetables.",
      "Season to taste and serve chilled.",
    ],
    prepTimeMinutes: 15,
    imageUrl:
      "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/migrated/recipeshare-sample-persian-herb-salad.jpg",
    imageAlt: "A colorful bowl of fresh vegetables and herbs",
  },
  {
    id: "recipeshare-sample-italian-tiramisu",
    authorName: "RecipeShare Kitchen",
    title: "Classic Italian Tiramisu",
    cuisine: "Italian",
    category: "Dessert",
    ingredients: [
      "250 g mascarpone",
      "3 eggs, separated",
      "75 g caster sugar",
      "200 ml strong coffee, cooled",
      "200 g ladyfinger biscuits",
      "Unsweetened cocoa powder, for dusting",
    ],
    steps: [
      "Whisk the egg yolks with sugar until pale, then fold in the mascarpone.",
      "Whisk the egg whites to soft peaks and gently fold them into the mascarpone mixture.",
      "Briefly dip each biscuit in coffee and layer with the cream in a dish.",
      "Chill for at least 4 hours, then dust with cocoa before serving.",
    ],
    prepTimeMinutes: 30,
    imageUrl:
      "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/migrated/recipeshare-sample-italian-tiramisu.jpg",
    imageAlt: "A layered tiramisu dessert dusted with cocoa",
  },
];

export async function seedRecipes(sql) {
  for (const recipe of [...sampleRecipes, ...catalogRecipes]) {
    await sql`
      INSERT INTO recipes (
        id, author_name, title, cuisine, category, ingredients, steps,
        prep_time_minutes, image_url, image_alt, dietary_tags, video_url
      ) VALUES (
        ${recipe.id}, ${recipe.authorName}, ${recipe.title}, ${recipe.cuisine},
        ${recipe.category}, ${JSON.stringify(recipe.ingredients)}::jsonb,
        ${JSON.stringify(recipe.steps)}::jsonb, ${recipe.prepTimeMinutes},
        ${recipe.imageUrl}, ${recipe.imageAlt},
        ${JSON.stringify(recipe.dietaryTags ?? [])}::jsonb, ${recipe.videoUrl ?? null}
      )
      ON CONFLICT (id) DO UPDATE SET
        author_name = EXCLUDED.author_name,
        title = EXCLUDED.title,
        cuisine = EXCLUDED.cuisine,
        category = EXCLUDED.category,
        ingredients = EXCLUDED.ingredients,
        steps = EXCLUDED.steps,
        prep_time_minutes = EXCLUDED.prep_time_minutes,
        image_url = EXCLUDED.image_url,
        image_alt = EXCLUDED.image_alt,
        dietary_tags = EXCLUDED.dietary_tags,
        video_url = EXCLUDED.video_url
      WHERE recipes.id LIKE 'catalog-%'
    `;
  }
}

const isDirectRun = process.argv[1] &&
  fileURLToPath(import.meta.url).toLowerCase() === resolve(process.argv[1]).toLowerCase();

if (isDirectRun) {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error("Set DATABASE_URL to the target Neon database before seeding.");
    process.exit(1);
  }

  await seedRecipes(neon(connectionString));
  console.log(`Seeded ${sampleRecipes.length + catalogRecipes.length} recipes (safe to repeat).`);
}
