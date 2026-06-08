# Honest Status — PlumblineUI v2

Date: 2026-06-08

## Verified locally in this increment

The repository is intended to be verified with:

```bash
npm run verify
```

That command runs TypeScript checking, a production build, a moderate-level npm audit, binary-file prevention, public asset checks, CTA integrity checks, and a bundle budget check.

## What this increment fixes

- The README and environment template describe the actual static Vite/React site.
- External model setup claims are removed from repository onboarding and metadata.
- `public/sitemap.xml` and `public/og-image.svg` exist for the URLs referenced by robots and social metadata.
- Sponsor CTAs are explicitly pending until a real sponsorship URL exists.
- The install section includes a visible “Before You Run /agileteam” preflight warning.
- The 3D plumbline layer is lazy-loaded and does not mount for reduced-motion users.
- CI configuration exists for local-equivalent static-site governance checks.

## Not verified here

- No production deployment has been observed.
- No live GitHub Actions run has been observed in this local environment.
- No Lighthouse run has been executed.
- No browser automation or axe accessibility audit has been executed.
- No real sponsor payment destination has been integrated.
- No Claude Code runtime validation of the separate Plumbline core repository has been executed.

## Remaining follow-up risks

- The current bundle budget intentionally permits the existing large 3D-enabled build ceiling so this stabilization can pass; the target should be lowered after deeper code splitting or lighter visual alternatives.
- External links are not network-validated in CI yet.
- The UI remains mostly hardcoded in `src/App.tsx`; deeper content-model consolidation remains a separate maintainability task.
