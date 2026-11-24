CREATE TABLE IF NOT EXISTS recipe_comments (
  id TEXT PRIMARY KEY,
  recipe_id TEXT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL CHECK (length(trim(author_name)) BETWEEN 1 AND 80),
  body TEXT NOT NULL CHECK (length(trim(body)) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- statement-breakpoint

CREATE INDEX IF NOT EXISTS recipe_comments_recipe_id_idx
  ON recipe_comments (recipe_id, created_at, id);
