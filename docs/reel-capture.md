# Capture a 25–30 second Elarven Reel

## Run the real app

From the repository folder:

```sh
npm ci
npm run build
npm run start
```

Open `http://127.0.0.1:3000`. Use the production build, 100% browser zoom, and a clean browser profile. Clear only the site's saved-stay storage if you want an empty heart. Hide browser chrome in your recording or record just the page surface.

**Recording viewport:** 432 × 768 CSS pixels, exactly 9:16. Also validated as a normal mobile product at 390 × 844 and 430 × 932. If capturing one of those taller viewports, fit the whole recording into a 1080 × 1920 composition with side margins; do not crop away buttons to fill the frame. Higher-resolution recording can use a device scale factor of 2 or 3.

## One coherent story

Choose **Dolomites, Italy → Stillhaus · Ridge Cabin**. Use arrival 21 days from today, departure three nights later, two adults. Avoid the blocked fixture nights listed in the data provenance document. For the original three-night, standard-rate journey, the full total is €993.40. Extending to four nights changes it to €1,306.20.

| Time   | Real interaction                                                          | Frame to hold                                          |
| ------ | ------------------------------------------------------------------------- | ------------------------------------------------------ |
| 0–3s   | Begin on home, no mouse movement                                          | Architecture, wordmark, two-line headline and search   |
| 3–7s   | Type “Dolo”, select the destination; open dates and select the range      | Calm autocomplete and date dialog                      |
| 7–11s  | Find my stay → Filters → Cabin → Show stays                               | One matching card; pause with its image visible        |
| 11–16s | Open Ridge Cabin → gallery → next photo → Escape                          | Full-screen interior for 1–2 seconds                   |
| 16–22s | Save the stay, scroll to the booking panel, extend departure by one night | The total visibly changes from €993.40 to €1,306.20    |
| 22–28s | Reserve this stay                                                         | Hold the property summary and total as the final frame |

Edit out typing pauses and the longer scroll between gallery and booking panel. Keep the pointer still during each hold. Do not pan continuously. The actual product works without sound; music is optional and should be separately licensed.

## Safe composition

The opening headline is inset from the top and right edge, and the search action sits above the bottom 150px of the hero. Still, Reel overlays vary by device and placement. Preview the uploaded clip with Meta's safe-zone tools before publishing. Keep captions and stickers away from dates, totals and the search action. During later shots, scroll the relevant control into the middle of the frame; do not rely on the sticky bottom action being unobstructed by Instagram UI.

For a clean opening, wait for the hero and font to load before recording. For the final frame, use the reservation summary or record the complete local confirmation with synthetic contact details such as `alex@example.com`. No email is sent and no booking is transmitted.

## Optional deterministic rehearsal

With the production server running:

```sh
npx playwright install chromium
node scripts/showcase.mjs
```

This drives the real routes and controls and writes a WebM under ignored `recordings/`. It does not bypass product logic or render a separate movie UI. Timing varies with machine speed; the shot list above is the editorial 25–30 second target. Set `SHOWCASE_HEADLESS=false` in your shell to watch the rehearsal. No contact information is entered by the script.

The verified local rehearsal on 28 September 2026 lasted 24.28 seconds at 432×768. The inspected local frame set showed the actual sequence; those generated capture artifacts are intentionally not bundled with the source archive. The script selects departure before arrival to avoid a temporary invalid range while editing, and scrolls the final total into the middle of the frame. Add a brief opening or closing hold to reach the editorial 25–30 second target. Preview Instagram's actual overlays before publishing.

On the configured project workstation, Playwright binaries may use the parent workspace cache. If the command reports a missing browser, run `npx playwright install chromium` for the standard cache, or set `PLAYWRIGHT_BROWSERS_PATH` to your existing browser-cache directory. No repository code depends on a private machine path.
