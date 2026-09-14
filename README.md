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

`.github/workflows/playwright.yml` runs the suite on every push and pull request to `main`/`master`
and uploads the HTML report as an artifact (30-day retention). Note that CI currently has no local
backend services, so it is useful mainly as a lint/compile gate until the Supabase stack is
provisioned in the workflow.

## Adding a test

1. Put selectors and interactions in a page object under `pages/` — keep `expect` out of it.
2. Add or reuse a fixture in `tests/` so the test starts on the right page.
3. Write the spec in `tests/ui/` or `tests/api/`, tagging it `@auth` if it needs an admin session.
