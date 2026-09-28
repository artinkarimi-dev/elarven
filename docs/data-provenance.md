# Data provenance

Research accessed 28 September 2026. Twelve fictional accommodation options at four fictional retreats, across four real regions. Three options share each retreat's generated exterior and representative interior; these are not twelve photographed real buildings. Names, descriptions, ratings and review counts are seeded design data. No real-person testimonials, guest identities, live rates or live inventory are used.

## Representative price research

The reference travel period is autumn 2026. Public starting rates and published 2026 tariffs provide context; they are not a scraped live quote for a guaranteed date or an identical property. Meal inclusions and accommodation sizes differ.

| Region           | Public reference and observation                                                                                                                                                                                                                                                                                   | Fictional Elarven band                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Dolomites, Italy | [Friedrich](https://www.friedrich.it/en): rooms from €145 per person with half board; 24 Oct–7 Nov 2026 offer from €870 per person for seven nights. Approx. €249–€290 per night for two, before differences in room and package.                                                                                  | €225–€425 per entire stay/night                                           |
| Mallorca, Spain  | [Aimia official site](https://www.aimiahotel.com/): superior lateral sea-view rooms advertised from €196. [Ca’s Xorc](https://www.secretplaces.com/soller-boutique-hotels/cas-xorc-a-country-hideaway-adults-only): public starting rate €250. These starting rates are not date-specific October quotes.          | €245–€495; larger villas carry a fictional size premium                   |
| Agafay, Morocco  | [Scarabeo Stone Camp 2026 tariff](https://www.scarabeocamp.com/s/SC_2026_en.pdf): two-person suite 2,650 MAD/night, four-person family suite 3,250 MAD, half board.                                                                                                                                                | €195–€325, with different meal inclusions                                 |
| Harads, Sweden   | [Treehotel public rate list](https://agents.treehotel.se/): published seasonal tree-room rates 14,800–17,200 SEK. [Oasis](https://treehotel.se/treerooms/oasis/): from 20,100 SEK for two. These are exceptional architectural upper-end comparables; Elarven's conventional timber cabins are deliberately lower. | €255–€395; an editorial fictional band, not a claim of matching Treehotel |

For scale comparison only, 10 MAD ≈ €1 and 11 SEK ≈ €1 were rough editorial assumptions, **not live exchange rates**. All app prices are natively authored in EUR; the application does no FX conversion.

## Calculation rules

- Accommodation = selected nightly rate × UTC calendar nights (1–28).
- Extra-flexible option = base rate + €25 per night, before service fee.
- One cleaning fee per stay: €35 in Agafay; €55 elsewhere.
- Service = 8% of accommodation, rounded to the nearest cent.
- Local tax = €2.50 × adults × nights; children do not add tax. This is a **fictional common rule**, not a statement of local tax law.
- Total = accommodation + cleaning + service + tax. No card payment is collected.
- At least one adult; at most eight total, further limited by each stay's capacity. Bedrooms hold double beds, making capacity consistent.
- Standard cancellation: free until 7 days before arrival for flexible listings, otherwise 14. Extra flexible: 48 hours. These are seeded policies, not real supplier terms.
- Blocked fixture nights: 24–26 December 2026 and 1 January 2027. Checkout on a blocked date is allowed because that night is not occupied.

`src/lib/stays.ts` is the typed repository boundary. `src/lib/domain.ts` owns calculation, availability, filtering, URL parsing and saved-ID parsing. An API must replace local availability and revalidate prices server-side before any real booking is possible.
