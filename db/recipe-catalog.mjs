// Keep these values aligned with lib/recipe-model.ts; this file also runs in
// plain Node from the database seed script, without a TypeScript loader.
import { readFileSync } from "node:fs";

const CUISINES = ["American", "Arabic", "Chinese", "German", "Indian", "Iranian", "Italian", "Japanese", "Mexican", "Other"];
const CATEGORIES = ["Breakfast", "Main Dish", "Fast Food", "Soup", "Salad", "Dessert", "Snack", "Drink"];
const DIETARY_TAGS = ["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut-free"];

const catalogPhotos = {
  Breakfast: {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/catalog/breakfast.jpg",
    alt: "Representative photo of blueberry pancakes on a ceramic plate",
  },
  "Main Dish": {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/catalog/main-dish.jpg",
    alt: "Representative photo of curry and rice with fresh garnish",
  },
  "Fast Food": {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/catalog/fast-food.jpg",
    alt: "Representative photo of a burger with lettuce and tomato",
  },
  Soup: {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/catalog/soup.jpg",
    alt: "Representative photo of orange soup garnished with herbs",
  },
  Salad: {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/migrated/recipeshare-sample-persian-herb-salad.jpg",
    alt: "Representative photo of a fresh herb and vegetable salad",
  },
  Dessert: {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/catalog/dessert.jpg",
    alt: "Representative photo of a raspberry and cream tart",
  },
  Snack: {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/catalog/snack.jpg",
    alt: "Representative photo of pan-fried dumplings with dipping sauces",
  },
  Drink: {
    url: "https://b5kiqjzugnm5hspn.public.blob.vercel-storage.com/recipe-images/catalog/drink.jpg",
    alt: "Representative photo of iced tea in a glass",
  },
};
const catalogPhotoManifest = JSON.parse(
  readFileSync("db/catalog-photo-manifest.json", "utf8"),
);
const catalogPhotosByRecipe = new Map(
  catalogPhotoManifest.filter((photo) => photo.blobUrl).map((photo) => [photo.recipeId, photo.blobUrl]),
);

const profiles = {
  American: {
    grain: "brown rice",
    protein: "1 can black beans, drained",
    vegetables: "1 diced sweet potato and 1 cup sweet corn",
    aromatics: "1 diced yellow onion and 2 minced garlic cloves",
    spice: "smoked paprika",
    herb: "chopped parsley",
    acid: "lime juice",
    sauce: "maple-mustard sauce",
    greens: "shredded romaine",
    crunch: "diced apple",
    breakfastBase: "certified gluten-free cornmeal",
    breakfastAdd: "fresh blueberries",
    breakfastStyle: "porridge",
    wrap: "4 small vegan slider rolls",
    fastFilling: "sliced mushrooms and black beans",
    fastSauce: "maple-mustard sauce",
    soupVegetables: "sweet corn and diced potatoes",
    soupProtein: "1 can white beans, drained",
    dessertStyle: "crumble",
    dessertFruit: "sliced peaches",
    snackStyle: "roast",
    snackBase: "1 can chickpeas, drained and dried",
    snackSpice: "Old Bay-style paprika, celery seed, and black pepper",
    snackDip: "maple-mustard dip",
    drinkBase: "black tea",
    drinkFlavor: "peach slices and fresh ginger",
    glutenFree: ["Breakfast", "Main Dish", "Soup", "Salad", "Dessert", "Snack", "Drink"],
    breakfastFinish: "extra blueberries and maple syrup",
  },
  Arabic: {
    grain: "long-grain rice",
    protein: "1 cup brown lentils, rinsed",
    vegetables: "2 diced onions and 1 cup diced tomatoes",
    aromatics: "2 sliced onions and 2 minced garlic cloves",
    spice: "ground cumin and coriander",
    herb: "chopped parsley and mint",
    acid: "lemon juice",
    sauce: "lemon-tahini sauce",
    greens: "chopped parsley and romaine",
    crunch: "toasted pita pieces",
    breakfastBase: "fine semolina",
    breakfastAdd: "chopped dates",
    breakfastStyle: "porridge",
    wrap: "4 whole-wheat pita pockets",
    fastFilling: "baked chickpea falafel",
    fastSauce: "lemon-tahini sauce",
    soupVegetables: "diced carrots and tomatoes",
    soupProtein: "1 cup red lentils, rinsed",
    dessertStyle: "semolina cakes",
    dessertFruit: "chopped dates and orange zest",
    snackStyle: "pita chips",
    snackDip: "lemon-tahini dip",
    snackBase: "4 whole-wheat pita breads, cut into wedges",
    snackSpice: "za’atar and sumac",
    drinkBase: "cold water",
    drinkFlavor: "fresh mint and lemon slices",
    glutenFree: ["Main Dish", "Soup", "Drink"],
    breakfastFinish: "chopped dates",
  },
  Chinese: {
    grain: "jasmine rice",
    protein: "14 oz firm tofu, cubed",
    vegetables: "1 eggplant and 1 red bell pepper, diced",
    aromatics: "1 tbsp grated ginger and 3 sliced scallions",
    spice: "ginger and five-spice powder",
    herb: "sliced scallions",
    acid: "rice vinegar",
    sauce: "gluten-free tamari-sesame sauce",
    greens: "smashed cucumber and baby bok choy",
    crunch: "toasted sesame seeds",
    breakfastBase: "short-grain rice",
    breakfastAdd: "sliced shiitake mushrooms",
    breakfastStyle: "congee",
    wrap: "8 rice-paper wrappers",
    fastFilling: "shredded cabbage, carrot, and tofu",
    fastSauce: "tamari-ginger dipping sauce",
    soupVegetables: "sliced shiitake mushrooms and bamboo shoots",
    soupProtein: "14 oz firm tofu, cubed",
    dessertStyle: "sesame rice balls",
    dessertFruit: "black sesame paste",
    snackStyle: "scallion pancakes",
    snackBase: "2 cups all-purpose flour",
    snackSpice: "sliced scallions and white pepper",
    drinkBase: "dried chrysanthemum tea",
    drinkFlavor: "goji berries and fresh ginger",
    glutenFree: ["Breakfast", "Main Dish", "Fast Food", "Soup", "Salad", "Dessert", "Drink"],
    breakfastFinish: "sliced scallions and a little tamari",
  },
  German: {
    grain: "peeled potatoes",
    protein: "1 can white beans, drained",
    vegetables: "2 cups sliced mushrooms and 1 cup sauerkraut",
    aromatics: "1 diced onion and 2 minced garlic cloves",
    spice: "caraway seed and black pepper",
    herb: "chopped dill",
    acid: "apple cider vinegar",
    sauce: "whole-grain mustard dressing",
    greens: "shredded red cabbage and baby spinach",
    saladProtein: "1 can cannellini beans, drained",
    crunch: "diced tart apple",
    breakfastBase: "rye flakes",
    breakfastAdd: "diced apple",
    breakfastStyle: "porridge",
    wrap: "4 small whole-grain rolls",
    fastFilling: "plant-based sausages and warm sauerkraut",
    fastSauce: "mild curry ketchup",
    soupVegetables: "diced potatoes, carrots, and leek",
    soupProtein: "1 cup brown lentils, rinsed",
    dessertStyle: "crumble",
    dessertFruit: "sliced plums",
    snackStyle: "pretzel bites",
    snackBase: "2 cups all-purpose flour",
    snackSpice: "coarse salt and caraway seed",
    drinkBase: "chilled sparkling water",
    drinkFlavor: "unsweetened apple juice",
    glutenFree: ["Main Dish", "Soup", "Salad", "Dessert", "Drink"],
    breakfastFinish: "diced apple and cinnamon",
  },
  Indian: {
    grain: "basmati rice",
    protein: "1 can chickpeas, drained",
    vegetables: "2 cups cauliflower florets and 1 diced tomato",
    aromatics: "1 diced onion, 2 minced garlic cloves, and grated ginger",
    spice: "ground cumin, turmeric, and garam masala",
    herb: "chopped cilantro",
    acid: "lemon juice",
    sauce: "tomato-coconut masala sauce",
    greens: "diced cucumber, tomato, and red onion",
    crunch: "roasted cumin seeds",
    breakfastBase: "chickpea flour",
    breakfastAdd: "grated zucchini and diced onion",
    breakfastStyle: "savory griddle cakes",
    wrap: "4 whole-wheat rotis",
    fastFilling: "spiced chickpeas and shredded cabbage",
    fastSauce: "cilantro-mint chutney",
    soupVegetables: "diced tomato and carrots",
    soupProtein: "1 cup red lentils, rinsed",
    dessertStyle: "rice pudding",
    dessertFruit: "raisins and crushed cardamom",
    snackStyle: "potato patties",
    snackBase: "3 boiled potatoes, mashed",
    snackSpice: "cumin, coriander, and turmeric",
    drinkBase: "mango pulp and unsweetened soy yogurt",
    drinkFlavor: "ground cardamom and cold water",
    glutenFree: ["Breakfast", "Main Dish", "Soup", "Salad", "Dessert", "Snack"],
    drinkBase: "mango pulp and unsweetened soy yogurt",
    breakfastFinish: "chopped cilantro and lemon",
  },
  Iranian: {
    grain: "basmati rice",
    protein: "1 cup brown lentils, cooked",
    vegetables: "1 diced eggplant and 1 diced onion",
    aromatics: "1 diced onion and 2 minced garlic cloves",
    spice: "saffron, turmeric, and ground cumin",
    herb: "chopped parsley, mint, and dill",
    acid: "fresh lime juice",
    sauce: "saffron-lime dressing",
    greens: "cucumber, tomato, and fresh parsley",
    crunch: "dried barberries and toasted pumpkin seeds",
    breakfastBase: "short-grain rice",
    breakfastAdd: "chopped dates and orange zest",
    breakfastStyle: "saffron porridge",
    wrap: "4 lavash flatbreads",
    fastFilling: "herbed chickpea falafel and chopped cucumber",
    fastSauce: "saffron-lime sauce",
    soupVegetables: "leek, spinach, chopped herbs, and broken linguine",
    soupProtein: "1 cup chickpeas and 1 cup kidney beans",
    dessertStyle: "saffron rice pudding",
    dessertFruit: "rosewater and chopped pistachios",
    snackStyle: "lavash chips",
    snackBase: "4 lavash flatbreads, cut into triangles",
    snackSpice: "sumac and dried mint",
    snackDip: "saffron-lime dip",
    drinkBase: "cold water",
    drinkFlavor: "saffron, rosewater, and lime",
    glutenFree: ["Breakfast", "Main Dish", "Salad", "Dessert", "Drink"],
    breakfastFinish: "chopped dates and orange zest",
  },
  Italian: {
    grain: "creamy polenta",
    protein: "1 cup brown lentils, cooked",
    vegetables: "2 cups cherry tomatoes and sliced zucchini",
    aromatics: "1 diced onion and 2 minced garlic cloves",
    spice: "dried oregano and cracked black pepper",
    herb: "fresh basil leaves",
    acid: "lemon juice",
    sauce: "tomato-basil sauce",
    greens: "baby arugula and diced tomatoes",
    crunch: "toasted sunflower seeds",
    breakfastBase: "coarse cornmeal",
    breakfastAdd: "sliced pear and lemon zest",
    breakfastStyle: "polenta porridge",
    wrap: "4 small vegan panini rolls",
    fastFilling: "grilled zucchini, tomato, and soy-based mozzarella",
    fastSauce: "basil and olive oil",
    soupVegetables: "kale, carrots, and diced tomatoes",
    soupProtein: "1 can cannellini beans, drained",
    dessertStyle: "fruit crumble",
    dessertFruit: "sliced pears and berries",
    snackStyle: "focaccia bites",
    snackBase: "2 cups all-purpose flour",
    snackSpice: "rosemary and flaky salt",
    snackDip: "tomato-basil oil",
    drinkBase: "chilled sparkling water",
    drinkFlavor: "blood orange juice and lemon",
    glutenFree: ["Breakfast", "Main Dish", "Soup", "Salad", "Drink"],
    breakfastFinish: "sliced pear and lemon zest",
  },
  Japanese: {
    grain: "short-grain rice",
    protein: "14 oz firm tofu, cubed",
    vegetables: "1 cup shiitake mushrooms and 1 cup snap peas",
    aromatics: "1 tbsp grated ginger and 3 sliced scallions",
    spice: "rice miso and toasted sesame",
    herb: "sliced scallions",
    acid: "rice vinegar",
    sauce: "ginger-tamari glaze",
    greens: "blanched spinach and thin cucumber slices",
    crunch: "toasted sesame seeds",
    breakfastBase: "short-grain rice",
    breakfastAdd: "sliced shiitake mushrooms",
    breakfastStyle: "miso congee",
    wrap: "4 nori sheets and warm rice",
    fastFilling: "seasoned rice and pickled plum",
    fastSauce: "tamari-ginger dipping sauce",
    soupVegetables: "sliced mushrooms and wakame seaweed",
    soupProtein: "14 oz soft tofu, cubed",
    dessertStyle: "matcha mochi",
    dessertFruit: "sweet red bean paste",
    snackStyle: "edamame",
    snackBase: "1 lb frozen edamame in pods",
    snackSpice: "shichimi pepper and flaky salt",
    drinkBase: "roasted barley tea",
    drinkFlavor: "toasted barley and cold water",
    glutenFree: ["Breakfast", "Main Dish", "Fast Food", "Soup", "Salad", "Dessert", "Snack"],
  },
  Mexican: {
    grain: "long-grain rice",
    protein: "1 can black beans, drained",
    vegetables: "1 cup sweet corn, 1 diced zucchini, and 1 poblano pepper",
    aromatics: "1 diced onion and 2 minced garlic cloves",
    spice: "ancho chili powder and ground cumin",
    herb: "chopped cilantro",
    acid: "lime juice",
    sauce: "salsa verde",
    greens: "shredded cabbage and diced tomato",
    crunch: "jicama matchsticks",
    breakfastBase: "corn tortillas",
    breakfastAdd: "salsa verde and black beans",
    breakfastStyle: "chilaquiles skillet",
    wrap: "8 small corn tortillas",
    fastFilling: "smoky mushrooms and black beans",
    fastSauce: "tomatillo salsa",
    soupVegetables: "diced tomato and sweet corn",
    soupProtein: "1 can black beans, drained",
    dessertStyle: "coconut rice pudding",
    dessertFruit: "raisins and cinnamon",
    snackStyle: "corn ribs",
    snackBase: "4 ears of corn, quartered lengthwise",
    snackSpice: "ancho chili powder and ground cumin",
    drinkBase: "dried hibiscus flowers",
    drinkFlavor: "lime juice and cold water",
    glutenFree: ["Breakfast", "Main Dish", "Fast Food", "Soup", "Salad", "Dessert", "Snack", "Drink"],
  },
  Other: {
    grain: "quinoa",
    protein: "1 can chickpeas, drained",
    vegetables: "1 diced zucchini, 1 red pepper, and 1 cup spinach",
    aromatics: "1 diced onion and 2 minced garlic cloves",
    spice: "smoked paprika and ground coriander",
    herb: "chopped mint and parsley",
    acid: "lemon juice",
    sauce: "ginger-tamarind sauce",
    greens: "roasted beets, baby spinach, and cooked quinoa",
    crunch: "orange segments and pumpkin seeds",
    breakfastBase: "quinoa flakes",
    breakfastAdd: "orange segments and chopped dates",
    breakfastStyle: "quinoa porridge",
    wrap: "large crisp lettuce leaves",
    fastFilling: "spiced chickpeas and roasted vegetables",
    fastSauce: "ginger-tamarind sauce",
    soupVegetables: "zucchini, red pepper, and spinach",
    soupProtein: "1 can chickpeas, drained",
    dessertStyle: "citrus polenta pudding",
    dessertFruit: "orange zest and sliced dates",
    snackStyle: "roasted cauliflower",
    snackBase: "1 large cauliflower, cut into florets",
    snackSpice: "smoked paprika and coriander",
    drinkBase: "dried hibiscus flowers",
    drinkFlavor: "ginger, orange, and cold water",
    glutenFree: ["Breakfast", "Main Dish", "Fast Food", "Soup", "Salad", "Dessert", "Snack", "Drink"],
  },
};

const titles = {
  American: {
    Breakfast: "Blueberry Cornmeal Morning Porridge",
    "Main Dish": "Smoky Black Bean and Sweet Potato Rice Bowl",
    "Fast Food": "Maple-Mustard Mushroom Sliders",
    Soup: "Sweet Corn and Potato Chowder",
    Salad: "Apple Crunch Slaw",
    Dessert: "Peach Oat Skillet Crumble",
    Snack: "Old Bay-Style Roasted Chickpeas",
    Drink: "Ginger-Peach Iced Tea",
  },
  Arabic: {
    Breakfast: "Date and Cardamom Semolina Porridge",
    "Main Dish": "Mujaddara with Crispy Onions",
    "Fast Food": "Falafel Pita Pockets with Tahini",
    Soup: "Red Lentil and Cumin Soup",
    Salad: "Parsley-Mint Bulgur Tabouli",
    Dessert: "Date-Orange Semolina Cakes",
    Snack: "Za’atar Pita Crisps",
    Drink: "Fresh Mint Lemonade",
  },
  Chinese: {
    Breakfast: "Ginger-Scallion Mushroom Congee",
    "Main Dish": "Ginger-Sesame Tofu and Eggplant Rice Bowl",
    "Fast Food": "Crispy Vegetable Rice-Paper Rolls",
    Soup: "Ginger Mushroom and Tofu Soup",
    Salad: "Smashed Cucumber and Sesame Salad",
    Dessert: "Black Sesame Sweet Rice Balls",
    Snack: "Scallion Pancake Wedges",
    Drink: "Chrysanthemum-Goji Iced Tea",
  },
  German: {
    Breakfast: "Apple-Cinnamon Rye Breakfast Porridge",
    "Main Dish": "Mushroom and Sauerkraut Potato Skillet",
    "Fast Food": "Plant-Based Currywurst Rolls",
    Soup: "Lentil, Leek, and Potato Soup",
    Salad: "Warm Potato Salad with Dill Mustard",
    Dessert: "Plum and Cinnamon Oat Crumble",
    Snack: "Caraway Soft Pretzel Bites",
    Drink: "Sparkling Apple Schorle",
  },
  Indian: {
    Breakfast: "Masala Besan and Zucchini Chilla",
    "Main Dish": "Chana Masala over Basmati Rice",
    "Fast Food": "Chickpea Kathi Rolls with Mint Chutney",
    Soup: "Tomato and Red Lentil Shorba",
    Salad: "Cucumber-Tomato Kachumber",
    Dessert: "Coconut-Cardamom Rice Kheer",
    Snack: "Golden Aloo Tikki",
    Drink: "Mango-Coconut Lassi",
  },
  Iranian: {
    Breakfast: "Saffron-Date Rice Porridge",
    "Main Dish": "Saffron Eggplant and Lentil Rice",
    "Fast Food": "Herbed Falafel Lavash Wraps",
    Soup: "Ash Reshteh with Beans and Herbs",
    Dessert: "Sholeh Zard Saffron Rice Pudding",
    Snack: "Sumac Lavash Chips",
    Drink: "Saffron-Rosewater Sharbat",
  },
  Italian: {
    Breakfast: "Lemon-Polenta Breakfast Bowl",
    "Main Dish": "Tuscan Lentil Ragù over Creamy Polenta",
    "Fast Food": "Caprese Panini with Plant Mozzarella",
    Soup: "Ribollita-Inspired White Bean Soup",
    Salad: "Tuscan White Bean and Tomato Salad",
    Snack: "Rosemary Focaccia Bites",
    Drink: "Blood Orange Sparkling Soda",
  },
  Japanese: {
    Breakfast: "Miso-Mushroom Breakfast Congee",
    "Main Dish": "Teriyaki Tofu Donburi",
    "Fast Food": "Pickled-Plum Onigiri",
    Soup: "Miso Soup with Tofu and Wakame",
    Salad: "Spinach Goma-ae with Sesame Dressing",
    Dessert: "Matcha Mochi Bites with Sweet Red Bean",
    Snack: "Shichimi-Lime Edamame",
    Drink: "Chilled Mugicha Barley Tea",
  },
  Mexican: {
    Breakfast: "Chilaquiles Verdes with Black Beans",
    "Main Dish": "Smoky Calabacitas and Black Bean Rice",
    "Fast Food": "Smoky Mushroom and Black Bean Tacos",
    Soup: "Tomato-Black Bean Sopa",
    Salad: "Jicama-Citrus Cabbage Slaw",
    Dessert: "Coconut-Cinnamon Arroz con Leche",
    Snack: "Ancho-Lime Elote Corn Ribs",
    Drink: "Agua de Jamaica with Lime",
  },
  Other: {
    Breakfast: "Cinnamon-Quinoa Breakfast Bowl",
    "Main Dish": "Ginger-Tamarind Chickpea Quinoa Bowl",
    "Fast Food": "Spiced Chickpea Lettuce Wraps",
    Soup: "Smoky Chickpea and Zucchini Soup",
    Salad: "Roasted Beet, Quinoa, and Citrus Salad",
    Dessert: "Orange-Date Polenta Pudding",
    Snack: "Smoky Roasted Cauliflower Bites",
    Drink: "Hibiscus-Ginger Citrus Cooler",
  },
};

function ingredientsFor(cuisine, category, profile) {
  switch (category) {
    case "Breakfast":
      if (profile.breakfastStyle === "savory griddle cakes") {
        return [
          "1 cup chickpea flour",
          "3/4 cup water",
          `1 cup ${profile.breakfastAdd}`,
          "1 tsp ground cumin and turmeric",
          "1 tbsp neutral oil",
          `2 tbsp ${profile.herb}`,
        ];
      }
      if (profile.breakfastStyle === "congee" || profile.breakfastStyle === "miso congee") {
        return [
          "1/2 cup short-grain rice",
          "5 cups vegetable broth or water",
          "1 cup sliced mushrooms",
          "1 tbsp grated ginger",
          "1 tbsp gluten-free tamari",
          "2 tbsp sliced scallions",
        ];
      }
      if (profile.breakfastStyle === "chilaquiles skillet") {
        return [
          "6 corn tortillas, cut into wedges",
          "1 cup salsa verde",
          "1/2 cup vegetable broth",
          "1 can black beans, drained",
          "1 diced avocado",
          "2 tbsp chopped cilantro",
        ];
      }
      return [
        `1 cup ${profile.breakfastBase}`,
        "3 cups water or unsweetened plant milk",
        `1 cup ${profile.breakfastAdd}`,
        `1/2 tsp ${profile.spice}`,
        "1 tbsp maple syrup or date syrup",
        `2 tbsp ${profile.herb}`,
      ];
    case "Main Dish":
      if (cuisine === "German") {
        return [
          "1 lb waxy potatoes, cut into bite-size cubes",
          "2 cups sliced mushrooms",
          "1 cup drained sauerkraut",
          "1 diced yellow onion",
          "1 tbsp neutral oil",
          "1 tsp caraway seed and black pepper",
          "2 tbsp chopped dill",
        ];
      }
      return [
        `1 cup ${profile.grain}`,
        profile.protein,
        profile.vegetables,
        profile.aromatics,
        `1 tsp ${profile.spice}`,
        `2 tbsp ${profile.sauce}`,
        `1 tbsp ${profile.acid} and ${profile.herb}`,
      ];
    case "Fast Food":
      return [
        profile.wrap,
        `1 1/2 cups ${profile.fastFilling}`,
        "1 cup shredded cabbage and sliced tomato",
        `2 tbsp ${profile.fastSauce}`,
        `1 tbsp ${profile.acid}`,
        `2 tbsp ${profile.herb}`,
      ];
    case "Soup":
      return [
        "1 tbsp olive or neutral oil",
        profile.aromatics,
        profile.soupVegetables,
        profile.soupProtein,
        "4 cups low-sodium vegetable broth",
        `1 tsp ${profile.spice}`,
        `1 tbsp ${profile.acid} and ${profile.herb}`,
      ];
    case "Salad":
      if (cuisine === "German") {
        return [
          "1 lb waxy potatoes, boiled and sliced while warm",
          "1/2 cup thinly sliced red onion",
          "1/2 cup vegetable broth",
          "2 tbsp whole-grain mustard",
          "2 tbsp apple cider vinegar",
          "2 tbsp chopped fresh dill",
          "1 tbsp olive oil and black pepper",
        ];
      }
      return [
        `4 cups ${profile.greens}`,
        "1 diced cucumber and 1 cup diced tomato",
        profile.saladProtein ?? profile.protein,
        profile.crunch,
        `2 tbsp olive oil and 1 tbsp ${profile.acid}`,
        `1/2 tsp ${profile.spice}`,
        `2 tbsp ${profile.herb}`,
      ];
    case "Dessert":
      if (profile.dessertStyle === "rice pudding" || profile.dessertStyle === "saffron rice pudding" || profile.dessertStyle === "coconut rice pudding") {
        return [
          "1/2 cup short-grain rice, rinsed",
          "3 cups unsweetened coconut milk",
          "2 cups water",
          "1/3 cup sugar",
          `1/2 tsp ${profile.spice}`,
          `1/2 cup ${profile.dessertFruit}`,
        ];
      }
      if (profile.dessertStyle === "sesame rice balls") {
        return [
          "1 cup glutinous rice flour",
          "1/2 cup warm water",
          "1/3 cup black sesame paste",
          "2 tbsp sugar",
          "4 cups water for simmering",
        ];
      }
      if (profile.dessertStyle === "matcha mochi") {
        return [
          "1 cup glutinous rice flour",
          "2 tbsp sugar",
          "1 tsp matcha powder",
          "3/4 cup water",
          "1/2 cup sweet red bean paste",
          "1/4 cup potato starch for dusting",
        ];
      }
      if (profile.dessertStyle === "semolina cakes") {
        return [
          "1 cup fine semolina",
          "1/2 cup chopped dates and 1 tbsp orange zest",
          "1/3 cup sugar",
          "1/2 cup unsweetened plant yogurt",
          "1/4 cup olive oil",
          "1 tsp baking powder",
        ];
      }
      if (profile.dessertStyle === "citrus polenta pudding") {
        return [
          "1/2 cup fine polenta",
          "2 cups unsweetened coconut milk",
          "1 cup water",
          "1/3 cup maple syrup",
          `1 tbsp ${profile.dessertFruit}`,
          "1 tsp vanilla extract",
        ];
      }
      return [
        `3 cups ${profile.dessertFruit}`,
        "1 cup rolled oats",
        "1/3 cup certified gluten-free oat flour",
        "1/3 cup maple syrup or brown sugar",
        `1 tsp ${profile.spice}`,
        "3 tbsp neutral oil",
      ];
    case "Snack":
      if (profile.snackStyle === "scallion pancakes") {
        return [
          "2 cups all-purpose flour",
          "3/4 cup warm water",
          "1 cup sliced scallions",
          "2 tbsp sesame oil",
          "1/2 tsp white pepper and salt",
          "2 tbsp tamari for dipping",
        ];
      }
      if (profile.snackStyle === "pretzel bites") {
        return [
          "2 cups all-purpose flour",
          "3/4 cup warm water",
          "1 tsp instant yeast",
          "1 tsp sugar",
          "1 tbsp coarse salt",
          "1/2 tsp caraway seed",
        ];
      }
      if (profile.snackStyle === "potato patties") {
        return [
          "3 boiled potatoes, mashed",
          "1/3 cup chickpea flour",
          `1 tsp ${profile.snackSpice}`,
          "1/2 diced onion",
          "2 tbsp neutral oil",
          "1/2 cup cilantro-mint chutney for dipping",
        ];
      }
      if (profile.snackStyle === "edamame") {
        return [
          "1 lb frozen edamame in pods",
          "1 tsp flaky salt",
          "1/2 tsp shichimi pepper",
          "1 lime, cut into wedges",
        ];
      }
      if (profile.snackStyle === "corn ribs") {
        return [
          "4 ears of corn, quartered lengthwise",
          "1 tbsp olive oil",
          `1 tsp ${profile.snackSpice}`,
          "1 lime, cut into wedges",
          "2 tbsp chopped cilantro",
        ];
      }
      if (profile.snackStyle === "lavash chips" || profile.snackStyle === "pita chips" || profile.snackStyle === "focaccia bites") {
        return [
          profile.snackBase,
          "2 tbsp olive oil",
          `1 tsp ${profile.snackSpice}`,
          `1/2 cup ${profile.snackDip}`,
        ];
      }
      if (profile.snackStyle === "roasted cauliflower") {
        return [
          profile.snackBase,
          "2 tbsp olive oil",
          `1 tsp ${profile.snackSpice}`,
          "1/2 tsp salt",
          "1/2 cup lemon-tahini dip",
        ];
      }
      return [
        profile.snackBase,
        "1 tbsp olive oil",
        `1 tsp ${profile.snackSpice}`,
        "1/2 tsp salt",
        `1/2 cup ${profile.snackDip}`,
      ];
    case "Drink":
      if (profile.drinkBase === "cold water") {
        return [
          "4 cups cold water",
          `1/2 cup ${profile.drinkFlavor}`,
          "2 tbsp sugar or maple syrup, to taste",
          "1 cup ice",
        ];
      }
      if (profile.drinkBase === "chilled sparkling water") {
        return [
          "3 cups chilled sparkling water",
          `1 cup ${profile.drinkFlavor}`,
          "1 tbsp lemon juice",
          "1 cup ice",
        ];
      }
      if (profile.drinkBase === "mango pulp and unsweetened soy yogurt") {
        return [
          "1 cup mango pulp",
          "1 cup unsweetened soy yogurt",
          `1/2 tsp ${profile.drinkFlavor}`,
          "1 cup cold water",
          "1 cup ice",
        ];
      }
      return [
        `2 tea bags or 2 tbsp ${profile.drinkBase}`,
        "4 cups water",
        `1 cup ${profile.drinkFlavor}`,
        "2 tbsp maple syrup, to taste",
        "1 cup ice, if serving cold",
      ];
    default:
      throw new Error(`No catalog recipe template for ${cuisine} ${category}.`);
  }
}

function stepsFor(cuisine, category, profile) {
  switch (category) {
    case "Breakfast":
      if (profile.breakfastStyle === "savory griddle cakes") {
        return [
          `Whisk the chickpea flour with water, then fold in ${profile.breakfastAdd} and the spices. Rest the batter for 5 minutes.`,
          "Warm a lightly oiled skillet. Cook small ladles of batter for 2 to 3 minutes per side until golden and cooked through.",
          `Serve warm with ${profile.herb} and a squeeze of lemon.`,
        ];
      }
      if (profile.breakfastStyle === "congee" || profile.breakfastStyle === "miso congee") {
        return [
          "Combine the rice and broth in a saucepan. Bring to a boil, then simmer gently for 35 to 40 minutes, stirring often, until creamy.",
          "Stir in the mushrooms and ginger during the last 10 minutes. Remove from the heat and dissolve in the miso or tamari.",
          "Ladle into bowls and finish with sliced scallions.",
        ];
      }
      if (profile.breakfastStyle === "chilaquiles skillet") {
        return [
          "Toast the tortilla wedges in a dry skillet until crisp at the edges.",
          "Pour in the salsa verde and broth. Fold in the beans and simmer until the tortillas soften slightly and the sauce thickens.",
          "Top with avocado and cilantro and serve immediately.",
        ];
      }
      return [
        `Combine ${profile.breakfastBase}, the liquid, and ${profile.spice} in a saucepan. Simmer gently, stirring often, until tender and creamy.`,
        `Stir in ${profile.breakfastAdd} for the last few minutes of cooking.`,
        `Sweeten to taste and finish with ${profile.breakfastFinish ?? profile.herb}. Serve warm.`,
      ];
    case "Main Dish":
      if (cuisine === "German") {
        return [
          "Boil the potato cubes in salted water until just tender, then drain well.",
          "Brown the mushrooms and onion in oil with caraway and pepper. Fold in the potatoes and warm until the edges begin to crisp.",
          "Stir in the sauerkraut, heat through, and finish with chopped dill.",
        ];
      }
      return [
        `Cook ${profile.grain} according to its package directions.`,
        `Sauté ${profile.aromatics} in a large skillet. Add ${profile.vegetables}, ${profile.protein}, and ${profile.spice}; cook until the vegetables are tender.`,
        `Stir in ${profile.sauce} and a splash of water. Spoon over the grain and finish with ${profile.acid} and ${profile.herb}.`,
      ];
    case "Fast Food":
      return [
        `Warm ${profile.wrap} in a dry skillet or according to package directions.`,
        `Cook ${profile.fastFilling} in a lightly oiled pan until hot and browned at the edges.`,
        `Fill the warm wraps with the cabbage, tomato, and filling. Drizzle with ${profile.fastSauce}, then add ${profile.acid} and ${profile.herb}.`,
      ];
    case "Soup":
      return [
        `Warm the oil in a soup pot. Cook ${profile.aromatics} with ${profile.spice} for 3 minutes.`,
        `Add ${profile.soupVegetables}, ${profile.soupProtein}, and the vegetable broth. Simmer until the vegetables and legumes are tender.`,
        `Season to taste and finish each bowl with ${profile.acid} and ${profile.herb}.`,
      ];
    case "Salad":
      if (cuisine === "German") {
        return [
          "Whisk the warm vegetable broth with mustard, vinegar, olive oil, and black pepper.",
          "Pour the dressing over the warm sliced potatoes and red onion. Fold gently so the potatoes absorb it.",
          "Rest for 10 minutes, then finish with chopped dill and serve warm.",
        ];
      }
      return [
        `Whisk the olive oil, ${profile.acid}, and ${profile.spice} together in a large bowl.`,
        `Add ${profile.greens}, cucumber, tomato, ${profile.protein}, and ${profile.crunch}.`,
        `Toss gently, fold in ${profile.herb}, and serve while the vegetables are crisp.`,
      ];
    case "Dessert":
      if (profile.dessertStyle === "rice pudding" || profile.dessertStyle === "saffron rice pudding" || profile.dessertStyle === "coconut rice pudding") {
        return [
          "Combine the rice, coconut milk, and water in a heavy saucepan. Bring to a gentle simmer, stirring so the rice does not stick.",
          `Cook slowly until the rice is very tender and the pudding is thick. Stir in the sugar, ${profile.spice}, and ${profile.dessertFruit}.`,
          "Serve warm or chill for at least 2 hours. Add a splash of water if it thickens too much while cooling.",
        ];
      }
      if (profile.dessertStyle === "sesame rice balls") {
        return [
          "Stir the glutinous rice flour and warm water together to make a soft dough. Divide into 12 pieces.",
          "Flatten each piece, add a little sesame paste and sugar, then seal and roll into a smooth ball.",
          "Simmer the balls in water until they float, then cook 2 minutes more. Serve warm in a little cooking liquid.",
        ];
      }
      if (profile.dessertStyle === "matcha mochi") {
        return [
          "Whisk the rice flour, sugar, matcha, and water into a smooth batter. Cover and microwave in short bursts, stirring between each, until thick and stretchy.",
          "Dust a work surface with potato starch. Divide the warm dough into 8 pieces and flatten each one.",
          "Add a small spoonful of red bean paste to each piece, pinch closed, and roll gently into a ball.",
        ];
      }
      if (profile.dessertStyle === "semolina cakes") {
        return [
          "Heat the oven to 350°F (175°C). Mix the semolina, dates, orange zest, sugar, plant yogurt, oil, and baking powder.",
          "Press the mixture into a lined 8-inch baking dish and score into small squares.",
          "Bake for 25 to 30 minutes until golden. Cool before cutting so the cakes hold their shape.",
        ];
      }
      if (profile.dessertStyle === "citrus polenta pudding") {
        return [
          "Whisk the polenta into the coconut milk and water in a saucepan. Bring to a gentle simmer while stirring.",
          "Cook over low heat until smooth and thick, stirring frequently. Add the maple syrup, citrus, and vanilla.",
          "Spoon into small cups and serve warm, or chill until set.",
        ];
      }
      return [
        "Heat the oven to 375°F (190°C). Spread the fruit in a small baking dish and drizzle with a little maple syrup.",
        `Rub the oats, flour, remaining sweetener, ${profile.spice}, and oil together until crumbly. Sprinkle over the fruit.`,
        "Bake for 25 to 30 minutes until the fruit bubbles and the topping is golden. Cool for 10 minutes before serving.",
      ];
    case "Snack":
      if (profile.snackStyle === "scallion pancakes") {
        return [
          "Mix the flour and water into a soft dough. Knead briefly, cover, and rest for 15 minutes.",
          "Roll the dough thin, brush with sesame oil, scatter with scallions, roll up, coil, and flatten again.",
          "Pan-fry each pancake until crisp and golden on both sides. Cut into wedges and serve with tamari.",
        ];
      }
      if (profile.snackStyle === "pretzel bites") {
        return [
          "Mix the flour, warm water, yeast, and sugar into a dough. Knead until smooth and let rise until doubled.",
          "Roll into ropes and cut into bite-size pieces. Boil briefly in water with a pinch of baking soda, then drain.",
          "Sprinkle with coarse salt and caraway. Bake at 425°F (220°C) for 12 to 15 minutes until deep golden.",
        ];
      }
      if (profile.snackStyle === "potato patties") {
        return [
          `Mix the mashed potatoes with chickpea flour, ${profile.snackSpice}, and onion. Shape into 8 small patties.`,
          "Pan-fry in a thin layer of oil over medium heat until crisp and golden, about 4 minutes per side.",
          "Drain briefly on a rack and serve hot with cilantro-mint chutney.",
        ];
      }
      if (profile.snackStyle === "edamame") {
        return [
          "Boil the edamame in salted water for 4 to 5 minutes, until hot and tender.",
          "Drain well and while still warm toss with flaky salt and shichimi pepper.",
          "Serve with lime wedges for squeezing over the pods.",
        ];
      }
      if (profile.snackStyle === "corn ribs") {
        return [
          "Heat the oven to 425°F (220°C). Toss the corn pieces with oil and ancho-cumin seasoning.",
          "Arrange cut-side down on a baking sheet and roast for 20 to 25 minutes, turning once, until curled and browned.",
          "Serve with lime wedges and chopped cilantro.",
        ];
      }
      if (profile.snackStyle === "lavash chips" || profile.snackStyle === "pita chips" || profile.snackStyle === "focaccia bites") {
        return [
          `Heat the oven to 400°F (200°C). Cut ${profile.snackBase} into bite-size pieces.`,
          `Toss with olive oil and ${profile.snackSpice}. Bake until crisp and golden, turning once.`,
          `Cool for 5 minutes and serve with ${profile.snackDip}.`,
        ];
      }
      if (profile.snackStyle === "roasted cauliflower") {
        return [
          "Heat the oven to 425°F (220°C). Toss the cauliflower with olive oil, seasoning, and salt.",
          "Roast for 20 to 25 minutes, turning once, until browned at the edges and tender inside.",
          "Serve hot with lemon-tahini dip.",
        ];
      }
      return [
        `Heat the oven to 425°F (220°C). Toss ${profile.snackBase} with olive oil, ${profile.snackSpice}, and salt.`,
        "Spread in one layer on a baking sheet. Roast until crisp and golden, shaking the pan halfway through.",
        `Cool slightly and serve with ${profile.snackDip}.`,
      ];
    case "Drink":
      if (profile.drinkBase === "cold water") {
        return [
          `Stir ${profile.drinkFlavor} and sugar into the cold water.`,
          "Let stand for 10 minutes so the flavors infuse, then taste and adjust sweetness or citrus.",
          "Strain if desired, pour over ice, and serve cold.",
        ];
      }
      if (profile.drinkBase === "chilled sparkling water") {
        return [
          `Stir ${profile.drinkFlavor} and lemon juice together in a pitcher.`,
          "Add the chilled sparkling water just before serving to keep the drink fizzy.",
          "Pour over ice and serve immediately.",
        ];
      }
      if (profile.drinkBase === "mango pulp and unsweetened soy yogurt") {
        return [
          "Blend the mango pulp, coconut yogurt, cardamom, and cold water until smooth.",
          "Add ice and blend briefly to chill without watering the lassi down.",
          "Taste and serve cold in small glasses.",
        ];
      }
      return [
        `Bring the water just to a boil and steep the tea or ${profile.drinkBase} for 5 minutes.`,
        `Add ${profile.drinkFlavor} and maple syrup. Cool to room temperature, then refrigerate until cold.`,
        "Strain if needed and serve over ice. For a hot drink, skip the chilling step.",
      ];
    default:
      throw new Error(`No catalog recipe steps for ${category}.`);
  }
}

const prepTimes = {
  Breakfast: 20,
  "Main Dish": 35,
  "Fast Food": 20,
  Soup: 35,
  Salad: 15,
  Dessert: 35,
  Snack: 25,
  Drink: 10,
};

export const catalogRecipes = CUISINES.flatMap((cuisine) =>
  CATEGORIES.flatMap((category) => {
    const title = titles[cuisine][category];
    if (!title) return [];

    const profile = profiles[cuisine];
    const photo = catalogPhotos[category];
    const ingredients = ingredientsFor(cuisine, category, profile);
    const dietaryTags = ["Vegetarian", "Vegan", "Dairy-free"];
    const hasTreeNuts = ingredients.some((ingredient) => /pistachio|coconut/i.test(ingredient));
    if (!hasTreeNuts) dietaryTags.push("Nut-free");
    if (profile.glutenFree.includes(category)) dietaryTags.push("Gluten-free");

    return [{
      id: `catalog-${cuisine.toLowerCase()}-${category.toLowerCase().replaceAll(" ", "-")}`,
      authorName: "RecipeShare Community Kitchen",
      title,
      cuisine,
      category,
      ingredients,
      steps: stepsFor(cuisine, category, profile),
      prepTimeMinutes: prepTimes[category],
      imageUrl: catalogPhotosByRecipe.get(`catalog-${cuisine.toLowerCase()}-${category.toLowerCase().replaceAll(" ", "-")}`) ?? photo.url,
      imageAlt: catalogPhotosByRecipe.has(`catalog-${cuisine.toLowerCase()}-${category.toLowerCase().replaceAll(" ", "-")}`)
        ? `Representative photo for ${title}`
        : photo.alt,
      dietaryTags: dietaryTags.filter((tag) => DIETARY_TAGS.includes(tag)),
      videoUrl: null,
    }];
  }),
);
