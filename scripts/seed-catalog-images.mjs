import nextEnv from "@next/env";
import { put } from "@vercel/blob";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const photos = [
  ["breakfast", "photo-1506084868230-bb9d95c24759", "Calum Lewis"],
  ["main-dish", "photo-1577281475566-78b57c5dfd4e", "Rumman Amin"],
  ["fast-food", "photo-1610970878459-a0e464d7592b", "Giorgi Iremadze"],
  ["soup", "photo-1603208614668-b35c95647eaf", "Unsplash contributor"],
  ["dessert", "photo-1768236360396-0f131beb3028", "Phoebe Lynch"],
  ["snack", "photo-1687068328974-13261a846e58", "Sehajpal Singh"],
  ["drink", "photo-1537401198317-1231361cbd5f", "Vin Jack"],
];

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("Set BLOB_READ_WRITE_TOKEN before uploading catalog photos.");
}

for (const [category, photoId] of photos) {
  const source = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=82`;
  const response = await fetch(source);
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
    throw new Error(`Could not download the ${category} photo from Unsplash.`);
  }
  const blob = await put(`recipe-images/catalog/${category}.jpg`, Buffer.from(await response.arrayBuffer()), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "image/jpeg",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  console.log(`${category}: ${blob.url}`);
}
