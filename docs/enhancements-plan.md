# Should and Could Features Plan

The product details in [`spec.md`](./spec.md) remain the source of truth. The user has authorized work on Should and Could features. This plan does not change the requirements or mark unverified acceptance criteria as complete.

## Feasibility review

| Requirement | Feasibility | Reason / dependency |
|---|---|---|
| S5 Keyword search | High | Existing recipe records already contain titles and ingredients; can combine with the current client-side cuisine and category filters. |
| S6 Sorting | High | Existing recipe reads are newest-first and rating arrays are available for a highest-rated sort. |
| C Servings scaler | High | Ingredient lines are already structured as one item per line. Scale a leading quantity where it can be parsed and leave other text unchanged. |
| C Recipe video link | High | Add an optional validated URL and render it as an external link; no new service is needed. |
| C Dietary tags/filter | Medium | Add a small fixed tag list, persist it on recipes, then compose tag filters with the existing filters and keyword. Requires a database migration. |
| C Comments | Medium | Can use the existing Neon database and add a comments table, validated form, server action, and detail-page list. No account system is required by the Could requirement. |
| C Phone-friendly layout | Done | Responsive breakpoints already exist in the shared stylesheet. |
| S1 Google sign-in/profile | Blocked on setup | Auth.js can provide the integration, but a Google OAuth web client, its callback URLs, and private `AUTH_SECRET`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET` values are needed to exercise sign-in. |
| S2 Edit/delete own recipes | Depends on S1 | Ownership checks must use the authenticated user ID on the server, not a browser-supplied author name. |
| S3 Fair ratings | Depends on S1 | Enforcing one rating per user and preventing author ratings requires authenticated identity and a database migration. |
| S4 Image uploads | Medium | Vercel Blob supports direct browser uploads; this user chose open visitor uploads without Google sign-in. Enforce supported image types and a strict size cap, and make the public storage/abuse tradeoff clear. A Blob store and token are still required. |
| C Favorites on profile | Depends on S1 | A persistent per-user favorite list needs authenticated identities and a profile page. |

Google OAuth redirect URLs to register when S1 is started:

- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://pnw-recipeshare-bgoralc.vercel.app/api/auth/callback/google`

Google requires OAuth client credentials and an exact redirect URI match. Keep all OAuth credentials in local ignored env files and Vercel environment settings, never in Git.

## Implementation order

1. **S5 - Keyword search.** Search recipe titles and ingredient text without regard to case; combine with cuisine/category filtering. Add helper and UI tests. Check the `rice` query against titles and ingredients while keeping the existing filters active.
2. **S6 - Sorting.** Add Newest and Highest rated choices, with stable ordering for unrated/tied recipes. Test order and check both options on the home page.
3. **C - Servings scaler.** Add a servings control to recipe details and scale recognizable leading ingredient quantities from a default of four servings. Test whole, decimal, and fractional quantities and preserve unrecognized lines.
4. **C - Recipe video link.** Add optional video URL input, validation, persistence, and a safe external link on the detail page. Test accepted/rejected URL schemes and rendering.
5. **C - Dietary tags/filter.** Add a fixed set of tags, form validation, a repeatable SQL migration, persistence, and combined filters. Test tag filtering and database read/write.
6. **C - Comments.** Add a comments table and anonymous name/body form with server validation, persistence, and detail-page display. Test validation, rendering, and database persistence.
7. **S1 - Google sign-in/profile.** Once OAuth credentials are configured, add Auth.js Google sign-in/sign-out and a profile recipe list. Test callbacks/session handling with mocked provider/session data, then verify a real sign-in in the browser.
8. **S2 and S3.** After S1 works, add server-enforced ownership for recipe edit/delete, then enforce signed-in ratings, rating replacement, and author-rating prohibition. Test direct unauthorized server-action calls as well as the UI.
9. **S4 - Image uploads.** Connect a public Vercel Blob store, allow only JPEG/PNG/WebP images up to 5 MB, issue short-lived upload tokens for the recipe image namespace, persist returned image URLs, and test type/size/path boundaries. Uploads are intentionally open to visitors per user decision, without account authentication or an upload-count limit.
10. **C - Favorites.** After S1, add persistent per-user favorites and a profile section, with database and authorization tests.

## Delivery and verification

- Keep each implementation batch small and tested before committing.
- Run `npm test`, `npm run db:test`, `npm run typecheck`, and `npm run build` for database-affecting batches.
- Push completed batches to `master`; inspect GitHub Actions and the Vercel Production deployment after each push.
- Update the feature checklist in `README.md` only when its acceptance criterion has been verified.
- Do not deploy OAuth or upload flows as complete until their provider credentials and access controls have been checked in the browser.

## Progress

- **Implemented and pushed:** S5 keyword search and S6 sorting (`c2402ee`); servings scaler, optional video URL, and persisted dietary tags/filter (`18abf60`).
- **Implemented and pushed:** anonymous comments with input validation, Neon persistence (migration `0003_recipe_comments.sql`), and recipe-detail display (`6ebba69`). Unit/component and database integration coverage passed; Vercel Production is READY and the live recipe detail page returned the comments form.
- **Deferred for setup:** S1-S3 and C favorites, for the provider/auth reasons above.
- **Implemented and pushed:** S4 public image uploads (`d689d55`). The photo form is live, local and Production upload round trips succeeded, the temporary test images were deleted, and the Blob URL remains stored through the existing Neon recipe image field.
