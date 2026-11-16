# Section

The page rhythm: every block of a page is `<section class="sec">` holding one `.wrap`. Add `.on-dark` for a `night` band.

```html
<section class="sec on-dark" aria-labelledby="visit-h">
  <div class="wrap">
    <p class="eyebrow">Visit us</p>
    <h2 id="visit-h" class="d-lg">Open daily from 07:00</h2>
    …
  </div>
</section>
```

- `.wrap` is `wrap-max` wide, with `gutter` padding (`gutter-md` from 768px). `.sec` adds `section-y` padding top and bottom.
- `.on-dark` changes the text colours (`night-ink`, `night-muted`), the eyebrow (`accent`), the focus ring (`night-ink`) and `.btn-line`. Everything inside it adapts without per-element classes.
- Switch between light and dark bands deliberately, for example a dark "How it works" between light sections. Avoid more than two dark bands in a row.
- Each section is labelled by its heading (`aria-labelledby`) or by an `aria-label` when it has none.
