# Nyansa Hill Academy: school website template

A multi-page Bootstrap 5.3 site for a Ghanaian basic school (KG 1 to JHS 3).

## Run it

From the project root:

```sh
npm run dev -- ghana-basic-school     # build, watch and serve at http://localhost:8000/ghana-basic-school/
npm run build -- ghana-basic-school   # production build into dist/ghana-basic-school/
```

Upload the contents of `dist/ghana-basic-school/` to any static host (Netlify, cPanel, GitHub Pages).

## Files

| File | What it is |
|---|---|
| `index.html` | Home page |
| `about.html`, `academics.html`, `admissions.html`, `news.html`, `news-article.html`, `calendar.html`, `gallery.html`, `contact.html`, `privacy.html`, `404.html` | The other pages |
| `partials/` | Shared pieces inserted into pages by the build: header, footer, `<head>`, icons, tour pop-up, CTA, class finder, testimonials, news and staff cards |
| `site.json` | School details used on every page: name, phone, email, address, social links, form endpoints, payment details, map |
| `theme.scss` | Colours, fonts and all custom styles |
| `main.js` | Animations, class finder, forms, filters, gallery |
| `assets/` | Fonts, favicon, and `calendar-2026-27.ics` |

## Common edits

- **Change the phone, email, address, payment details or social links:** edit `site.json`. Every page updates on the next build.
- **Change the menu or footer:** edit `partials/header.html` or `partials/footer.html` once.
- **Add a news story:** copy `news-article.html` to a new file (for example `news-robotics.html`), change the text, then add a card to `news.html` with `<!-- include:news-card.html href="./news-robotics.html" ... -->`.
- **Add a staff member:** add a `<!-- include:person.html ... -->` line to the staff grid in `about.html`.
- **Update term dates:** edit `calendar.html`, `assets/calendar-2026-27.ics` and `term1Start` in `site.json`.

Inside pages and partials, `{{ site.phone }}` is filled from `site.json`, and `<!-- include:name.html key="value" -->` inserts a partial, where `{{ key }}` becomes `value`. The build fails with a clear message if a placeholder or partial is missing.

## Make the forms work

All four forms (tour booking, application, contact, newsletter) post to the URLs in `site.json` → `forms`.

1. Create a free form at [formspree.io](https://formspree.io) (or a compatible service) for each form.
2. Replace each `https://formspree.io/f/YOUR_FORM_ID` with your form's URL.
3. Rebuild.

Until then, forms run in **demo mode**: they validate and show the thank-you message, but nothing is sent.

## Before going live

- Replace every placeholder: school name, logo, staff, photos, testimonials, results, fees, GES registration number, bank and MoMo details, and the map location in `site.json`.
- Download your own photos into `assets/images/` instead of the hot-linked Pexels images.
- Have `privacy.html` reviewed and register with the Data Protection Commission, Ghana.
- On your host, set `404.html` as the not-found page.
