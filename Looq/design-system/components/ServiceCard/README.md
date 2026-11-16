# ServiceCard

One offer the business sells: `.svc`. Lists, grids and package overviews are built from it.

## Variants

- Default / icon: bordered card with an optional `.svc-icon`, a meta line, `.svc-title`, `.svc-text` or `.svc-list`, and a `.svc-foot` with the price and action.
- `.svc-photo`: the whole card is one link with a photo on top and the title plus a round arrow below.
- `.svc-overlay`: the title sits on the photo over an `overlay` gradient.

## Rules

- Prices are written `GH₵ 1,200` with what is included or excluded nearby ("plus official fees", "excl. VAT"). Use `.svc-price` with a `<small>` label ("From").
- The action names the service: "Ask about this" plus `data-service="value"` preselects the service in the enquiry form, which powers the "enquiries by service" metric.
- When the whole card is a link, put no other links or buttons inside it.
- Images are decorative here (`alt=""`) because the title names the service.
