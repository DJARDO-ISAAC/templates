# ActionBar

Floating contact shortcuts. `.action-bar` is the mobile bar (Call · WhatsApp · main CTA), hidden from `lg` up; `.wa-float` is a single round WhatsApp button.

- Use one or the other, not both, on a page.
- The bar must not cover content: add bottom padding to the footer on mobile, and let `data-action-bar` hide it while the form (`data-action-target`, default `#contact`) is on screen.
- Every link works without JavaScript. The WhatsApp button has an `aria-label`; the `whatsapp` token keeps its white icon at 3:1.
