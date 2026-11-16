# ContactDetails

How to reach the business, in the order people use it in Ghana: phone, WhatsApp, email, address. `.contact-list` rows (icon + text), `.hours` table and an `.open-now` status driven by `data-hours`.

- Phones: show local format (`024 555 0187`), link international (`tel:+233245550187`).
- WhatsApp: `https://wa.me/233…` with a short prefilled message; only if someone monitors it.
- Address: street, area and city, plus the Ghana Post GPS digital address and a landmark ("opposite …").
- Hours: weekly plus public holidays; keep them identical to the Google Business Profile. `data-hours` uses day numbers (0 = Sunday) and Africa/Accra time; the text inside is the no-JS fallback.
- The same details feed the header, footer and `LocalBusiness` structured data: one source of truth.
