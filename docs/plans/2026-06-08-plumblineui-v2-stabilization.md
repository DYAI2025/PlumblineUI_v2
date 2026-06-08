# PlumblineUI v2 Stabilization Plan

Date: 2026-06-08
Status: executed as a static-site stabilization increment

## Goal

Stabilize PlumblineUI v2 into a truthful static marketing site with accurate onboarding, valid crawler/social assets, honest CTAs, visible `/agileteam` start-safety guidance, CI checks, bundle budget measurement, and reduced-motion hardening.

## Scope

- Documentation and configuration truth.
- Static SEO/crawler assets.
- CTA honesty.
- Install preflight guidance.
- Local verification scripts and GitHub Actions CI.
- Reduced-motion and 3D lazy-loading hardening.

## Out of scope

- Backend/API/server implementation.
- Full redesign.
- Real sponsorship checkout integration without a provided URL.
- Live production deployment validation.
- Changes to the separate Plumbline core repository.

## Done definition

- `npm run verify` passes locally.
- README does not contain false Gemini/API setup instructions.
- `public/sitemap.xml` and `public/og-image.svg` exist and match references.
- CTAs are real, accurately labeled, or clearly pending/disabled.
- The install section warns that Product Vision, Product Canvas, PRD, acceptance criteria, and evidence gates are required before `/agileteam`.
- CI mirrors the local static-site governance checks.
