import { readFile, writeFile } from "node:fs/promises";
import nextEnv from "@next/env";
import { put } from "@vercel/blob";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("Set BLOB_READ_WRITE_TOKEN before uploading catalog photos.");
}

const manifestUrl = new URL("../db/catalog-photo-manifest.json", import.meta.url);
const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
for (const photo of manifest) {
  if (photo.blobUrl) continue;

  const response = await fetch(photo.imageUrl, {
    headers: { "User-Agent": "RecipeShare/1.0 (catalog image download; educational project)" },
  });
  const contentType = response.headers.get("content-type")?.split(";")[0];
  const extensions = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  if (!response.ok || !extensions[contentType]) {
    throw new Error(`Could not download a supported image for ${photo.recipeId}.`);
  }

  const blob = await put(
    `recipe-images/catalog/recipes/${photo.recipeId}.${extensions[contentType]}`,
    Buffer.from(await response.arrayBuffer()),
    {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    },
  );
  photo.blobUrl = blob.url;
  await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Uploaded ${photo.recipeId}.`);
}
console.log(`Uploaded ${manifest.length} unique recipe photos.`);
