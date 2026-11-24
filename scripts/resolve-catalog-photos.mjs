import { readFile, writeFile } from "node:fs/promises";
import { catalogRecipes } from "../db/recipe-catalog.mjs";

const allowedLicenses = /^(CC0|Public domain|CC BY(?:-SA)?(?: 1\.| 2\.| 2\.5| 3\.| 4\.)|CC BY(?:-SA)?-\w)/i;
const stopWords = new Set(["and", "with", "over", "in", "the", "a", "an", "of", "style", "inspired", "morning", "fresh", "warm", "classic", "old", "smoky", "sweet", "crispy", "golden", "ginger", "roasted", "spiced", "chopped", "herbed", "citrus", "plant", "based"]);
const dishAnchors = {
  Breakfast: ["chilaquiles", "congee", "chilla", "porridge", "pancake", "polenta bowl"],
  "Main Dish": ["mujaddara", "chana masala", "calabacitas", "donburi", "rice bowl", "potato skillet", "lentil ragù", "polenta", "quinoa bowl", "rice"],
  "Fast Food": ["mushroom sliders", "falafel", "spring rolls", "rice paper rolls", "currywurst", "kathi rolls", "lavash wraps", "panini", "onigiri", "tacos", "lettuce wraps"],
  Soup: ["corn chowder", "lentil soup", "mushroom soup", "shorba", "ash reshteh", "ribollita", "miso soup", "black bean sopa", "chickpea soup"],
  Salad: ["tabouli", "tabbouleh", "kachumber", "goma-ae", "slaw", "salad"],
  Dessert: ["semolina cakes", "rice balls", "mochi", "rice kheer", "rice pudding", "crumble", "polenta pudding", "cake"],
  Snack: ["roasted chickpeas", "pita crisps", "scallion pancake", "pretzel", "aloo tikki", "edamame", "corn ribs", "cauliflower bites", "focaccia bites", "snack"],
  Drink: ["iced tea", "lemonade", "schorle", "lassi", "sharbat", "tea", "soda", "cooler", "juice"],
};

function searchPhrases(recipe) {
  const title = recipe.title.toLowerCase();
  const anchor = dishAnchors[recipe.category].find((term) => term.split(" ").every((word) => title.includes(word)));
  if (!anchor) throw new Error(`No dish anchor configured for ${recipe.title}.`);
  const anchorWords = new Set(anchor.split(" "));
  const titleWords = title.replace(/[^\p{L}\p{N} -]/gu, " ").split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word) && !anchorWords.has(word));
  const tail = anchor.split(" ").at(-1);
  return [...new Set([...titleWords.map((word) => `${word} ${anchor}`), anchor, tail])];
}

function plainText(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
}

async function findPhoto(recipe, usedSources) {
  for (const phrase of searchPhrases(recipe)) {
    const query = new URL("https://commons.wikimedia.org/w/api.php");
    query.search = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: `${phrase.split(" ").map((term) => `intitle:${term}`).join(" ")} filetype:bitmap`,
      gsrnamespace: "6",
      gsrlimit: "30",
      prop: "imageinfo",
      iiprop: "url|mime|extmetadata",
      iiurlwidth: "1200",
      format: "json",
    }).toString();
    let response;
    for (let retry = 0; retry < 4; retry += 1) {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
      response = await fetch(query, {
        headers: { "User-Agent": "RecipeShare/1.0 (catalog-photo-source lookup; educational project)" },
      });
      if (response.status !== 429) break;
      const retrySeconds = Number(response.headers.get("Retry-After")) || 15;
      await new Promise((resolve) => setTimeout(resolve, Math.min(retrySeconds, 60) * 1_000));
    }
    if (!response.ok) throw new Error(`Commons search failed for ${recipe.id}: ${response.status}`);
    const data = await response.json();
    const pages = Object.values(data.query?.pages ?? {});

    for (const page of pages) {
      const image = page.imageinfo?.[0];
      const license = plainText(image?.extmetadata?.LicenseShortName?.value);
      if (!image?.thumburl || !["image/jpeg", "image/png", "image/webp"].includes(image.mime) || !allowedLicenses.test(license)) continue;
      if (usedSources.has(image.descriptionurl)) continue;

      usedSources.add(image.descriptionurl);
      return {
        recipeId: recipe.id,
        photoTitle: page.title,
        imageUrl: image.thumburl,
        sourcePage: image.descriptionurl,
        creator: plainText(image.extmetadata?.Artist?.value || image.extmetadata?.Credit?.value || "Unknown Commons contributor"),
        license,
        licenseUrl: image.extmetadata?.LicenseUrl?.value ?? "",
      };
    }
  }
  throw new Error(`No unique reusable photo found for ${recipe.title}.`);
}

const manifestUrl = new URL("../db/catalog-photo-manifest.json", import.meta.url);
let manifest = [];
try {
  manifest = JSON.parse(await readFile(manifestUrl, "utf8"));
} catch {}
const usedSources = new Set(manifest.map((entry) => entry.sourcePage));
const completedIds = new Set(manifest.map((entry) => entry.recipeId));
for (const recipe of catalogRecipes) {
  if (completedIds.has(recipe.id)) continue;
  manifest.push(await findPhoto(recipe, usedSources));
  completedIds.add(recipe.id);
  await writeFile(manifestUrl, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Found ${manifest.length}/${catalogRecipes.length} unique catalog photos.`);
}

console.log(`Wrote ${manifest.length} unique licensed photo sources.`);
