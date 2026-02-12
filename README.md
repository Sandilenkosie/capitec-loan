# Capitec Loan Simulator (UI)

A small React + Vite frontend that demonstrates a loan eligibility and product simulator UI. This README provides a concise developer-focused reference to get the project running, explain the folder layout, and describe useful scripts and options.

## Quick start

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

3. (Optional) Enable local stubbed API responses used during development and by Cypress

```bash
VITE_USE_STUBS=true npm run dev
```

## Available scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview built assets locally
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lintable issues
- `npm test` — run unit tests (vitest)

Check `package.json` for full scripts and any project-specific commands.

## Project layout (important parts)

- `src/` — application source
	- `src/components/` — Page-level components (root) and UI primitives under `ui/`
	- `src/lib/` — small helpers, API wrapper and business logic utilities
	- `src/pages/` — route entry points
	- `src/server/` — local stubbed API handlers used by the dev server and Cypress
- `cypress/fixtures/api/data/` — JSON fixtures used by stubs and end-to-end tests

This structure keeps UI components, utilities, pages and stub handlers separated for easier maintenance.

## Local stubs

The app can run against a small local stub API used for development and Cypress tests. Use the environment variable `VITE_USE_STUBS=true` when starting the dev server to enable these fixtures. The stub handlers live under `src/server/api/stubs/` and use the fixture files in `cypress/fixtures/api/data/`.

## Docker (optional)

Build a production image that serves the built app and the stub API (useful for demos):

```bash
docker build -t loan-app:latest .
docker run --rm -p 8080:8080 loan-app:latest

# open http://localhost:8080
```
