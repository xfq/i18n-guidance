# Use Logical CSS Layout

## Guide metadata

- Id: `use-logical-css-layout`
- Category: bidi-layout
- Use when: styling layout, spacing, borders, positioning, or component geometry that should adapt across LTR, RTL, or vertical writing.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Prefer flow-relative CSS properties over physical left/right/top/bottom assumptions. Logical properties let layout follow writing mode and direction without duplicating styles for every locale. They are especially important for components that may appear in RTL pages or vertical writing contexts.

Use physical properties only when the design must remain tied to a physical side regardless of language or writing mode.

## Implementation checks

- Prefer `margin-inline-start`, `padding-inline-end`, `border-inline`, and related logical properties.
- Use `inset-inline` and `inset-block` for positioned UI when appropriate.

## Review checks

- Search for hard-coded `left` and `right` in layout CSS.
- Check margins, padding, borders, floats, positioning, and transforms.
- Verify components still work when nested inside an RTL container.
- Watch for framework utilities that encode physical sides.

## Common mistakes

- Replacing only text alignment while leaving spacing physical.
- Mirroring layout with duplicate CSS instead of using logical properties.
- Assuming RTL is the only non-default flow; vertical writing also matters.
- Applying logical properties to cases that are intentionally physical.

## Related guides

- `handle-bidirectional-text`
- `align-text-by-direction`
- `support-writing-modes`
