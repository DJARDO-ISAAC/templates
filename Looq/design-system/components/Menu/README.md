# Menu

A restaurant menu in HTML, never only a PDF: `.menu-section` groups (one `h3` each) of `.menu-item` rows with `.menu-name`, `.menu-price`, an optional `.menu-desc` and `.menu-tags` of `.diet` labels.

## Variants

- List (default): name and price on one line, dotted rule between items. Quiet; suits fine dining and cafés.
- `.menu-grid`: cards with a `.menu-img` photo on top. Suits fast food and chop bars where pictures sell.
- `.menu-nav`: a horizontal row of `.chip` anchors to jump between sections on long menus.

## Rules

- Prices in GH₵ (`GH₵ 85`). Mark "market price" or "from" honestly.
- Dietary and allergen tags are words, not colour-coded dots. Include an `.allergen-note`.
- Keep menus current: an out-of-date price list loses trust fast. Offer a printable PDF only as an extra.
