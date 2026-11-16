# Hero

The opening section and the home of the page's only `h1`: `<section class="hero">` with a `.hero-body` (eyebrow, h1, lede, `.hero-actions`, optional `.hero-proof`) and an optional `.hero-media`.

## Variants

- `.hero-split`: text and a photo side by side (stacked on mobile). Good for people-led businesses.
- `.hero-center`: centred text, no photo or a photo below. Good for statements and one-offer pages.
- `.hero-bleed`: the photo fills the hero and text sits on an `overlay` gradient; pair with `.header-overlay`. Good for restaurants, hospitality and construction.

A template may add its own variant (an arch-shaped photo, a headline slider), but keeps the parts and the single `h1`.

## Rules

- The headline says what the business does, for whom, and where. One primary CTA plus at most one secondary (phone or WhatsApp).
- The hero image loads eagerly with `fetchpriority="high"` and has `width`/`height`. Decorative photos get `alt=""`.
- Auto-rotating headline sliders are optional and must pause on hover/focus and stop under reduced motion. The `h1` must never live inside a slide that can be hidden.
