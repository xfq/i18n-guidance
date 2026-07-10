# Handle Bidirectional Text

## Guide metadata

- Id: `handle-bidirectional-text`
- Category: bidi-layout
- Use when: displaying Arabic, Hebrew, Persian, Urdu, or mixed RTL/LTR text in pages, UI, forms, generated content, or inline snippets.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Separate language from direction.

For inline mixed-direction content, use isolation so inserted names, titles, numbers, or snippets do not disturb adjacent punctuation and text order.

Use semantic HTML direction features.

## Implementation checks

- Set base direction on the correct block or document root for RTL pages.
- Use `dir="auto"` where text direction is unknown until runtime.
- Use `bdi` or equivalent isolation for inserted inline text with unknown direction.
- Test mixed examples with punctuation, numbers, and neutral characters.

## Review checks

- Look for RTL content displayed in an LTR context without direction metadata.
- Review form inputs and stored user-generated text.

## Common mistakes

- Inferring direction from language tags.
- Using CSS `direction` alone for content semantics.

## Related guides

- `use-logical-css-layout`
- `align-text-by-direction`
