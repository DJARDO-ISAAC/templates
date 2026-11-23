# Inotribe (version C) — design, sources and launch checklist

Version C of the Inotribe site, built from *Inotribe Website — Requirements & Copy Document* (17 Nov 2026) with the same pages, copy, case studies, client list and functional requirements (FR-01 to FR-10) as versions A and B, so the three can be compared side by side.

## How version C differs

| | Versions A and B | Version C |
|---|---|---|
| Mood | Dark warm grey | Charcoal `#141414` with a fine film grain |
| Colour | Teal and gold accents | Teal and gold as solid blocks (Featured Work half, gold call to action) |
| Type | Google Sans, Google Sans Flex | Satoshi headlines, Switzer text, Plex Mono labels |
| Signature | Glows, world map | The key phrase of each headline in gold |
| Shape | Pills and large radii | Square edges, hairline rules |
| Navbar | Floating island (A), split rail (B) | Tab bar with a gold underline on the current page |
| Home | Centred hero over a map | Headline beside an annotated photo (callouts pinned by leader lines, live Accra clock), shipped systems as linked tiles, case studies as hover list rows |
| Process | Rows (A), scroll timeline (B) | A route: five steps alternate above and below one gold line that fills on scroll |
| About mission | Quote over a map | "Trusted by" in the centre of two rings, the eight clients spread around it, then the mission quote |
| Work page | Cards (A), challenge flow (B) | Spec sheets beside a sticky contents list |

Version C follows the brief's dark direction and palette, but with its own type, layouts and signature.

**Departure from the brief (section 6.2):** the About headline drops the inline gold pill shape ("Software engineering and [pill] beyond"); it reads "Software engineering and *beyond*", with "beyond" in the gold serif instead.

Contrast on `#141414`: ink 16.6:1, body text 10.8:1, muted text 6.9:1, gold 8.9:1, teal text (`#5fb6c6`) 7.5:1, white on the teal fill 5.0:1, charcoal on gold 8.9:1. Teal `#1f7a8c` is used only as a fill.

## Where to edit things

| What | Where |
|---|---|
| Navbar, mobile menu, footer, scroll ring | `main.js`, the *Inotribe version C* block (`LINKS`, footer markup) |
| Social links, contact email and phone, Web3Forms key | `main.js`, the `SITE` object |
| Shipped systems row | `index.html`, the `.shipped-row` list |
| Case studies (Work) | `assets/data/case-studies.json` (add an object to add a spec sheet) |
| Testimonials (About) | `assets/data/testimonials.json` |
| Colours, fonts, components | `theme.css` |

Build conventions are the same as version B: the Looq root build (Tailwind v4) compiles `theme.css`, one `main.js` holds the shared behaviour plus the Inotribe block, data lives in `assets/data/`, and links are clean URLs.

## Sources and licences

- **Typefaces:** Satoshi and Switzer (Fontshare Free Font License) and IBM Plex Mono (SIL Open Font License 1.1), all self-hosted in `assets/fonts/` from the Looq design system and Google Fonts.
- **UI icons:** Tabler Icons webfont 3.31 from jsDelivr, MIT.
- **Capability icons (Home):** Tabler Icons line icons (MIT, already loaded for the UI): devices, database, plug-connected, satellite, fingerprint, topology-star-3. They replaced the 3D icons, which clashed with the flat style and did not match each subject.
- **Logo:** supplied by Inotribe (`logo-color.png`); `logo-white.png` is the same mark in white, used in the footer as the brief specifies.
- **Photos:** Pexels License, the same placeholders as version B. Replace them with real team and office photography.

| File | Pexels photo |
|---|---|
| about-team.jpg | https://www.pexels.com/photo/30677714/ |
| about-build.jpg | https://www.pexels.com/photo/19805876/ |
| about-review.jpg | https://www.pexels.com/photo/9301248/ |
| about-support.jpg | https://www.pexels.com/photo/1181330/ |
| about-capability.jpg | https://www.pexels.com/photo/5483158/ |
| services-offered.jpg | https://www.pexels.com/photo/1181243/ |
| contact-hero.jpg | https://www.pexels.com/photo/3869649/ |
| case-data-warehouse.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/lVZjvw-u9V8 (@ismailenesayhan) |
| case-geospatial.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/VBNb52J8Trk (SpaceX (@spacex)) |
| case-identity.jpg | https://www.pexels.com/photo/17155842/ |
| case-distributed.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/PSpf_XgOM5w (Scott Rodgerson (@scottrodgerson)) |
| testimonial-1.jpg | https://www.pexels.com/photo/36053652/ |
| testimonial-2.jpg | https://www.pexels.com/photo/29852895/ |
| testimonial-3.jpg | https://www.pexels.com/photo/38670854/ |

## Before launch (brief sections 9 and 11)

- [ ] **Web3Forms key:** request it with team@inotribe.com and set `SITE.WEB3FORMS_ACCESS_KEY` in `main.js`. While it is empty, sending shows the error message (FR-08 behaviour).
- [ ] **Contact details:** confirm team@inotribe.com is the public address; set `SITE.phone` to show a number.
- [ ] **Social links:** set the LinkedIn, X and GitHub URLs in `SITE.social` (they point to `#` until then).
- [ ] **Testimonials:** replace the three placeholders in `assets/data/testimonials.json` with approved client quotes.
- [ ] **Claims to confirm (open item 2):** "Founded by engineers who've built for financial institutions and governments"; the "1 National-scale deployment" stat; Senior Engineers; the differentiator, services and "What sets us apart" card text; the five-step process (Discover, Design, Research, Build, Deliver & Support; Research was added to the brief's four steps and its line is our wording).
- [ ] **Version C wording to confirm:** the Work page heading and the hero badge ("4 core solutions shipped for 8 institutions").
- [ ] **Illustrative API request:** the Featured work code sample is labelled illustrative; confirm Inotribe is happy to show the Data Access Manager this way, or remove it.
- [ ] **Sector tag (open item 3):** "Government / Geospatial" on the cross-border case study.
- [ ] **Client names (open item 4):** written permission to show all eight, including the Government of Ghana.
- [ ] **Photography:** replace every Pexels placeholder.

## Logos

- **Client logos** (Home "Institutions that build with Inotribe" tiles, About "Trusted by" chips): supplied by Inotribe; cleaned copies in `assets/logos/clients/`. Tiles link to each client's site in a new tab: solisfinance.com, globalpayex.com, petraonline.com, bsystemslimited.com, ghana.gov.gh, neebal.com, hanfie.com. neebal.com and hanfie.com still need confirming; Liquid Financial has no site link, and Neebal, Hanfie and Liquid have no logo yet, so they show their name.
- **Tech stack logos** (Home marquee): official logos from Devicon (https://devicon.dev, MIT) in `assets/logos/`. They are trademarks of their owners, used only to name the tools Inotribe works with.
