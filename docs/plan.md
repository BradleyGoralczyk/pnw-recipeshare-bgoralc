# RecipeShare Build Plan

The acceptance criteria in [`spec.md`](./spec.md) are the source of truth. Build and verify the Must features before starting any Should or Could feature. Add a focused test after each feature works, and run the full suite after each step.

## 1. Scaffold the application

- **Build:** Create a Next.js App Router application with strict TypeScript, shared layout/navigation, basic styling, and a test runner. Keep recipe data in a small typed module for now; the database comes later.
- **Files:** `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/globals.css`, `lib/recipes.ts`, test configuration, `.gitignore`, `.env.example`.
- **Test:** Add a smoke test that the app renders its main page.
- **Check:** Run `npm run dev`, open the local URL, and confirm the app loads. Run `npm test` and `npm run build`.

## 2. M1 — Browse recipe cards

- **Build:** Add recipe card components showing a food photo, title, cuisine, category, and average rating. Use temporary sample recipes with varied cuisines and categories.
- **Files:** `app/page.tsx`, `components/RecipeCard.tsx`, `lib/recipes.ts`, relevant tests.
- **Test:** Verify cards display all required fields and the sample recipe list renders.
- **Check:** On the home page, confirm each card visibly includes the required information and a food image.

## 3. M2 — Open recipe details

- **Build:** Make each card link to a detail route that shows all recipe fields and the author name.
- **Files:** `app/recipes/[id]/page.tsx`, `components/RecipeCard.tsx`, `lib/recipes.ts`, relevant tests.
- **Test:** Verify a recipe ID resolves to its detail data and an unknown ID returns a not-found state.
- **Check:** Click a home page card and confirm ingredients, steps, prep time, image, cuisine, category, title, and author are shown.

## 4. Deploy early

- **Build:** Push the working M1/M2 app to the public GitHub repository and connect it to a free Vercel project for automatic deployments from `master`.
- **Files:** `README.md` (initial run and deployment notes), plus any configuration Vercel requires.
- **Test:** Confirm `npm run build` succeeds before deployment; no new feature test is needed for deployment setup.
- **Check:** Open the public Vercel URL and verify the home page and a recipe detail page work. Confirm a push to `master` produces a new deployment.

## 5. M3 — Add recipes with validation

- **Build:** Add the recipe form with author name, title, fixed cuisine/category dropdowns, ingredients, steps, prep time in minutes, and image URL. Validate required values before saving. Keep this first version in temporary in-memory/sample data as the assignment allows; database persistence is Step 7.
- **Files:** `app/recipes/new/page.tsx`, `app/actions/recipes.ts` (or equivalent handler), `components/RecipeForm.tsx`, `lib/validation.ts`, `lib/recipes.ts`, relevant tests.
- **Test:** Verify missing required fields are reported and do not save a recipe; verify a valid recipe is added to the visible list.
- **Check:** Submit a complete recipe and find it on the home page. Submit with one required field empty and confirm an error names that field and no recipe is added.

## 6. M4 — Filter by cuisine and category

- **Build:** Add cuisine and category dropdown filters using exactly the lists in `spec.md`. Combine both filters, support clearing them, and show “No recipes found” when nothing matches.
- **Files:** `app/page.tsx`, `components/RecipeFilters.tsx`, `lib/recipes.ts` (filter function), relevant tests.
- **Test:** Verify Iranian + Main Dish returns only matching recipes, clearing filters returns all recipes, and a no-match choice yields an empty result.
- **Check:** Use the live page to select Iranian and Main Dish, clear both choices, then select a combination with no matches.

## 7. M6 — Persist recipes and ratings in Neon

- **Build:** Provision a free Neon Postgres database and connect it through server-only environment variables. Add schema/migrations and server-side data access for recipes and ratings. Replace temporary recipe storage with database reads/writes; prepare rating persistence for Step 8. Add safe seed support for sample records in Step 9.
- **Files:** `lib/db.ts`, `lib/db/schema.ts` (or SQL migration files), `lib/recipes.ts`, `lib/ratings.ts`, `.env.example`, `.gitignore`, relevant tests, Vercel environment settings.
- **Test:** Verify recipe creation/read uses the database, and rating records can be stored and retrieved once the rating model is introduced. Keep credentials out of tests, browser code, and Git.
- **Check:** Add a recipe on the deployed app, open it from a separate browser/device, and confirm it remains after a new deployment. Confirm environment variables are set in Vercel and absent from the repository.

## 8. M5 — Rate recipes

- **Build:** Add a 1–5 star rating control and calculate average rating and rating count from saved rating records. Update both the detail page and card when a rating is submitted. No account is required for this Must feature.
- **Files:** `app/actions/ratings.ts` (or equivalent handler), `components/RatingControl.tsx`, `lib/ratings.ts`, recipe detail/card components, relevant tests.
- **Test:** Verify rating boundaries (1 and 5 accepted; values outside range rejected) and that average/count update correctly, including after reading persisted data.
- **Check:** Rate a recipe on the live app, confirm the new average/count on its detail page and home card, then reload and confirm the rating remains.

## 9. M7 — Seed sample recipes in production

- **Build:** Seed at least two database recipes with different cuisine and category values. Make seeding safe to repeat without duplicating records.
- **Files:** `db/seed.ts` (or equivalent seed script), `package.json`, and the database migration/seed documentation.
- **Test:** Verify running the seed twice leaves the expected sample records without duplicates.
- **Check:** On the live URL, confirm at least two recipes with different cuisines and categories appear and can be found using the filters.

## 10. Finish engineering requirements and acceptance review

- **Build:** Add/update the GitHub Actions workflow to install dependencies, run all tests, and build on pushes and pull requests. Complete README with the live URL, setup/test commands, environment variable names, and done/partly done/not done status for every M, S, and Could feature. Review commits and verify no secrets are present.
- **Files:** `.github/workflows/ci.yml`, `README.md`, `.env.example`, any needed project documentation.
- **Test:** Confirm one command runs the full test suite; require at least three passing tests, with CI also building the app.
- **Check:** Verify the latest GitHub Actions run on `master` passes, the production deployment is current, and each Must acceptance criterion passes on the deployed site. Do not begin Should or Could features until this review passes.
