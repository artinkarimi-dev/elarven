# Production readiness

## Frontend status

The current frontend is designed as a deployable, portfolio-grade Next.js product surface rather than a static mockup. Navigation, discovery, filters, sorting, map selection, saved stays, date/guest validation, gallery controls, pricing, reservation review, confirmation recovery, errors and empty states are implemented as working flows.

The October hardening pass adds lightweight reveal/scroll motion without a large animation dependency, richer responsive presentation, hourly ISR for the home route, session-safe confirmation recovery, Web Share with clipboard fallback, security response headers, patched Next.js 16.3.8 dependencies, sitemap/robots metadata, a deployment-safe standalone bind host, an automated WebP source-asset budget, and a GitHub Actions quality/security pipeline.

Before publishing new performance claims, run:

```sh
npm ci
npm run quality
npx playwright install chromium
npm run test:e2e
node scripts/visual-check.mjs
node scripts/audit.mjs
```

## Deliberate product boundary

Elarven still uses a local fictional catalog and local fixture availability. The reservation flow does **not** create a real booking. A real commercial booking product would additionally require server-authoritative inventory, a database, transactional reservation holds, authentication/authorization where appropriate, server-side validation, payment intents and verified webhooks, transactional email, idempotency, audit logs, observability, backup/recovery and operational monitoring.

That boundary is intentional and should remain explicit in a portfolio review. The frontend can be production-quality while the fictional booking business is not represented as a live production service.
