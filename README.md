# andrey.erofteev.com

Personal site and interactive CV. Next.js (App Router) + TypeScript.

My day-job code is under NDA, so this site is the public proof of craft.

## Run

```bash
npm install
npm run dev
npm run build && npm start
```

The dev server runs at http://localhost:3000. To open it from another device on
your network, set `DEV_ORIGINS` (comma-separated hosts) in `.env.local`.

## Test

```bash
npm test
npm run test:coverage
npx playwright install chromium
npm run build && npm run test:e2e
```

Unit and component tests use Vitest and Testing Library and sit next to the code
as `*.test.ts(x)`. End-to-end tests use Playwright with axe accessibility checks
and run against the production build on desktop and mobile viewports. CI runs
both before the image is published.

## Layout

- `src/content/` all copy and data (roles, skills, jokes). Edit text here.
- `src/components/` one component per section, each with its own CSS Module.
- `src/app/globals.css` design tokens, reset and the scroll-reveal rules.
- `src/styles/shared.module.css` styles shared by several components.
