# Support Writing Modes

## Guide metadata

- Id: `support-writing-modes`
- Category: typography-layout
- Use when: designing layout or typography for vertical text, East Asian typography, Mongolian, or writing-mode-sensitive UI.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Writing mode affects inline and block flow, alignment, punctuation, line orientation, and the meaning of physical sides. Use CSS writing-mode features deliberately and combine them with logical layout properties so components adapt to vertical and horizontal flows.

Do not assume a component that works in RTL horizontal text also works in vertical writing. Test with representative content and real writing-mode values.

## Implementation checks

- Use CSS `writing-mode` where the design requires vertical text.
- Use logical dimensions and spacing so layout follows the block and inline axes.
- Check numbers, ruby, and annotation behavior.
- Avoid fixed width/height assumptions that encode horizontal flow.
- Test with Chinese, Japanese, or other relevant vertical-writing samples.

## Review checks

- Look for physical side assumptions in components intended for vertical writing.
- Check whether line orientation, counters, and markers render acceptably.
- Verify scroll, overflow, and clipping behavior.
- Review whether fallback behavior is acceptable where full support is not available.

## Common mistakes

- Treating vertical writing as rotated horizontal text.
- Mixing physical sizing and logical flow-relative layout.
- Testing headings only, not real paragraphs or controls.

## Related guides

- `use-logical-css-layout`
- `apply-global-typography`
