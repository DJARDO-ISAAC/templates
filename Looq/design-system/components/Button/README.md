# Button

A pill-shaped action: `.btn` plus one colour variant, as an `<a>` when it goes somewhere and a `<button>` when it acts on the page.

## Markup

```html
<a href="book" class="btn btn-brand"><span>Book a table</span><svg …arrow…></svg></a>
<button type="button" class="btn btn-line btn-sm">Contact us</button>
<button type="button" class="round-btn" aria-label="Search the site"><svg …></svg></button>
```

## Variants

- `.btn-brand`: the primary action. At most one per view, for the thing the page is for.
- `.btn-accent`: the second action beside a primary, or the one action on a `night` section.
- `.btn-line`: quiet actions ("Read our story", "Contact us"). Its 2px border is `line-strong`.
- `.btn-sm`: header and card actions; still 44px tall (`tap-min`).
- `.round-btn`: icon-only (search, cart, menu). Always has `aria-label`.

A template may add its own named variants (Asanka has `.btn-palm`, `.btn-cocoa`). Keep the shared three working, so a template stays easy to rebrand.

## Rules

- Labels are sentence case and start with a verb: "Book a table", not "BOOK NOW" or "Click here".
- A trailing arrow means the button goes to another page. Inline SVG, `aria-hidden="true"`.
- Disabled is `disabled` on a `<button>`, `aria-disabled="true"` on a link. Explain why next to it.
- Hover lifts 2px with `ease-spring`. Under `prefers-reduced-motion` it does not move.
