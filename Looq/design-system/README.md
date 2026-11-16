Looq is one design system shared by many website templates. Every template uses the same **names**: token names, type roles, component classes, JavaScript hooks and page anatomy. Each template chooses its own **values**: colours, typefaces, radii and motion. A restaurant and a law firm should look nothing alike, yet anyone who has worked with one Looq template can work with all of them, and a buyer can rebrand one by editing about twenty tokens.

The themes on this page show that. **Looq Base** and **Looq Base Dark** are the defaults a new template starts from. **Asanka**, **Lexvoran**, **Bank 5**, **Thres Training Club**, **Boateng Advisory** and **Kwan Consulting** are real Looq templates whose palettes, fonts and radii are mapped onto the shared names. Switch theme to see the same components rebranded, including their typefaces.

Templates differ in three layers: **token values** (colour, type, shape, motion), **component variants** (a split, centred or full-bleed hero; a list or photo-grid menu) and **layout** (which sections, in what order). The guides below explain each layer, the Ghana conventions every template follows, starting section recipes per industry, and how to adopt the system.

## How a template uses Looq

Templates stay self-contained. Looq is copied into a template, never imported: no shared stylesheet, no runtime dependency, and every template still ships as its own zip. `npm run new <slug> [--theme=<id>]` scaffolds the files below from a theme; after that, the template owns them. `npm run check [slug]` reports what a template is missing from the system.

```
templates/<slug>/
  index.html  about.html …   pages; link ./css/styles.css and ./js/main.js (defer)
  theme.css                  @import "tailwindcss"; @font-face; @theme tokens; @layer components
  main.js                    the shared reference main.js; behaviour wired through data-* hooks
  meta.json                  slug, name, industry, type, archetype, tags, description, designSystem, tailwindVersion
  assets/images/  assets/fonts/
```

The system itself:

```
design-system/
  tokens.json        every token, one value per theme; fonts and heading weight per theme
  components.css     the shared component classes (.btn, .field, .svc, .plan, .menu-item, .action-bar …)
  main.js            the shared behaviour (header, menu, reveal, FAQ, forms, dialogs, open-now …)
  components/<Name>/ preview.html + README.md for each component and its variants
  guides/*.md        identity, Ghana conventions, section recipes, adoption
  fonts/             woff2 files for every theme
```

Every token on this page becomes a Tailwind `@theme` variable. Colours are prefixed `--color-`, which gives the utilities `bg-canvas`, `text-ink`, `border-line`:

```css
@theme {
  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Onest", ui-sans-serif, system-ui, sans-serif;

  --color-canvas: #f6f5f1;   --color-surface: #ffffff;   --color-surface-2: #ecebe5;
  --color-ink: #16161a;      --color-body: #3d3e44;      --color-muted: #62636a;
  --color-line: #dedcd4;     --color-line-strong: #8a8984;
  --color-brand: #0f5c4d;    --color-brand-strong: #0a463b;  --color-on-brand: #ffffff;
  --color-accent: #f0b429;   --color-on-accent: #16161a;
  --color-night: #141518;    --color-night-ink: #f3f2ee;     --color-night-muted: #a9aab0;
  --color-focus: #0f5c4d;    --color-danger: #b42318;        --color-success: #1c7a43;
  --color-warning: #9a5b00;  --color-info: #1f5fa8;
  --color-whatsapp: #1a9e4a; --color-on-whatsapp: #ffffff;   --color-overlay: #16161a8c;

  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 24px; --radius-xl: 40px; --radius-full: 999px;
  --ease-soft: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

- **Keep every name.** A template may add its own extra colours (Asanka adds `gold` and `leaf`, Thres adds `zone-1`…`zone-5`), but it never renames or drops a shared one. Where a template has no distinct value for a role, it points the role at its nearest token (Thres sets `brand` to its ink black).
- **Use token classes, never raw hex**, in HTML: `bg-brand text-on-brand`, not `bg-[#0f5c4d]`.
- In custom CSS, write `var(--color-brand)`. The component CSS on this page writes `var(--brand)` because that is how the design system page names its variables.

## Content fundamentals

- **Real content, never lorem ipsum.** Every template is a believable business with names, prices, hours, addresses and stories, specific to its sector and place (Asanka cooks from five regions of Ghana; Lexvoran is in New York).
- **Plain, warm, direct.** Short sentences. Address the visitor as "you" and the business as "we". No exclamation marks, hype ("revolutionary", "world-class") or filler stats.
- **Sentence case** for headings, buttons, nav and labels. Uppercase comes only from CSS (`.eyebrow`).
- **Buttons start with a verb** and name the outcome: "Book a table", "Get an estimate", "Download the report". Never "Click here", "Submit" or "Learn more" on its own.
- **Numbers are exact and formatted for the locale**: "GH₵ 85", "07:00–22:00", "+233 30 123 4567". Show phone numbers and emails as text as well as links.
- **No emoji** in UI text. Icons are SVG.

## Visual foundations

### Colour
- Pages sit on `canvas`. Cards, inputs and the header bar sit on `surface`. Alternate bands and wells use `surface-2`.
- Text is `ink` for headings, `body` for paragraphs and `muted` for meta. Each text token's usage note lists the grounds it is legible on.
- `brand` is for action: one primary button per view, the active nav item, the selected chip. Coloured text uses `brand-strong`, never `brand`, because `brand` is tuned as a fill.
- `accent` is for highlight (a badge, the second button, a sticker). Keep it under about 10% of the page.
- Dark bands use `night` with `.on-dark`. Text inside switches to `night-ink` and `night-muted`.
- `danger` and `success` always come with an icon or words, never colour alone.
- **Contrast**: text holds 4.5:1 on its grounds (3:1 at 24px+). Borders of controls, focus rings and icons that carry meaning hold 3:1. Where a real template's palette misses this, the value is kept exact and its usage note says so. Fix it in the template, not by re-tinting the system.

### Type
- Three roles: `display` for headings, `sans` for everything else, and an optional `accent` for one expressive touch (a serif, script, handwriting or mono: Asanka's script, Boateng's handwritten notes, Bank 5's italic serif). Never a third typeface for body text.
- Each theme sets its own typefaces for these roles and a `displayWeight` for headings (Lexvoran 400, Boateng 440, Asanka 800). Switch theme on this page to see them.
- Display styles `d-hero`, `d-xl`, `d-lg`, `d-md`, `d-sm` and text styles `lede`, `body`, `small`, `label`, `button`, `eyebrow`. The sizes on this page are at desktop width; each display style is fluid with `clamp()` (see its usage note).
- Exactly one `h1` per page (`d-hero` on home, `d-xl` inside). Visual style and heading level are independent: an `h2` may use `d-md`.
- Body is 17px with a 1.6 line height, at most `measure` (68ch) wide. Ledes are at most 40ch. Use `text-wrap: balance` on headings and `pretty` on paragraphs.
- Fonts are open-licensed (Google Fonts or Fontshare) and self-hosted as woff2 with `font-display: swap`. Preload the display and body files. Never use a CDN font link. Give each template a distinctive display face; Inter is fine as a body face but should not carry the identity alone.

### Space and layout
- 4px base, the same as Tailwind's scale. Card padding is `space-6`/`space-8`, heading-to-content is `space-12`, and sections use `section-y`.
- Every section is `.sec` around one `.wrap` (`wrap-max`, `gutter`/`gutter-md`).
- Mobile first. Breakpoints are Tailwind's (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). A template may move `md`/`lg` to match its source (Lexvoran uses 810/1200).
- No horizontal scroll from 360px to 1920px. Add `overflow-x: clip` on `main` and `footer` for bleeding art.
- Every tappable control is at least `tap-min` (44px) in both directions.

### Shape, borders and shadows
- Radius names are shared and their values belong to each template: Lexvoran is near-square, Asanka and Tamarind use pills and arches. Within a template, buttons, chips and the header bar share one radius (usually `radius-full`), and cards and images share another (`radius-lg`).
- Borders come before shadows. Hairlines are `line`; borders on controls are `line-strong`.
- Shadows are soft, low and tinted by `ink`: `shadow-sm` at rest, `shadow-md` on hover and for the header, `shadow-lg` for dialogs and drawers.

### Imagery
- Use photography of real subjects related to the business. Every image has `width`/`height`, `object-cover` and `loading="lazy"` (except the hero, which gets `fetchpriority="high"`), plus a striped placeholder background while it loads.
- Alt text describes what is in the picture. Decorative images get `alt=""`.
- Image shape is a strong part of a template's identity (Asanka's bowls and arches, Tamarind's tilted capsules). Choose one or two shapes and repeat them.
- Credit stock sources in `assets/images/CREDITS.md`.

### Motion
- Two curves: `ease-soft` `cubic-bezier(0.19, 1, 0.22, 1)` for reveals, panels and hovers, and `ease-spring` `cubic-bezier(0.34, 1.56, 0.64, 1)` for small lifts and icon turns. Three durations: `dur-fast` (200ms), `dur-base` (400ms), `dur-slow` (700ms, reveals only).
- Scroll reveals use `data-reveal`. `main.js` adds `.reveal-pending` only to elements below the fold, so content never starts hidden without JavaScript.
- Everything moving (reveals, marquees, parallax, countdown ticks, hover lifts) stops under `prefers-reduced-motion: reduce`.

### States and focus
- Hover: buttons lift 2px, cards lift 3px and gain `shadow-md`, and links wipe their underline.
- Focus: `:focus-visible` gets a solid 3px `focus` outline with a 3px offset on every interactive element, switching to `night-ink` inside `.on-dark`. Never remove an outline without replacing it.
- Selected: `aria-pressed`, `aria-current` or `aria-selected` drive the style, not classes.
- Disabled: 50% opacity and `not-allowed`, plus words that explain why.

## Iconography
- Inline SVG on a 24×24 viewBox, drawn with `stroke="currentColor"` at stroke width 2, round caps and joins, with `aria-hidden="true" focusable="false"`. The icon takes its colour from the text around it.
- Icon-only buttons (`.round-btn`) carry an `aria-label`.
- No icon fonts and no emoji. Logos are inline SVG in `.logo`, with the business name as text or `aria-label`.
- Looq has no logo of its own yet. Templates use their own invented marks.

## Behaviour (`main.js`)
- One IIFE with `'use strict'` and no libraries. Each feature finds its elements by `data-*` hook and does nothing if they are missing, so a single `main.js` serves every page of a template.
- The reference implementation is `design-system/main.js` (download it below). Copy it into a template and delete the features the template doesn't use; its header comment lists every hook.
- Shared hooks: `data-year`, `data-header`, `data-menu-button` + `aria-controls`, `data-reveal`, `data-count`, `data-nav`, `data-faq-group`, `data-form` (with `data-form-msg`, `data-form-success`, `data-success-name`), `data-service` + `data-service-select`, `data-inline-form`, `data-action-bar`, `data-open-dialog` / `data-close-dialog`, `data-hours`. Template-specific hooks (`data-open-cart`, `data-day`, sliders) follow the same pattern and live below the shared code.
- Forms validate in the browser (required, email, phone length), set `aria-invalid` and show the `.err` message, drop bots through a honeypot, block double submits, and show the success panel. Templates ship in demo mode; connect a real endpoint (`action` + `data-endpoint="ajax"`) before a business goes live.
- Dialogs are native `<dialog>`: they trap focus, close on Escape and on their backdrop, and return focus to the element that opened them.

## Pages and quality bar
- Semantic HTML: `header`, `nav`, `main#main`, `section` (labelled), `footer`. A skip link comes first. One `h1`.
- Pages link with clean URLs (`href="about"`, `href="./"`, `href="./#book"`). Each page has its own `<title>`, meta description, `theme-color` and favicon. Multi-page templates include an `error-404.html` and the legal pages they reference.
- `meta.json` describes the look in one sentence plus its features, using these fields: `slug`, `name`, `industry`, `type` (`website` | `landing-page`), `archetype` (`["A"]`, `["A","B"]` …), `tags`, `description`, `designSystem` (`{ version, theme }`), `tailwindVersion`.
- Every template is for a business type that genuinely operates in Ghana, and follows the Ghana conventions guide (phone and WhatsApp, GH₵, GPS address, Act 843 privacy notice).
- Before shipping, check keyboard-only navigation, 360px width, 200% zoom, reduced motion and every theme pair above.
