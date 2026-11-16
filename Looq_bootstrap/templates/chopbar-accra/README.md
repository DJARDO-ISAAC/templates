# Abusua Pot: chop bar website template

A 6-page Bootstrap 5.3 site for a Ghanaian chop bar, styled like a hand-painted roadside signboard.

## Run it

```sh
npm run dev -- chopbar-accra     # http://localhost:8000/chopbar-accra/
npm run build -- chopbar-accra   # production files in dist/chopbar-accra/
```

## Pages

`index.html` (home) · `menu.html` · `story.html` · `catering.html` · `visit.html` · `404.html`

Shared pieces are in `partials/`: header, footer, `<head>`, icons, page hero, CTA, **today's pots** board and **build your bowl** builder.

## Daily update: today's pots (no rebuild needed)

Edit `assets/today.json` on the live site each morning:

```json
{ "updated": "2026-11-06T09:30:00Z",
  "note": "Akrantie is back!",
  "pots": [ { "name": "Palm nut soup", "detail": "With akrantie", "status": "few" } ] }
```

`status` is `available`, `few` or `finished`. The board on the home page reads this file every time someone visits.

## Other edits

- **Name, phone, WhatsApp, address, hours, MoMo, delivery links, map:** `site.json`. The "Open now / Closed" status uses the `hours` values and always works in Accra time.
- **Menu prices:** `menu.html`, plus the `data-price` values in `partials/bowl-builder.html` so the builder's total matches.
- **Hours table on the Visit page:** `visit.html` (keep it in step with `site.json`).
- **Forms (catering, contact):** replace `YOUR_FORM_ID` in `site.json` → `forms` with a Formspree (or similar) endpoint. Until then they run in demo mode.

## How WhatsApp ordering works

The bowl builder adds up the order and writes a message like:

```
Hello Abusua Pot! I'd like to order:
2 × Banku & Okro stew
  + Tilapia
Pepper: Ghana hot
Pickup · Name: Kofi
Total: GH₵ 130
```

"Send order on WhatsApp" opens WhatsApp with that message addressed to the number in `site.json`. No server or payment system is needed; staff confirm and take MoMo or cash.

## Before going live

Replace the placeholder name, story, staff, reviews, prices, phone numbers, MoMo ID, address and map pin. Photos are hot-linked from Pexels: swap in your own food photos in `assets/images/`.
