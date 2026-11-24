ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS video_url TEXT;

-- statement-breakpoint

ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS dietary_tags JSONB NOT NULL DEFAULT '[]'::jsonb
  CHECK (jsonb_typeof(dietary_tags) = 'array');
