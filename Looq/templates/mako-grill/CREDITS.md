# Mako Grill — sources, inspiration and launch checklist

A Wave 1 restaurant template (archetypes A and B): a menu-led site for a fast-casual charcoal grill with two branches in Accra. Mako Grill is a fictional business; every name, number and review below is a placeholder to replace.

## Inspiration

Layout ideas (promo cards, round dish photos, tabbed menu, scrolling word band, deal countdown, info band above the footer) come from the FreshEat Next.js theme demo. Screenshots of all 29 of its pages, at 1440 px and 390 px, are in `inspiration/desktop/` and `inspiration/mobile/`. The build copies only `.html` files and `assets/`, so they are never published.

Nothing is copied from it: the copy, colours, type, photos, logo and code are our own, and Wave 2 parts of the theme (cart, checkout, shop, table booking) are left out on purpose.

## Where to edit things

| What | Where |
|---|---|
| Pages | Plain HTML. The header, footer, order dialog and privacy notice are repeated on every page, so change them on all seven. |
| Menu items, prices, spice level, allergens | `menu.html` (each `<li class="m-row">`) and the menu board on `index.html` |
| Opening hours (open-now status) | `data-hours` on the top strip, the hero and each branch card (0 = Sunday, Accra time) |
| Weekend countdown | `data-countdown data-day="0" data-time="22:00"` on `index.html` |
| Colours, fonts, components | `theme.css` |
| Tabs, menu filters, countdown | `main.js`, the *Mako Grill* block at the end |

## Replace before launch

- Phone and WhatsApp numbers (`055 000 0101`, `055 000 0202` and the `wa.me` links)
- Email `hello@makogrill.com.gh`
- Ghana Post GPS addresses on the Contact page
- Social links (they point to the platforms' home pages)
- Bolt Food and Glovo links: point them at the restaurant's own store pages
- Google review quotes and the 4.6 average: use real reviews, with permission
- Names and photo of the head cook and catering contact
- The forms show a demo success message: connect an endpoint (`action` + `data-endpoint="ajax"`)
- FDA permit wording in the footer, if the permit number should be shown

## Photos

All photos are from Wikimedia Commons. Authors and licences are listed on the site's Photo credits page (`credits.html`), which CC BY and CC BY-SA require. Photos were resized to 1600 px and re-encoded; that is the only change.

The footer corner photos (`lime.webp`, `pepper-*.webp`) are transparent cut-outs from Wikimedia Commons, shown unchanged and dimmed with CSS; they are credited on the Photo credits page. The logo was drawn for this template.

## Fonts and icons

- Archivo (variable, width 62–125%, weight 100–900), SIL Open Font License, self-hosted from Google Fonts in `assets/fonts/` (Latin and Latin Extended, for the cedi sign ₵)
- Tabler Icons webfont 3.31, MIT licence, from jsDelivr
