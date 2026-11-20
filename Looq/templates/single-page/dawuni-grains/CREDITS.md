# Credits

## Inspiration

The two-audience idea (one business serving both farmers and buyers) comes from [Complete Farmer](https://www.completefarmer.com/), a Ghanaian agritech platform. No layout, wording, branding or assets were copied.

## Photography

All photos come from Pexels and are used under the [Pexels License](https://www.pexels.com/license/). Several were taken in Uganda, Nigeria and elsewhere, not in northern Ghana. Replace them with the client's own photos of their farmers, warehouse, trucks and field officers before going live.

| File | Pexels photo |
|---|---|
| warehouse.webp | https://www.pexels.com/photo/40958790/ |
| drying.webp | https://www.pexels.com/photo/11171729/ |
| threshing.webp | https://www.pexels.com/photo/29118168/ |
| hands-maize.webp | https://www.pexels.com/photo/38668658/ |
| bagging.webp | https://www.pexels.com/photo/40608197/ |
| loading.webp | https://www.pexels.com/photo/30674793/ |
| tractor.webp | https://www.pexels.com/photo/5379340/ |
| farmer-woman.webp | https://www.pexels.com/photo/15897037/ |
| crop-maize.webp | https://www.pexels.com/photo/29746992/ |
| crop-soya.webp | https://www.pexels.com/photo/36171801/ |
| crop-sorghum.webp | https://www.pexels.com/photo/36169263/ |

## Typefaces

All are self-hosted variable WOFF2 files under the SIL Open Font License 1.1:

- **Shantell Sans** by Shantell Martin and Arrow Type: headings
- **Inter** by Rasmus Andersson: body text
- **Big Shoulders Stencil** by Patric King: lot tags, prices and figures

## Artwork

The logo mark, icons, favicon, the perforated bag-tag stub and the animated season scene in the hero (dusk sky, baobab, shea trees, a Dagomba-style compound, plough, rain, maize, sacks and truck) are original CSS and SVG.

## Content

Dawuni Grains, its staff, farmers, quotes, figures, phone numbers, email, Ghana Post GPS address and domain are fictional; the page is a design template. A web search in November 2026 found no company of that name.

The business model is real and common in northern Ghana: aggregators buy grain from smallholders and run outgrower schemes that give inputs on credit, repaid in bags at harvest. Research shows some schemes leave farmers with little after repayment (for example 21–25 bags of 50 kg per acre in one IFPRI study of Upper West maize schemes), which is why this template puts the repayment calculator up front.

Before a client goes live, confirm with them:

- **Prices and packages.** The board prices, the per-acre package values, the 10% service charge and the expected yields in `main.js` (`crops`) are illustrative. Update them every season, and keep the board, the calculator and the FAQ consistent.
- **Quality specs.** Moisture, foreign matter, broken grain and aflatoxin limits should match the client's contracts and current Ghana Standards Authority and Ghana Grains Council grades.
- **Memberships and insurance.** Only keep "Member of the Ghana Grains Council", "GGC grade" and the GAIP weather-index insurance claims if they are true for the client.
- **Season dates.** The season track uses the single rainy season of the Northern Region. A client in the south (two rainy seasons) needs different phases in `main.js` and in the page.
- **Forms.** Both forms only validate in the browser. Connect them to the client's form handler or email service.
