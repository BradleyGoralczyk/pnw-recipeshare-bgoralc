import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

const RECIPE_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

if (!connectionString) {
  throw new Error("Set DATABASE_URL before migrating recipe images.");
}
if (!blobToken) {
  throw new Error("Set BLOB_READ_WRITE_TOKEN before migrating recipe images.");
}

const sql = neon(connectionString);
const imageMigrations = [
  {
    id: "recipeshare-sample-persian-herb-salad",
    title: "Persian Herb and Cucumber Salad",
    sourceUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=85",
    pathname: "recipe-images/migrated/recipeshare-sample-persian-herb-salad.jpg",
  },
  {
    id: "recipeshare-sample-italian-tiramisu",
    title: "Classic Italian Tiramisu",
    sourceUrl:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1200&q=85",
    pathname: "recipe-images/migrated/recipeshare-sample-italian-tiramisu.jpg",
  },
];

for (const recipe of imageMigrations) {
  const [record] = await sql`
    SELECT image_url AS "imageUrl"
    FROM recipes
    WHERE id = ${recipe.id}
  `;

  if (!record) {
    console.log(`Skipped ${recipe.title}: recipe not found.`);
    continue;
  }

  if (new URL(record.imageUrl).pathname.endsWith(`/${recipe.pathname}`)) {
    console.log(`Skipped ${recipe.title}: image is already in Blob.`);
    continue;
  }

  if (record.imageUrl !== recipe.sourceUrl) {
    console.log(`Skipped ${recipe.title}: its image URL has changed.`);
    continue;
  }

  const response = await fetch(recipe.sourceUrl, {
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Could not download ${recipe.title}'s source image (${response.status}).`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0].trim();
  if (!contentType || !RECIPE_IMAGE_CONTENT_TYPES.includes(contentType)) {
    throw new Error(`The source image for ${recipe.title} has an unsupported content type.`);
  }

  const image = Buffer.from(await response.arrayBuffer());
  if (image.length === 0) {
    throw new Error(`The source image for ${recipe.title} is empty.`);
  }

  const blob = await put(recipe.pathname, image, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType,
    token: blobToken,
  });

  const updated = await sql`
    UPDATE recipes
    SET image_url = ${blob.url}
    WHERE id = ${recipe.id} AND image_url = ${recipe.sourceUrl}
    RETURNING id
  `;
  if (updated.length !== 1) {
    throw new Error(`Uploaded ${recipe.title}'s image, but its recipe changed before update.`);
  }

  console.log(
    `Migrated ${recipe.title} (${image.length} bytes) to Vercel Blob: ${blob.url}`,
  );
}
