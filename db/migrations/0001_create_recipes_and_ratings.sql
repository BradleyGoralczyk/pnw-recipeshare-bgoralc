CREATE TABLE IF NOT EXISTS recipes (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  title TEXT NOT NULL,
  cuisine TEXT NOT NULL CHECK (cuisine IN (
    'American', 'Arabic', 'Chinese', 'German', 'Indian',
    'Iranian', 'Italian', 'Japanese', 'Mexican', 'Other'
  )),
  category TEXT NOT NULL CHECK (category IN (
    'Breakfast', 'Main Dish', 'Fast Food', 'Soup',
    'Salad', 'Dessert', 'Snack', 'Drink'
  )),
  ingredients JSONB NOT NULL CHECK (jsonb_typeof(ingredients) = 'array'),
  steps JSONB NOT NULL CHECK (jsonb_typeof(steps) = 'array'),
  prep_time_minutes INTEGER NOT NULL CHECK (prep_time_minutes > 0),
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE TABLE IF NOT EXISTS recipe_ratings (
  id TEXT PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  value SMALLINT NOT NULL CHECK (value BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS recipe_ratings_recipe_id_idx
  ON recipe_ratings (recipe_id, created_at);
