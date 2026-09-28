# Asset credits and source inspection

Prepared 28 September 2026. Production photography was created for this frontend concept with the built-in OpenAI Imagegen tool. It depicts fictional architecture, not real hotels. No third-party campaign images, remote image hotlinks, logos or stock-library photographs are shipped. AI-generated images are not claimed to have exclusive copyright or to document real places.

## Shipped visual assets

All eight source images were 1536 × 1024 PNGs. Each was converted locally to WebP, quality 85, with metadata removed; no stretching, upscaling or color alteration. `next/image` supplies responsive derivatives at runtime. Source masters are excluded from Git. The browser crops with `object-fit: cover`; the full gallery uses `contain`.

`public/images/alpine-portrait.webp` is a 576 × 1024 mobile hero derivative of `alpine.webp`, cropped to source coordinates (586, 0)–(1162, 1024) and encoded at WebP quality 85. It retains the lodge for a tall composition. Next's optimized `getImageProps` picture pattern selects this crop below 600px.

| Local file                           | Role                               | Source / creator                | Permission note                                         |
| ------------------------------------ | ---------------------------------- | ------------------------------- | ------------------------------------------------------- |
| `public/images/alpine.webp`          | Hero, Stillhaus exterior, cards    | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/images/alpine-interior.webp` | Stillhaus representative room      | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/images/coast.webp`           | Casa Brisa exterior and cards      | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/images/coast-interior.webp`  | Casa Brisa representative room     | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/images/desert.webp`          | Dune House exterior and cards      | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/images/desert-interior.webp` | Dune House representative room     | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/images/forest.webp`          | Pinefold exterior, story and cards | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/images/forest-interior.webp` | Pinefold representative room       | AI-generated / OpenAI Imagegen  | Generated for this project                              |
| `public/icon.svg`                    | Favicon                            | Original geometric code asset   | Created for Elarven                                     |
| `src/app/opengraph-image.tsx`        | 1200 × 630 social card             | Original typographic code asset | Uses Next's bundled Geist font; package license applies |
| `docs/screenshots/*.webp`            | README and visual QA               | Captures of this application    | Contains the generated assets listed above              |

DM Sans: DM Sans Project Authors, [source](https://github.com/googlefonts/dm-fonts). Cormorant Garamond: Cormorant Project Authors, [source](https://github.com/CatharsisFonts/Cormorant). Both use SIL OFL 1.1, installed through Fontsource and self-hosted by `next/font/local`. License copies live in `docs/licenses/`. Lucide icons use the ISC license with Feather portions under MIT; see the corresponding copy there. The UI uses only DM Sans and Cormorant Garamond; the raster social preview uses Next's bundled font.

## Supplied videos — inspected, not shipped

The six original files were inspected without modification. On resumption, all six were found in the user's Downloads directory; they were no longer in the parent project workspace. No video was copied into this repository. Their public redistribution rights were not supplied. No source audio is used.

| Original filename                                                                      | Native properties                                  | Assessment                                                                                                                                                  |
| -------------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Bedrooms_with_a_view_Cozy_room_video_Dream_bedroom_with_view_Sea_view_bedroom.mp4`    | 720×1280, 10.43s, 30fps, H.264 + AAC, portrait     | Useful intimate mobile interior reference. Window and bed lose context in a wide crop. Moderate compressed detail.                                          |
| `Discover_a_mountain_retreat_with_crisp_architecture_and_calming_white_d_cor_wher.mp4` | 720×1280, 15.21s, 30fps, H.264 + AAC, portrait     | Bright pool architecture; candidate mobile story. Vertical columns and pool are damaged by a wide crop. Its tropical cues differ from the Alpine direction. |
| `Embark_on_Thrilling_Adventures_Maldives_Awaits_.mp4`                                  | 720×1280, 21.85s, 30fps, H.264 + AAC, portrait     | Open-water travel footage with a small central person. More destination than architecture; excluded from the four-region catalog.                           |
| `Luxurious_mansion_with_pool_Beautiful_two_story_mansions_luxury_homes_Two_story_.mp4` | 736×414, 10.17s, ~23.91fps, H.264 + AAC, landscape | Strong dusk/pool mood; insufficient native resolution for a full desktop hero. Portrait crop loses the building footprint.                                  |
| `Luxury_Beachfront_Mansion_at_Sunset.mp4`                                              | 736×414, 10.01s, 24fps, H.264 + AAC, landscape     | Broad coastal architecture reference; too soft for full-bleed desktop, weak vertical crop.                                                                  |
| `Luxury_Beachfront_Mansion_at_Sunset (1).mp4`                                          | Same properties as preceding file                  | Duplicate visual content; no independent design role.                                                                                                       |

Original byte sizes recorded during inspection: 1,348,230; 4,430,216; 6,111,144; 1,207,722; 1,292,105; 1,292,105 respectively. No source has been altered by this implementation.

## Generation prompts

Exterior template: “Use case: photorealistic-natural. Asset type: premium hospitality website photography. Primary request: [scene]. Style/medium: premium architecture magazine photography, natural textures, believable scale, crisp high resolution, restrained cinematic color. Composition/framing: wide landscape 3:2 image. Constraints: fictional property, not depicting any real hotel. No people, text, logos, watermarks or brands.”

- Alpine: Dramatic contemporary timber and stone alpine cabin with huge glass living room facing rugged Dolomites mountains, pine trees, soft amber dusk. Architecture centered and to the right, dark calmer left side suitable for cream headline overlay.
- Coast: White minimalist coastal villa on a Mediterranean cliff, cobalt sea, olive trees, sunlit travertine terrace and pool, Mallorca atmosphere.
- Desert: Sculptural earthen terracotta desert courtyard retreat in Agafay Morocco, soft sunrise, private dipping pool and linen shade.
- Forest: Charred timber Scandinavian forest cabin among dense tall pines beside a still lake, warm window light and quiet mist.

Interior template: same style and constraints, asset type “premium hospitality website interior gallery photography”; framing “wide landscape 3:2 image, architectural interior photography with straight verticals and realistic perspective.”

- Alpine: Warm contemporary alpine cabin bedroom suite in the Dolomites. Exposed natural timber beams and walls, limestone details, cream linen bed, large dark-framed glass window looking to rugged alpine mountains and pine forest at amber dusk.
- Coast: White minimalist Mediterranean coastal villa bedroom suite in Mallorca. Sunlit limewash walls, natural pale stone floors, soft linen bed, wide glass doors to a travertine terrace overlooking cobalt sea, olive foliage outside.
- Desert: Sculptural earthen terracotta desert retreat bedroom in Agafay Morocco. Clay plaster walls, soft linen bed, arched opening overlooking stony desert hills at sunrise, restrained handcrafted timber furniture and woven rug.
- Forest: Quiet Scandinavian forest cabin bedroom interior in Harads. Dark timber walls and pitched ceiling, natural linen bed, warm lamplight, expansive glass overlooking tall pine trees beside a still misty lake at dawn.
