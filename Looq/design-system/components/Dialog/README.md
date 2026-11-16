# Dialog

A native `<dialog class="dialog">` for short secondary content (privacy notice, terms, details) on one-page sites. Opened by `data-open-dialog="id"`, closed by `[data-close-dialog]`, Escape or the backdrop.

- Native `showModal()` traps focus and returns it to the trigger; keep a visible close button with an `aria-label`.
- Give the dialog `aria-labelledby` pointing at its heading.
- Don't use dialogs for marketing pop-ups or anything that interrupts on page load.
- Multi-page sites can use real pages (`privacy.html`) instead; the content pattern is the same (see the Ghana conventions guide for the privacy notice).
