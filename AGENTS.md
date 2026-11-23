# RecipeShare Agent Instructions

## Purpose and source of truth

Build RecipeShare, a recipe sharing website where visitors can browse recipes, filter by cuisine and category, open recipe details, add recipes, and rate recipes. The product requirements and acceptance criteria in `docs/spec.md` are authoritative. Follow them exactly; ask before changing a requirement.

Implement all Must features M1-M7 before starting Should or Could features. Use the exact cuisine and category choices in the spec. Keep the experience usable on desktop and mobile.

## Chosen stack

- TypeScript for application code.
- Next.js with the App Router for the web application, deployed to Vercel.
- Neon hosted PostgreSQL for persistent recipes and ratings.
- Use the simplest additional libraries that meet a requirement; explain new dependencies in the change summary.

## Commands

Use Node.js 20.9 or newer and npm. From the repository root:

- Install dependencies: `npm install`
- Run locally: `npm run dev`
- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Check TypeScript: `npm run typecheck`
- Create a production build: `npm run build`

Keep `npm test` as the single command for the complete test suite. Update this file if the project adopts different commands.

## Coding conventions

- Use TypeScript and preserve strict type checking; avoid `any` unless there is a documented reason.
- Prefer small, readable components and functions with clear names.
- Validate required fields and user input on the server as well as in the interface.
- Keep database access server-side and use parameterized queries or a safe ORM.
- Provide accessible labels, keyboard operation, useful validation messages, and responsive layouts.
- Add a test for each feature after it works. Run the full test suite after changes and report any failures.
- Keep documentation and the feature checklist current as implementation changes.

## Security and project rules

- Never commit secrets, credentials, or populated `.env` files. Read secret values from environment variables; keep `.env.example` limited to variable names and safe descriptions.
- Do not expose database credentials or privileged database access to browser code.
- Use only free service plans for this assignment; do not add payment information or enable paid add-ons.
- Recipe photos are food photos supplied by image URL; do not add photo uploads before the Must features are complete.
- Do not begin Should or Could work until M1-M7 meet their acceptance criteria.
- Keep changes focused and commits clear. Do not claim a feature passes unless it has been checked against its acceptance criterion.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
