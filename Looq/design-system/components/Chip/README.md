# Chip

A toggle button for filters and categories: `<button class="chip" aria-pressed="…">`, grouped in a `role="group"` with an `aria-label`.

- The pressed state comes from `aria-pressed="true"` (or `aria-current` when the chip is a link to a filtered page), not from a class. It fills with `brand`.
- An optional count goes in `<span class="count">`.
- On mobile, put chips in a horizontal scroller and keep each one 44px tall.
- For labels that cannot be clicked, use `.tag`.
