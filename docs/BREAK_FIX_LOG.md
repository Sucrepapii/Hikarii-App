# Hikarii Sprint Break-Fix Log

This log documents every production failure, schema migration issue, and integration blocker encountered during the sprint, detailing the symptom, diagnostic path, root-cause resolution, and preventive measures.

---

## Log Entry 01: Destructive Release Scripts Wiping Production User Data

- **Date**: 2026-09-15
- **Severity**: Critical (Data Loss)
- **Symptom**: Deploying or restarting the application process wiped existing user accounts, tasks, budgets, and projects, resetting the database back to empty state.
- **Where Samuel Looked First**: `package.json` scripts section (`"start"` script).
- **What Actually Fixed It**: 
  - Identified `"start": "npx prisma generate && npx prisma db push --accept-data-loss && node dist-server/app.js"`. The `--accept-data-loss` flag caused Prisma to drop and recreate tables on schema changes.
  - Created a baseline SQL migration directory (`prisma/migrations/0_init/migration.sql`) capturing the complete PostgreSQL DDL schema.
  - Replaced `db push --accept-data-loss` with idempotent, non-destructive `npx prisma migrate deploy` in `package.json` and deployment pipelines.
- **What Would Have Made It Obvious Sooner**: An automated CI/CD pipeline policy check preventing flags containing `--accept-data-loss` or `db push` in production start scripts.

---

## Log Entry 02: Migration Baselining Failure (Error P3005) on Existing Database

- **Date**: 2026-09-15
- **Severity**: High (Deployment Blocker)
- **Symptom**: Running `npx prisma migrate deploy` failed with `Error: P3005 - The database schema is not empty`.
- **Where Samuel Looked First**: Prisma CLI migration status logs and Supabase PostgreSQL migration tracking table (`_prisma_migrations`).
- **What Actually Fixed It**: 
  - The provider-hosted Supabase database already contained tables from prototype runs, but lacked the `_prisma_migrations` tracking row for `0_init`.
  - Executed `npx prisma migrate resolve --applied "0_init"` to mark the baseline migration as applied without attempting to re-create existing PostgreSQL tables.
- **What Would Have Made It Obvious Sooner**: A automated deployment step that verifies `_prisma_migrations` tracking status before attempting initial migration deployments on pre-existing managed stores.

---

## Log Entry 03: Confirmation Link 404 Error on User Signup Callback

- **Date**: 2026-09-15
- **Severity**: High (Auth Loop Blocker)
- **Symptom**: When a new user clicked the confirmation link in their signup email, the browser navigated to `https://hikarii.org/auth/callback`, which rendered a 404 / `NotFound` page, preventing the user from completing sign in.
- **Where Samuel Looked First**: Client routing configuration in `src/App.tsx` and Supabase Auth `emailRedirectTo` parameters.
- **What Actually Fixed It**: 
  - Created a dedicated `AuthCallback.tsx` component to handle Supabase access token hash fragments and PKCE codes.
  - Registered the `/auth/callback` route in `App.tsx`.
  - Updated `signUp` and `resendCode` in `authStore.ts` to pass `emailRedirectTo: `${window.location.origin}/auth/callback``.
- **What Would Have Made It Obvious Sooner**: An automated end-to-end integration test simulating the user clicking the confirmation email link URL in a browser environment.

---

## Log Entry 04: Premature Redirect to Login Page on Refresh

- **Date**: 2026-09-15
- **Severity**: Medium (User Experience / Session Recovery)
- **Symptom**: Refreshing a protected page (e.g. `https://hikarii.org/dashboard`) briefly flashed or immediately redirected authenticated users to `/login`, forcing them to re-enter credentials even though a valid session existed in `localStorage`.
- **Where Samuel Looked First**: `src/components/auth/ProtectedRoute.tsx` and Zustand `useAuthStore` initial state.
- **What Actually Fixed It**: 
  - `authStore` initialized with `isLoading: false` and `token: null`. On page load, `ProtectedRoute` evaluated `!token` and `isLoading === false` *before* `checkAuth()` completed token recovery.
  - Updated `authStore.ts` initial state to `isLoading: true`. `ProtectedRoute` now waits for `checkAuth()` to finish session recovery before rendering route guards.
- **What Would Have Made It Obvious Sooner**: A page refresh regression test on protected route paths.

---

## Log Entry 05: Stray Host Fallbacks and Domain Typos in Live Build

- **Date**: 2026-09-15
- **Severity**: Medium (Security & Network Integrity)
- **Symptom**: API calls from landing page feedback, contact form, and article feedback fell back to `http://localhost:5000/api` or `https://hikarii.onrender.com/api` when `VITE_API_URL` was unset, and canonical links contained triple-'i' domain typos (`Hikariii.org`).
- **Where Samuel Looked First**: Source code search (`grep`) for `onrender`, `railway`, `localhost:5000`, and `Hikariii.org`.
- **What Actually Fixed It**: 
  - Refactored `API_BASE_URL` in `src/api/client.ts` to default to relative `${window.location.origin}/api`.
  - Replaced inline raw `fetch`/`axios` calls across `LandingPage.tsx`, `Contact.tsx`, `ArticlePage.tsx`, and `FeedbackSection.tsx` with `apiClient`.
  - Normalized all domain references and meta tags in `index.html` and email templates to `https://hikarii.org`.
  - Hardened Express CORS `allowedOrigins` in `server/src/app.ts` to strictly allow `https://hikarii.org` and `https://www.hikarii.org`.
- **What Would Have Made It Obvious Sooner**: A strict linter rule prohibiting hardcoded `http://localhost` string literals in `src/` and automated bundle scanning for non-canonical domains.

---

## Log Entry 06: Continuous Sprint Verification Suite Automation

- **Date**: 2026-09-15
- **Severity**: Low (Sprint Verification & Quality Gate)
- **Symptom**: Lack of a single, continuous test execution runner to validate the 4 mandatory sprint acceptance criteria (Stranger, Restart, Clean-Room, Leak) in one continuous run.
- **Where Samuel Looked First**: `scripts/` directory and test configurations.
- **What Actually Fixed It**: 
  - Created `scripts/verify-sprint-continuous.ts` to execute Stranger Test, Restart Test, Clean-Room Test, and Leak Test in sequence.
  - Replaced all legacy `Hikariii.org` domain typos across pages, footers, sitemaps, and server controllers with canonical `hikarii.org`.
  - Re-built production bundles and verified 100% pass across all 4 continuous tests.
- **What Would Have Made It Obvious Sooner**: Embedding the continuous sprint runner in pre-commit git hooks or CI pipeline workflows.
