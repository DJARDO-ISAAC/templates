# Identity: what is shared, what is yours

Looq has many templates per industry (a fine-dining restaurant, a fast-food chain, a café and a chop bar can all be restaurant templates). They share one system, yet each must look like its own business. Differences live in three layers.

## Layer 1: token values

Every template defines every token name in this system and chooses its own values.

- **Colour:** all 24 colour roles (`canvas`, `surface`, `ink`, `brand`, `accent`, `night`, `overlay`, `whatsapp`…). A template may add extra colours (Asanka adds `gold`, Thres adds zone colours) but never renames or drops a shared one.
- **Type:** the `display`, `sans` and optional `accent` font roles, plus `displayWeight`. A sharp serif for a law firm, a condensed grotesk for a chop bar, a soft serif with handwriting for a founder-led practice.
- **Shape and space:** `radius-*` (square, soft or pill), `shadow-*`, `frame` (edge-to-edge or an inset, rounded page), `wrap-max`, `section-y`.
- **Motion:** the two curves and three durations are shared; how much a template animates is its choice.

Changing one template's values never affects another: values live in that template's `theme.css`.

## Layer 2: component variants

The same component can take different shapes. Variants are named so templates can pick them without inventing new markup:

- **Hero:** split, centred, bleed (photo with overlay), plus a template's own variant (arch photo, headline slider).
- **Header:** floating pill, strip, overlay.
- **ServiceCard:** icon, photo, overlay.
- **Menu:** list, photo grid, with section chips.
- **Eyebrow:** marker or pill.

A template can restyle a component further in its own CSS (an arched image, a ticket-shaped card), but keeps the class names, the parts, the `data-*` hooks and the accessibility behaviour.

## Layer 3: layout and composition

Which sections appear, in what order, and how they are arranged is a template decision, not a token. Fine dining opens on atmosphere and reservations; fast food opens on deals and "Order now". The section recipes guide lists sensible orders per industry and archetype; templates may reorder and combine them.

## Rules that never change

- One `h1` per page, a skip link, semantic landmarks, visible focus, 44px tap targets, WCAG 2.2 AA contrast (fix failures in the template, not by re-tinting the system).
- Real content: real business details, honest prices, genuine reviews and credentials. No lorem ipsum, no fake ratings.
- Self-hosted, open-licensed fonts (Google Fonts, Fontshare). No CDN links.
- Behaviour through the shared `main.js` hooks, so a fix to the form or menu applies everywhere.
