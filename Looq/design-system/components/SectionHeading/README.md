# SectionHeading

The block that opens a section: an eyebrow, one heading and an optional lede or action. `<div class="sec-head">` inside the section's `.wrap`.

- Variants: default (left), `.sec-head-center`, and `.sec-head-split` (heading left, lede or link right on desktop).
- The eyebrow is `.eyebrow` (marker + uppercase) or `.eyebrow-pill` (outlined pill). Pick one style per template.
- The heading is an `h2` (the page's `h1` lives in the hero). Its visual size is a type style (`d-lg`, `d-md`), independent of the level.
- Give the section `aria-labelledby` pointing at the heading's id.
