# Inotribe — credits, deviations and launch checklist

Built from *Inotribe Website — Requirements & Copy Document* (17 Nov 2026). Every page, section, piece of copy and functional requirement (FR-01 to FR-10) in that document is implemented. This file lists the sources used, where the build follows Looq conventions instead of the document's tooling notes, and what must be replaced before launch.

## Where to edit things

| What | Where |
|---|---|
| Navbar, mobile menu, footer, scroll-to-top | `main.js`, the *Inotribe template behaviour* block (`LINKS`, footer markup) |
| Social links, contact email, Web3Forms access key | `main.js`, the `SITE` object at the top of that block |
| Case studies (Work page) | `assets/data/case-studies.json` (add an object to add a case study) |
| Testimonials (About page) | `assets/data/testimonials.json` |
| Colours, fonts, corners, components | `theme.css` |

## Deviations from the document's technical notes (sections 2, 5 and 10)

The site is a Looq template, so it uses the Looq build instead of its own toolchain. What the visitor sees and every functional requirement are unchanged.

| Document | This build | Why |
|---|---|---|
| Own `package.json`, `tailwind.config.js`, Tailwind v3 CLI, `css/input.css` → `css/output.css` | `theme.css` compiled by the Looq root build (Tailwind v4) to `css/styles.css` | Looq templates share one build. The doc's colour names are still defined, so `bg-background`, `text-text-primary`, `text-text-muted`, `border-border` and `bg-primary` all work. |
| `js/components.js`, `testimonials.js`, `contact-form.js`, `case-studies.js` | One `main.js`: the shared Looq behaviour, then the Inotribe block with the same features | Looq ships one script per template. Navbar and footer are still defined once and injected on every page (FR-01). |
| `data/*.json` | `assets/data/*.json` | Looq copies `assets/` into the build. |
| Links to `about.html`, `work.html` … | Clean URLs (`about`, `work`) | Looq convention. Cloudflare Pages, Netlify and Vercel serve them automatically. |
| Fonts from Google Fonts | Same Google Sans and Google Sans Flex files, self-hosted in `assets/fonts/` | Faster, no third-party request, and the template works as a single zip. |
| Feature icons from 3dicons.co | Replaced by flat Tabler icons (devices, database, plug-connected, satellite, fingerprint, topology-star-3), the same set as version C | The 3D PNGs had solid white backgrounds that showed as white squares on the dark page. |
| World map from FreeSVG | Generated with the open-source `dotted-map` library into `assets/images/world-map-dots.svg` | The FreeSVG download could not be confirmed (doc §9 flags this). The generated file is our own. |
| No privacy checkbox or privacy page | Still none; a short privacy notice opens in a dialog from the form | Looq requires a privacy link next to every form, and it addresses open item 7 without adding a page. |

Open item 6 (heading colour mismatch) is resolved: all headings use the near-white `text-primary` token. Teal (`#1f7a8c`) is used only as a fill, because as text on the page background it is 3.4:1; teal text uses `brand-strong` (`#6cbccc`) instead.

## Sources and licences

- **Typefaces:** Google Sans and Google Sans Flex, SIL Open Font License 1.1 (confirmed on Fontsource/Google Fonts, Nov 2026). This settles the doc's open licensing question.
- **Client logos (Home "Trusted by", and About under the testimonials):** supplied by Inotribe in `assets/logos/companies/`. Cleaned copies (white background removed, trimmed) are in `assets/logos/clients/`, copied from version B. Each tile links to the client's site in a new tab: Solis (solisfinance.com), GlobalPayEx (globalpayex.com, same logo as the site), Petra (petraonline.com), Bsystems (bsystemslimited.com), Government of Ghana (ghana.gov.gh). Hanfie Technologies (app.dev.hanfie.com, the link Inotribe gave) uses the logo Inotribe supplied (`hanfie.png`, trimmed). Liquid Financial uses the logo Inotribe supplied (`companies/Liquid.jpeg`, cut out from its grey background as `liquid.png`); it has no site link yet. Neebal Technologies uses the logo Inotribe supplied (`companies/Neebal.png`, white); `neebal.png` is a near-black copy so it shows on the light tiles.
- **Tech stack logos (Home "Tools we build with"):** official logos as SVGs from Devicon (https://devicon.dev, MIT), saved in `assets/logos/`. Copied from version B. The near-black Django, Next.js and WordPress marks are shown inverted (their light versions) on the dark tiles. The logos are trademarks of their owners and are used only to name the tools Inotribe works with.
- **UI icons:** Tabler Icons webfont 3.31 from jsDelivr, MIT.
- **Capability icons (Home):** Tabler Icons (same webfont as the UI icons), MIT.
- **Logo:** supplied by Inotribe (`logo-color.png`); `logo-white.png` is the same mark recoloured white.
- **World map:** generated with `dotted-map` (MIT).
- **Photos:** Pexels License. All are placeholders; replace them with real team and office photography.

| File | Pexels photo |
|---|---|
| about-hero-1.jpg | https://www.pexels.com/photo/19805876/ |
| about-hero-2.jpg | https://www.pexels.com/photo/30677714/ |
| about-hero-3.jpg | https://www.pexels.com/photo/9301248/ |
| about-hero-4.jpg | https://www.pexels.com/photo/1181330/ |
| about-capability.jpg | https://www.pexels.com/photo/5483158/ |
| services-hero.jpg | https://www.pexels.com/photo/6804068/ |
| services-offered.jpg | https://www.pexels.com/photo/1181243/ |
| contact-hero.jpg | https://www.pexels.com/photo/3869649/ |
| case-data-warehouse.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/lVZjvw-u9V8 (@ismailenesayhan) |
| case-geospatial.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/VBNb52J8Trk (SpaceX (@spacex)) |
| case-identity.jpg | https://www.pexels.com/photo/17155842/ |
| case-distributed.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/PSpf_XgOM5w (Scott Rodgerson (@scottrodgerson)) |
| cap-software.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/kwzWjTnDPLk (@disruptxn). Home capabilities 01: two developers coding together |
| cap-data.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/fImCPTZ026U (@tonymarinescu). 02: rows of server cabinets in a data hall |
| cap-integration.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/40XgDxBfYXM (@jouwdan). 03: network patch panel with cables plugged in |
| cap-geospatial.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/ZuN44o80Bn0 (@usgs). 04: satellite view of a West African river delta and islands |
| cap-identity.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/CqSpoJs2ehg (@shaikhulud). 05: face-recognition access terminal |
| cap-distributed.jpg | Unsplash, Unsplash License: https://unsplash.com/photos/iYnpYeyu57k (@matthieu_cabri). 06: a wall of servers |
| testimonial-1.jpg | https://www.pexels.com/photo/36053652/ |
| testimonial-2.jpg | https://www.pexels.com/photo/29852895/ |
| testimonial-3.jpg | https://www.pexels.com/photo/38670854/ |

The doc's mismatched file names for the warehouse and identity images (Home vs Services) are fixed: both pages use `case-data-warehouse.jpg` and `case-identity.jpg`.

## Before launch (doc sections 9 and 11)

- [x] **Web3Forms key:** set in `SITE.WEB3FORMS_ACCESS_KEY` in `main.js`. Messages go to the inbox the key was created with. Optional: in the Web3Forms dashboard, restrict the key to the live domain so it cannot be used from other sites.
- [ ] **Contact details:** the Email block shows team@inotribe.com (the address the doc names for form delivery); confirm it is the public address. Set `SITE.phone` in `main.js` to show a phone number; until then the Phone block invites visitors to ask for a call back.
- [ ] **Social links:** set the LinkedIn, X and GitHub URLs in `SITE.social`. They point to `#` until then; the mail icon already goes to team@inotribe.com.
- [ ] **Testimonials:** replace the three placeholder quotes, names, titles and portraits in `assets/data/testimonials.json` with approved client quotes.
- [ ] **Claims to confirm (open item 2):** "Founded by engineers who've built for financial institutions and governments"; the "1 National-Scale Deployment" stat; Senior Engineers; the differentiator and "What sets us apart" card text; the four-step process; and the one-line descriptions written for those cards.
- [ ] **Sector tag (open item 3):** "Government / Geospatial" on the cross-border case study, on Home and Work.
- [ ] **Client names (open item 4):** written permission to show all eight, including the Government of Ghana; add logo files when available.
- [ ] **Photography:** replace every Pexels placeholder with real Inotribe photos.
- [ ] **Buzzword copy changes:** "mission-critical" was replaced on Home (hero line: "the software institutions depend on"; capabilities heading: "Engineered for systems people depend on"), and About's "handled end to end" now reads "one team designs, builds and supports it". Confirm with Inotribe.
- [ ] **Contact intro (copy change):** the doc's line "We'd love to hear from you. Send us a message and we'll reply soon." was replaced with "Tell us what the system has to do and what happens if it fails. One of our engineers will reply." because the original is a stock phrase. Confirm with Inotribe.
- [ ] **Privacy notice:** check the dialog text on the Contact page with Inotribe.
