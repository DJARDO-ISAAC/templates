# Field

A labelled form control: `<div class="field">` with a `<label for>`, the control (`.input` on `input`, `select` or `textarea`), an optional `.hint`, and an `.err` whose id is `<control-id>-error`.

```html
<div class="field">
  <label for="f-email">Email <span class="opt">optional</span></label>
  <input id="f-email" class="input" type="email" name="email" autocomplete="email">
  <p class="err" id="f-email-error" hidden>Enter an email like name@example.com</p>
</div>
```

- State comes from `aria-invalid="true"` on the control (red border) and the `.err` losing `hidden`. `main.js` sets both, plus `aria-describedby`, on blur and on submit.
- `.input` is 52px tall with a 1.5px `line-strong` border; selects get a chevron; textareas grow vertically.
- Every control has a visible label. Placeholders are examples ("024 000 0000"), never labels.
- Use the right `type`, `inputmode` and `autocomplete` (`name`, `tel`, `email`, `organization`) so phone keyboards and autofill work.
- Error text says how to fix the problem and never relies on colour alone.
