# Card

A clickable summary of one item (a dish, article, service or person): `<article class="card">` with a `.card-img` on top and a `.card-body` below.

- The title's `<a>` carries `.stretched`, so the whole card is one link and one tab stop. Other controls inside the card need `position: relative; z-index: 1`.
- `.card-img` keeps a fixed aspect ratio (4:3 by default) and shows a striped placeholder until the image loads. Images are `object-cover`, `loading="lazy"` and have `width`/`height` set.
- The title is `d-sm` (`.card-title`) and the meta line is `muted`. Keep body copy to one line on cards.
- Cards rest on `shadow-sm` and lift to `shadow-md` on hover. A template can swap the shadow for a border (`line`) or change the image shape (arch, bowl or capsule). Keep the structure the same.
