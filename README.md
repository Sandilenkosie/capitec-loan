# Capitec Loan Simulator (UI)

This repository contains a small React + Vite frontend used to demonstrate a loan eligibility and product simulator UI. The goal of this cleanup is to make the codebase simple, consistent, and easy for other developers to understand and contribute to.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Run locally (dev server)

```bash
npm run dev
```

Optional: use local stubbed API fixtures in dev

```bash
VITE_USE_STUBS=true npm run dev
```

## Scripts

- `npm run dev` — start Vite development server
- `npm run build` — create a production build
- `npm run preview` — locally preview the build
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lintable issues
- `npm test` — run unit tests (vitest)
- `VITE_USE_STUBS=true npm run dev` — run the dev server with local stub fixtures

## Project structure (high level)

- `src/components` — UI components (Page-level components at root, primitives under `ui/`)
- `src/lib` — small helpers and API wrapper
- `src/pages` — page entrypoints
- `src/server` — local stubbed API handlers used by the dev server / cypress

## Docker (production)

Build the production image:

```bash
docker build -t loan-app:latest .
```

Run the container locally (serves the built app + stub API on port 8080):

```bash
docker run --rm -p 8080:8080 loan-app:latest
```

Then open http://localhost:8080.

The container exposes the same stubbed endpoints used by Cypress under
`/api/stubs/*`, powered by the fixtures in `cypress/fixtures/api/data`.

## Next steps / conventions used in the cleanup

- Keep component filenames matching the exported component name (e.g. `Loans.jsx` exports `Loans`).
- Favor small, testable utility functions in `src/lib` with unit tests.
- Export UI primitives via `src/components/ui/index.js` for consistent imports.

If you want me to continue, I can:

1. Standardize component exports and add `src/components/index.js` for central exports.
2. Consolidate and document `src/lib/api.js` and `src/lib/utils.js` and add a couple of unit tests.
3. Run a safety refactor to make all UI primitives export via `src/components/ui/index.js` and update imports.

Tell me which of the three follow-ups you'd like me to start with (1, 2 or 3), or say "do all" and I'll proceed step by step.
