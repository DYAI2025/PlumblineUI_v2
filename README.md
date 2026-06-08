# PlumblineUI v2

PlumblineUI v2 is a static Vite/React marketing site for the Plumbline evidence-first agent framework for Claude Code. It is a client-rendered website: there is no backend service, no API server, and no Gemini key required to run or deploy this repository.

## What this repository is

- A Vite + React + TypeScript single-page site.
- A public marketing and documentation surface for Plumbline concepts.
- A static build that can be hosted by GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any static web host.

## What this repository is not

- It is not the Plumbline core agent runtime.
- It is not an external model API application.
- It does not provide a sponsorship checkout integration yet.
- It does not prove production deployment, Lighthouse scores, or Claude Code runtime behavior by itself.

## Prerequisites

- Node.js 22 or newer (the current 3D dependency tree requires Node >=22). The repository also includes `.nvmrc` for local version managers.
- npm 10.5.1 or newer.

## Local development

```bash
npm install
npm run dev
```

The dev server defaults to `http://localhost:3000`.

## Build and preview

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

The production build is written to `dist/`.

## Verification

Run the CI-equivalent local checks before claiming a stable static-site increment:

```bash
npm run verify
```

`npm run verify` runs TypeScript checking, a production build, moderate-level audit, binary-file prevention, static asset integrity checks, CTA honesty checks, and the bundle budget check.

## Static assets and SEO

- Canonical site URL: `https://dyai2025.github.io/Plumbline/`
- Sitemap source: `public/sitemap.xml`
- Social preview image: `public/og-image.svg`
- Crawler rules: `public/robots.txt`

If `index.html` or `public/robots.txt` references a public asset, keep that asset present under `public/` and run `npm run check:assets`.

## Before You Run `/agileteam`

Do not start with coding. A PRD alone is not enough when Product Vision is missing.

Before copying the `/agileteam` command into Claude Code, confirm that the work has:

1. Product Vision: the user value and strategic reason are explicit.
2. Product Canvas: users, constraints, risks, alternatives, and boundaries are understood.
3. PRD: requirements are written against the value target, not just implementation activity.
4. Acceptance criteria: each requirement has observable pass/fail behavior.
5. Evidence gates: the proof class needed for each claim is known before implementation.

If scope is reduced, the reduced slice may be useful, but the original goal remains `not done` until its original acceptance criteria and evidence gates are satisfied.

## CTA policy

Every visible call to action must either:

- navigate to the stated destination,
- scroll to the section named by the label, or
- be clearly marked as pending/unavailable.

Run `npm run check:cta` after editing CTA labels or destinations. Binary assets are not supported in this workflow; use text-native SVG assets instead of PNG/JPEG/WebP files.

## Deployment notes

Deploy the `dist/` directory to a static host. The GitHub Actions workflow in `.github/workflows/static-site-ci.yml` verifies the static site and uploads `dist/` as an artifact; it does not deploy to production by itself.

### Railway

This repository includes `railway.json` so Railway/Railpack can build and run the static Vite output without guessing a runtime command. Railway runs `npm ci && npm run build`, then starts `serve` against `dist/` on the `$PORT` Railway provides:

```bash
npm run build
PORT=3000 npm run start
```

The app remains a static client-rendered site on Railway: no backend service, database, volume, or runtime secret is required.

## Honest status

See [`docs/HONEST_STATUS.md`](docs/HONEST_STATUS.md) for what has been verified locally and what remains unverified.
