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

## Layout

- `src/content/` all copy and data (roles, skills, jokes). Edit text here.
- `src/components/` one component per section, each with its own CSS Module.
- `src/app/globals.css` design tokens, reset and the scroll-reveal rules.
- `src/styles/shared.module.css` styles shared by several components.
