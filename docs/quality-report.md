# Verification report

28 September 2026. Local Windows 10, Node 22.18.0, npm 11.6.2. All browser checks use the production Next.js build, not the development server.

## Final quality gates

`npm run format:check` passed on the final formatted source and documentation.

| Check                    | Actual result                                                            |
| ------------------------ | ------------------------------------------------------------------------ |
| Clean dependency install | Passed, 643 packages installed from the repaired lockfile                |
| ESLint                   | Passed, no warnings                                                      |
| TypeScript               | Passed, including production build type checking                         |
| Vitest                   | 30 tests passed across four files                                        |
| Playwright               | 12 tests passed in 39.5 seconds against the standalone production server |
| Production build         | Passed; all six product routes plus error/social routes generated        |

The production launcher now copies public/static assets into the generated standalone directory before starting the server, following Next's standalone deployment instructions. Original assets are read only.

Windows Sharp DLLs are explicitly included in output tracing. A browser regression test requests a 640px optimized image and verifies its decoded width is 640px; this catches silent full-original fallback, which status-code checks alone would miss. The fixed standalone server produced no image-optimizer errors during the final E2E run.

## Scope and evidence

- Domain/component tests exercise UTC dates and blocked nights, night/guest limits, fee rounding, combinations of filters, clearing filters, related stays, saved-state parsing, steppers, save feedback, destination keyboard selection, reservation validation and changing prices.
- Chromium E2E covers the complete search → filter → property → gallery/save → validation → review → confirmation journey. It checks that contact information is absent from localStorage, confirmation reload recovers, and the happy path produces no JavaScript or console errors or HTTP failures.
- Additional browser cases cover small-screen no-results recovery, saved persistence, map selection, blocked dates, invalid dates, missing properties, keyboard focus trapping/restoration, every map pin at 360px, and image/date-error recovery with reduced motion.
- axe checks five routes against WCAG A/AA tags including WCAG 2.2; a separate label-in-name rule checks that spoken control names contain their visible labels. Automated coverage is not WCAG certification. No human screen-reader study was performed.
- The responsive sweep captures home, results, detail and reservation at 360×800, 390×844, 430×932, 768×1024, 1024×768 and 1440×900. All 24 combinations passed overflow, loaded-image and browser-exception checks. Full-page and viewport screenshots were inspected; [the contact sheet](screenshots/responsive-review.webp) records the six-size comparison.

## Two polish passes

**Composition:** corrected the mobile headline wrapping, image crops and search spacing; kept the useful hero controls visible; tuned desktop editorial spacing and mobile sticky booking behavior. Original full-width imagery remains intact, with a separate portrait derivative for phones.

**Interaction and consistency:** fixed nested-form hydration, date defaults crossing a build-day boundary, overlapping map pins, dialog Tab cycling, visible/accessible label mismatches, incomplete-date submission, fractional currency formatting and mobile fee visibility. Added styled destination autocomplete and restrained save/dialog feedback. The main headline has no entrance delay; reduced motion disables decorative transitions.

The final edge-case sweep also fixed a map caption intercepting one mobile pin and an eager hero image failure occurring before React attached its error handler. Both now have browser regression coverage.

## Reproducibility

A clean `npm ci --no-audit --no-fund` completed after repairing optional dependency entries in the lockfile. The project does not rely on a global package install. Native Chromium binaries are installed separately using Playwright's documented command. The local browser cache path is an environment setting, not a machine-specific path in repository code.

The GitHub Actions workflow contains the same formatting, lint, type, unit, build and Chromium gates. It has not run remotely, because GitHub publication is deferred by the owner.

## Performance method

`scripts/audit.mjs` launches a fresh headless Playwright Chromium for each Lighthouse run and closes it afterward. It audits the homepage at `127.0.0.1:3000`, with Lighthouse 12.8.2's standard simulated mobile throttling and its official desktop configuration. Exact browser version, viewport, CPU/network settings, timestamps, metrics and diagnostic issues are retained in [performance-results.json](performance-results.json). This is a local lab measurement, not field Core Web Vitals or a deployed-origin audit.

Each audit has a 120-second outer deadline and 20/45-second first-paint/load limits. Cleanup uses the owned Playwright browser server, with a ten-second fallback to kill only that browser, and verifies its process exited. No user browser session is terminated. Audits run sequentially without E2E or capture jobs in parallel; the production server and image optimizer are warm, browser profiles fresh.

Performance work includes responsive AVIF/WebP delivery through Next's optimizer, eager high-priority hero media, local preloaded fonts, lazy media below the fold, a dynamically imported map, stable media dimensions and no analytics or external font requests. The small full-screen gallery mounts its media on demand. Lighthouse's remaining unused/legacy JavaScript diagnostics include the framework runtime.

### Measured final results

| Profile | Performance | Accessibility | Best Practices | SEO     | LCP       | TBT      | CLS |
| ------- | ----------- | ------------- | -------------- | ------- | --------- | -------- | --- |
| Mobile  | **88**      | **100**       | **100**        | **100** | 3019.89ms | 289.50ms | 0   |
| Desktop | **100**     | **100**       | **100**        | **100** | 731.88ms  | 12ms     | 0   |

Mobile remains two points below the 90 target. This is disclosed rather than presented as a pass. Its LCP element is the headline; the audit attributes most of that time to rendering, with main-thread work still contributing to TBT. The initial standalone packaging regression scored 76 mobile and sent original-size imagery. Including Sharp's DLLs restored responsive delivery and produced the final 88. The final mobile image-delivery diagnostic estimates 29KiB of remaining savings, versus roughly 1MiB before that fix. Removing the headline entrance and testing an alternative request-rendering mode did not eliminate the remaining delay; the hydration-safe rendering path and approved design were retained. Further runtime tuning and real-device profiling are future work, without stripping product functionality for an audit score.

Both final audits exited normally and logged successful termination of their own Chromium processes. These numbers are from the final fixed build, not selected from the earlier desktop-only or misconfigured runs.

## Original specification coverage

The local frontend scope is implemented: original brand/research and tokens; twelve typed stays in four real regions; all six routes; destination/date/guest discovery; URL filters/sort; illustrative map; persistent saved IDs; property gallery, amenities, share and related stays; fee-derived booking and rate options; contact validation, review and in-memory confirmation; required empty/error/unavailable/fallback states; responsive layouts, reduced motion, keyboard/focus support, metadata, tests, provenance and capture documentation. The two craft passes and final production checks are recorded above. Source videos remain untouched.

The performance target has the disclosed mobile gap. Remote repository creation, push and remote CI execution are deferred by the owner's later instruction, which supersedes the original publishing phase. No backend or payment was part of this frontend scope.

The final 432×768 rehearsal ran successfully and produced a 24.28-second WebM. Its opening, autocomplete/date overlay, results, gallery, changing price and final reservation summary were visually inspected. [Reel frames](screenshots/reel-review.webp) and the [final price frame](screenshots/reel-final-frame.webp) are retained; the generated video remains local under ignored `recordings/`.

## Limits

Only Chromium was exercised here; Safari, Firefox, real-device performance and assistive-technology user testing remain useful follow-up verification. The map is approximate and the catalog, ratings, availability and confirmation are local fiction. No backend, payment, email, account or real reservation is implemented. Original video files remain outside the repository and have not been edited or redistributed.
