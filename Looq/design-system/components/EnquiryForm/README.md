# EnquiryForm

The lead-capture form for archetype B, handled by `main.js` through `data-form`. Try it in the preview: submit empty, then fill it in.

## Parts

- `.form-grid` lays fields out in two columns on wider screens; `.full` spans both.
- Each `.field` is a `<label for>` + control (`.input` on input, select or textarea) + an `.err` with id `<field-id>-error`, hidden until needed. Optional fields say "optional" in an `.opt` span; required ones carry `required`.
- `.choices` / `.choice` are radio pills (preferred reply channel); `.check` is a checkbox row (separate, unticked marketing consent).
- `.hp` holds the honeypot `name="website"` field; a hidden `source_page` (and `service`, `area` where relevant) records where the lead came from.
- `[data-form-msg]` is the error summary; `[data-form-success]` (a sibling of the form) is the thank-you state with `[data-success-name]`.

## Rules

- Ask only what is needed to reply and qualify. In Ghana, make "Phone or WhatsApp" required and email optional; accept international numbers for diaspora clients.
- Required fields, email format and phone length are checked on submit and on blur; errors set `aria-invalid` and `aria-describedby` and say how to fix the problem.
- The submit button shows `aria-busy` while sending and blocks double submits.
- The success state confirms receipt, gives a realistic response time and an urgent route (phone/WhatsApp).
- Before launch, connect a real endpoint and an auto-reply plus owner notification. Never post to an unapproved service.
