# Elarven — research and direction

Accessed 28 September 2026. A focused reference pass, not user research or trademark clearance.

| Reference                                                                                                                                   | Principle adapted                                                                                   | Do not copy                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [The Brecon](https://thebrecon.com/en/) — [2024 recognition](https://www.positioner.com/corporate/awards)                                   | Architecture establishes place before descriptive copy; use generous editorial rhythm               | Layout, photography, identity, animation sequences                                                                          |
| [Constance](https://www.constancehotels.com/en/) — February 2025 Honorable Mention and Mobile Excellence on the agency awards page          | Keep practical booking entry points close to immersive imagery                                      | Resort branding, claims, copy or visual assets                                                                              |
| [Plum Guide](https://www.plumguide.com/)                                                                                                    | Destination and travel party are first-class search inputs                                          | Card and search layout or quality claims                                                                                    |
| [Sawday’s](https://www.sawdays.co.uk/)                                                                                                      | Editorial descriptions should tell the guest something concrete about a place                       | Inspection claims, owner narratives or photographs                                                                          |
| [Next production checklist](https://nextjs.org/docs/app/guides/production-checklist)                                                        | Server-render content; limit client boundaries; verify a production build                           | No copied app template                                                                                                      |
| [Next Image](https://nextjs.org/docs/app/api-reference/components/image), [Font](https://nextjs.org/docs/app/api-reference/components/font) | Responsive sizes, stable aspect ratios, LCP priority and self-hosted fonts                          | No runtime font service                                                                                                     |
| [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/)                                                                         | Visible focus, unobscured focus, minimum targets, labelled errors, keyboard dialogs, reduced motion | Automated passes are not certification                                                                                      |
| [Meta Reels](https://www.facebook.com/business/ads/facebook-instagram-reels-ads)                                                            | Native 9:16 and keep key creative within safe zones                                                 | No claim of a fixed universal safe zone; UI overlays vary. Search-index guidance was accessible, direct page required login |

## Product decision

Design-conscious couples and small groups choosing an entire boutique stay. Primary path: landscape or destination → dates and guests → filtered stays → detail and price → contact details → review → local confirmation. Elarven is a fictional curation brand. Exact-name web and GitHub searches found no obvious match; that is not legal clearance. Other naming directions had hospitality or software collisions.

Visual thesis: an architectural travel journal that opens into a useful booking product. Deep ink, ivory and terracotta; quiet serif display typography with a precise sans interface. A full-width Alpine photograph anchors the opening. Numbered collections and fine rules give structure without a sea of floating cards.

Signature interactions: landscape-led discovery, save feedback, immersive gallery, synchronized illustrative map, and a reservation price that updates from real inputs. Use CSS transform/opacity transitions instead of a motion dependency; respect reduced motion.

## Tokens

- Ink `#202c2b`, paper `#f8f7f3`, white `#ffffff`, muted `#58625d`, line `#d9ddd5`, accent `#a5432c`, pale `#e9eee7`.
- Display: Cormorant Garamond variable; interface: DM Sans variable. Self-hosted OFL fonts through next/font/local.
- Type: 12/14/16/18/24/32/48/64/88 px (fluid display). Body 16px, labels at least 14px.
- Spacing: 4/8/12/16/24/32/48/64/96. Radius: 4px inputs, 8px media, 999px chips. Borders 1px; one soft panel shadow.
- Motion: 180ms feedback, 350ms image preview, 650ms entrance; cubic-bezier(.2,.7,.2,1). No autoplay carousel, scroll hijacking or WebGL.
- Breakpoints: 600/900/1200 px; max content 1320px. Mobile padding 20px; desktop 48px.

## Deliberate exclusions

No backend, payment, account system, transactional email, live inventory, analytics, real map tiles or unverified customer testimonials. Repository publication deferred by the user. Native date inputs provide keyboard and device-calendar support; no hand-built calendar grid. Non-identifying saved IDs use localStorage; contact data stays in memory.
