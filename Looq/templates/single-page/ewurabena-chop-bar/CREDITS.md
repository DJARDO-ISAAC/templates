# Ewurabena's Chop Bar — credits and launch checklist

Wave 1 template for **Restaurants (menu)** (archetypes A brochure + B lead generation + D catalogue/menu): a chop bar in Asafo, Kumasi.

## Content is fictional
Ewurabena's Chop Bar, its prices, soup rotation, catering terms, phone numbers, email, directions and Ghana Post GPS code are made up. A web search (Nov 2026) found no chop bar with this name (note: "Maame Serwaa Chop Bar" is a real Kumasi business and was avoided).

## How the dynamic parts work
- **Today's soups:** the week grid is plain HTML; `main.js` highlights today using the Africa/Accra weekday and rewrites the heading. Edit the soups in `index.html`.
- **Order builder:** each menu item's `+` button carries `data-add`, `data-name` and `data-price`. The order panel opens `wa.me/<number>?text=...` with the order, total, pickup time and name. Nothing is stored on the website.

## Before a client goes live
- [ ] Replace name, phone, WhatsApp number (also in the `wa.me` links), email, directions and GPS code.
- [ ] Replace the menu, prices and the weekly soup rotation.
- [ ] Confirm opening hours (`data-hours` on the hero pill and the hours table).
- [ ] Confirm catering terms (price per head, delivery areas, notice period).
- [ ] Connect the catering quote form (`action` + `data-endpoint="ajax"`).
- [ ] Replace placeholder photos with the client's own food and premises.

## Photos (Pexels License, placeholders)
| File | Pexels photo |
|---|---|
| hero-pounding.jpg | https://www.pexels.com/photo/27946460/ |
| fufu-prep.jpg | https://www.pexels.com/photo/12924181/ |
| jollof-plantain.jpg | https://www.pexels.com/photo/17952746/ |
| waakye.jpg | https://www.pexels.com/photo/32612769/ |
| stew-greens.jpg | https://www.pexels.com/photo/37648018/ |
| grilled-fish.jpg | https://www.pexels.com/photo/20067063/ |
| bofrot.jpg | https://www.pexels.com/photo/34943603/ |
| kenkey-prep.jpg | https://www.pexels.com/photo/16236507/ |
| kumasi-street.jpg | https://www.pexels.com/photo/18087268/ |

## Typefaces
Young Serif (headings) and Rethink Sans (body), SIL Open Font License 1.1, self-hosted.
