# Database setup

RecipeShare stores recipes and ratings in Neon Postgres. Server code reads `DATABASE_URL`, with `POSTGRES_URL` as a fallback. The database client lives in `lib/db.ts` and is marked server-only.

## Local development

Create an ignored local environment file such as `.env.local` and set `DATABASE_URL` to the Neon connection string. Development scripts load `.env.development.local` and `.env.local` through Next.js's env loader. Use the connection string shown in the Neon dashboard; never put a populated environment file in Git. `.env.example` lists the required variable name without a value.

Vercel's Neon integration marks its connection values as secrets, so `vercel env pull` does not make them available locally. Vercel builds receive the configured Preview or Production variables directly.

## Schema and checks

- `npm run db:migrate` applies ordered SQL files in `db/migrations` and records them in `schema_migrations`. Migrations are repeatable and run automatically before a Vercel build.
- `npm run db:seed` inserts two starter recipes: an Iranian salad and an Italian dessert. Their stable IDs and `ON CONFLICT DO NOTHING` make the command safe to run more than once. It loads local development env files and can also use the environment variables provided by Vercel. Run it once against the database used by the deployed app to make the samples visible there.
- `npm run db:test` loads local env files and runs the database integration tests. They create and remove a temporary recipe and rating, verify the seed is repeatable, and skip when no database URL is configured.
- `npm run build` runs migrations, the database integration tests, and the Next.js production build. A local build without a database URL skips database-only steps; a Vercel build fails if its database URL is missing.

Only server modules import the database client. Never print or commit database credentials.
