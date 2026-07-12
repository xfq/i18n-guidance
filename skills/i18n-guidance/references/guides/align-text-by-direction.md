# Align Text By Direction

## Guide metadata

- Id: `align-text-by-direction`
- Category: typography-layout
- Use when: setting text alignment in localized UI, article layouts, form controls, tables, or generated content.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Use `start` and `end` alignment where text should follow the current base direction. Avoid hard-coded `left` and `right` unless the alignment is intentionally physical. Also avoid unnecessary `text-align` overrides; the browser's default alignment often already follows direction.

Justification and ragged edges are language and script sensitive. Do not assume every writing system prefers the same line-end shape as English.

## Implementation checks

- Prefer `text-align: start` and `text-align: end` for direction-sensitive text.
- Remove redundant alignment declarations that duplicate default behavior.
- Use physical alignment only when the design explicitly requires a physical side.
- Check form controls, table cells, captions, and generated labels.
- Pair alignment work with correct direction metadata.

## Review checks

- Search for `text-align: left` and `text-align: right`.
- Review HTML alignment attributes or utility classes that encode physical sides.
- Check components in both LTR and RTL containers.
- Review justified text with real target-language samples.

## Common mistakes

- Treating alignment fixes as a substitute for base direction.
- Applying `text-align: left` globally in resets.
- Assuming icon placement and text alignment should always mirror together.
- Ignoring justification differences across scripts.

## Related guides

- `use-logical-css-layout`
- `handle-bidirectional-text`
