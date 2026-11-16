# Using the system in a template

## New templates

- `npm run new <slug>` or `npm run new <category>/<slug>` scaffolds a template from the system: `theme.css` from a theme starter (all token names, fonts and the component classes), the shared `main.js`, a page with skip link, header, hero, footer and privacy dialog, and `meta.json`. Add `--theme=<id>` to start from another theme's values (for example `--theme=boateng`).
- Then make it yours: change the token values, pick variants, arrange the sections (see Section recipes), and add template-specific CSS for anything the system does not cover.

## Existing templates

Existing templates are migrated one at a time, without changing how they look:

- Add the shared colour names in `@theme`, pointing them at the template's current colours (for example `--color-brand: #b4471f;` where the template used `clay`). Keep the old names as aliases until the markup is updated.
- Rename the font roles to `display`, `sans` and `accent`.
- Swap hand-written components for the shared classes where they match (`.btn`, `.field`, `.acc`, `.svc`…), keeping template-specific styling as an extra class.
- Replace the template's `main.js` features with the shared ones, keeping template-only behaviour (sliders, filters) below them.
- Run `npm run check <slug>` until it reports nothing missing.

## Checking

`npm run check [slug ...]` reports, per template:

- missing shared colour tokens and font roles in `theme.css`;
- missing skip link, single `h1`, `main#main`, `data-header`, `data-menu-button`;
- forms without `data-form`, a honeypot, or a privacy link;
- `tel:` links not in international format, and WhatsApp links not using `wa.me`.

It warns; it does not fail the build. Templates that predate the system will show warnings until they are migrated.

## Downloads

The design system page offers a `theme-<id>.css` starter per theme, `tokens.json`, `components.css`, the reference `main.js` and a zip of everything.
