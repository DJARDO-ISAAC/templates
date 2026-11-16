# Header

The site header: `<header class="site-header" data-header>` containing a `.bar` with the logo, the main nav, utility actions and the menu button, plus the mobile `.menu-panel`.

## Variants

- Default: a floating pill bar (`radius-full`) that sticks 10px from the top.
- `.header-strip`: a full-width strip with a bottom hairline.
- `.header-overlay`: transparent with light text over a `.hero-bleed`, turning solid (`surface`) once `.is-stuck` or while the menu is open.

The order logo → nav → actions stays the same in every variant.

## Behaviour (main.js)

- `[data-header]` gets `.is-stuck` after scrolling and `.menu-open` while the menu is open.
- `[data-menu-button]` with `aria-controls="menu-panel"` toggles `.menu-panel.is-open`, keeps `aria-expanded` and the label ("Open menu"/"Close menu") in sync, makes the closed panel `inert`, closes on Escape and returns focus.
- The current item has `aria-current="page"` (multi-page) or `aria-current="true"` via `data-nav` (one-page).

## Rules

- A skip link (`<a href="#main" class="skip">`) comes before the header on every page.
- Show the main nav on desktop; collapse to the menu button below `lg`.
- One primary action in the bar ("Book a free consultation", "Order now"); a phone link is optional.
