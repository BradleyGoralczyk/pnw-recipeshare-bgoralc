# RecipeShare

RecipeShare is a recipe-sharing website for discovering food from cuisines around the world. Visitors can browse and filter recipes, open cooking instructions, share a recipe, and leave a 1-to-5 star rating.

**Live app:** [https://pnw-recipeshare-bgoralc.vercel.app](https://pnw-recipeshare-bgoralc.vercel.app)  
The current Vercel deployment may require access to the project team.

## Stack

- Next.js App Router and React
- TypeScript
- Neon Postgres
- Vitest and Testing Library
- Vercel deployments from `master`

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```sh
npm ci
```

Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your Neon Postgres connection string and `BLOB_READ_WRITE_TOKEN` for Vercel Blob photo uploads. Keep the populated file private; it is ignored by Git. `POSTGRES_URL` is also accepted as a fallback by the server.

```sh
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The seed command adds 80 recipes covering every cuisine and category combination and is safe to repeat. Thirty-seven recipes now use individually selected, licensed photos; credits appear with the images and are recorded in [docs/catalog-photo-credits.md](docs/catalog-photo-credits.md). The other catalog recipes use the existing category photos, credited in [docs/seed-photo-credits.md](docs/seed-photo-credits.md).
For this repository's existing sample data, `npm run db:migrate:images` copies the two sample photos to the connected public Blob store and updates their Neon URLs. It is safe to rerun. Existing images are grandfathered regardless of size; the 5 MB limit applies only to new uploads.

## Tests and build

```sh
npm test
npm run typecheck
npm run db:test
npm run build
```

`npm test` runs the complete unit and component test suite, including recipe-catalog coverage. `npm run db:test` runs the Neon integration checks, including recipe/rating persistence and repeatable seeding; it needs `DATABASE_URL` or `POSTGRES_URL`. The production build runs migrations and database checks before building Next.js. Database operations are skipped locally when no database URL is configured. Vercel supplies `DATABASE_URL` to its build environment.

## Deployment

The Vercel project deploys pushes to `master`. Configure `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` in Vercel Production, Preview, and Development environments; keep them out of source control. GitHub Actions runs tests, TypeScript checking, and the production build on pushes and pull requests targeting `master`. CI does not need service credentials; its database-only checks skip when no database URL is configured.

Repository: [BradleyGoralczyk/pnw-recipeshare-bgoralc](https://github.com/BradleyGoralczyk/pnw-recipeshare-bgoralc)

## Feature checklist

### Must have

- **M1 Browse recipes - Done:** recipe cards show photos, title, cuisine, category, and average rating.
- **M2 Recipe details - Done:** detail pages show recipe information, ingredients, steps, prep time, and author.
- **M3 Share recipes - Done:** visitors can submit recipes; server validation reports missing or invalid fields and retains entered values.
- **M4 Cuisine and category filters - Done:** filters combine, can be cleared, and show an empty-result message.
- **M5 Rate recipes - Done:** visitors can save 1-to-5 star ratings; the saved average and count update on the detail page and cards.
- **M6 Database persistence - Done:** recipes and ratings are stored in Neon and loaded by the app; Vercel has database environment variables configured.
- **M7 Production catalog - Done:** 80 recipes cover every cuisine/category combination; the idempotent seed is verified in Neon and the live Vercel app.

### Should have

- **S1 Google sign-in and profile - Not done.**
- **S2 Author recipe editing and deletion - Not done.**
- **S3 Fair, account-linked ratings - Not done:** ratings are anonymous as scoped for the Must features.
- **S4 Photo uploads - Done:** visitors upload public JPEG, PNG, and WebP images up to 5 MB through Vercel Blob; production upload was verified. Uploads are open to visitors and have no count limit.
- **S5 Keyword search - Done:** case-insensitive title and ingredient search combines with cuisine and category filters.
- **S6 Recipe sorting - Done:** visitors can sort by newest or highest average rating.

### Could have

- Comments - **Done:** visitors can post a named comment on recipe details; comments are validated and persisted in Neon.
- Favorites on a profile - **Not done.**
- Servings scaler - **Done:** detail pages scale leading ingredient quantities from four servings.
- Recipe video link - **Done:** recipes can include an optional validated video URL.
- Dietary tags and filtering - **Done:** fixed tags are persisted and can be combined with cuisine, category, and keyword filters.
- Phone-friendly layout - **Done:** responsive layout breakpoints are included.
- Other ideas - **Not done:** none added.

### Engineering requirements

Visitor uploads are intentionally open and stored as public images. Anyone can request an upload token and consume the Blob allowance; upload count is not capped. New uploads accept JPEG, PNG, and WebP files up to 5 MB, and the server accepts only URLs from the recipe upload namespace. Existing images are grandfathered regardless of size. Do not use this configuration for sensitive photos.

- **E1 - Done:** public GitHub repository.
- **E2 - Done:** agent instructions, product spec, and build plan are in the repository.
- **E3 - Done:** tests run with `npm test`; database integration checks use `npm run db:test`.
- **E4 - Done:** GitHub Actions passed on the final-review commit and checks pushes and pull requests to `master`.
- **E5 - Done:** latest Vercel Production deployment is READY and tracks the current `master` commit.
- **E6 - Done:** secrets are read from environment variables; `.env.example` contains variable names only.
- **E7 - Done:** this README documents the live app, setup, commands, and feature status.
