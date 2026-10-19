# hero-playwright

End-to-end and API test suite for the **Hero admin dashboard**, built with [Playwright Test](https://playwright.dev/) and TypeScript.

The suite covers the admin magic-link login flow, the waitlist management dashboard (status changes, ticket grants, filtering, deletion), and authorization rules on the `admin-users` API endpoint.

## Stack

- `@playwright/test` — test runner, browser automation, API client
- TypeScript with the Page Object Model
- Supabase local stack (auth + edge functions) as the backend under test
- Mailpit (port `54324`) for magic-link email capture
- GitHub Actions for CI

## Project layout

```
pages/                         Page objects (selectors + actions, no assertions)
  HeroLoginPage.ts             Admin login + magic-link flow
  HeroDashboardPage.ts         Waitlist table: filters, bulk status, tickets, delete
tests/
  auth.setup.ts                Logs in as admin, saves storage state
  fixturesHeroLogin.ts         Fixture exposing a ready HeroLoginPage
  fixturesHeroDashboard.ts     Fixture exposing a ready HeroDashboardPage
  ui/login.spec.ts             Login / magic-link UI tests
  ui/dashboard.spec.ts         Dashboard UI tests (all @auth)
  ui/delete.spec.ts            Permanent user deletes (run last, see below)
  api/admin-authorization.spec.ts  200 / 401 / 403 checks on admin-users
playwright.config.ts           Projects, reporters, auth wiring
.github/workflows/playwright.yml  CI pipeline
```

## Services the tests expect

The tests run against a locally running environment. Start these before running the suite:

| Service | URL |
| --- | --- |
| Admin app | `http://localhost:8888/admin.html` |
| Supabase API / edge functions | `http://127.0.0.1:54321` |
| Mailpit (magic-link inbox) | `http://127.0.0.1:54324` |

Seeded data assumptions: **205** waitlist users, an admin account `admin@example.invalid` and regular accounts such as `auth.user.001@example.invalid`, all with the password `testpassword123`. Several dashboard assertions check exact status counts, so they depend on a freshly seeded database.

## Getting started

```bash
npm ci
npx playwright install
```

## Running tests

```bash
npx playwright test                          # everything
npx playwright test --project=chromium       # UI tests that need no session
npx playwright test --project=chromium-with-auth   # @auth tests (runs setup first)
npx playwright test --project=api            # API authorization tests
npx playwright test --ui                     # interactive UI mode
npx playwright show-report                   # open the last HTML report
```

## How authentication works

`tests/auth.setup.ts` requests a password-grant token from Supabase, writes the session into
`localStorage` under `hero-admin-auth`, and saves the browser storage state to
`playwright/.auth/admin.json` (gitignored).

Projects then split on the `@auth` tag:

- **`chromium`** — `grepInvert: /@auth/`, runs with a clean context (login flows, negative cases)
- **`chromium-with-auth`** — `grep: /@auth/`, depends on `setup` and reuses the saved storage state

Tag a test `@auth` in its title whenever it should start already logged in as admin.

## CI

`.github/workflows/playwright.yml` runs on every push and pull request to `main`/`master`.

Each run provisions the backend from scratch, then runs the full suite:

1. Checks out `Get-Hero-Now/getheronow-landing-page` into `hero-backend/` using the
   `HERO_REPO_TOKEN` secret (a read-only PAT with access to that repo).
2. `supabase start` applies the migrations and `seed.sql` and serves the edge functions
   (`ADMIN_EMAIL=admin@example.invalid`). Mailpit comes up on `54324`.
3. `scripts/build-test-site.py` builds `.test-site/`, which is served on `localhost:8888`.
4. Runs `npx playwright test` and uploads the HTML report as an artifact.

Because the database is seeded fresh on every run, leftovers from earlier runs cannot affect CI.

## Test ordering

The delete tests live in `tests/ui/delete.spec.ts` and run in their own project,
`chromium-destructive`. It depends on every other project, so it runs only after all the tests
that assert the seeded count of 205 users.

## Adding a test

1. Put selectors and interactions in a page object under `pages/` — keep `expect` out of it.
2. Add or reuse a fixture in `tests/` so the test starts on the right page.
3. Write the spec in `tests/ui/` or `tests/api/`, tagging it `@auth` if it needs an admin session.

## Known limitation: the suite is not re-runnable

Some dashboard tests assert exact global counts (`Approved 43`, `Pending Review 141`) and others
delete users permanently. A second run against the same database will fail, because the first run
changed the state those assertions depend on. Reseed the database between full runs.

Making the suite repeatable means reading a value before the action and asserting a relative
change afterwards — the pattern already used by the ticket tests in `tests/ui/dashboard.spec.ts`.
