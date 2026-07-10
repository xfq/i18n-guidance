# Mark Non-Translatable Content

## Guide metadata

- Id: `mark-non-translatable-content`
- Category: localization
- Use when: content includes names, code, product labels, commands, data values, or other text that translation systems should leave unchanged.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Mark text that should not be translated intentionally. In HTML, use the `translate` attribute on an element that scopes the protected content. This helps online translation systems, localization tools, and human review distinguish translatable prose from names, code, command text, identifiers, or values that must remain stable.

The marker should describe text that must remain unchanged, not text that has merely not been translated yet.

## Implementation checks

- Use `translate="no"` around product names, commands, code-like values, and stable identifiers when appropriate.
- Scope the marker narrowly enough to avoid protecting surrounding prose.

## Review checks

- Check that protected text is genuinely non-translatable.

## Common mistakes

- Assuming CSS classes or data attributes are visible to translation tools.

## Related guides

- `choose-language-tags`
