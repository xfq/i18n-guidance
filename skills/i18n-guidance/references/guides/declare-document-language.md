# Declare Document Language

## Guide metadata

- Id: `declare-document-language`
- Category: language-metadata
- Use when: adding or reviewing the default language of an HTML page, template, document root, or generated document.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Declare the language of text for text processing. In HTML, put the default language on the `html` element with `lang`. Use language metadata so browsers, assistive technologies, spell checkers, search, font fallback, line breaking, hyphenation, and styling can make language-sensitive decisions.

Do not rely on HTTP language metadata for text processing. The HTTP `Content-Language` header describes intended audience metadata and can list multiple languages; it is not a replacement for `lang` on the content. If a page intentionally has no single language, leave the root language unset and mark language-specific sections at the highest useful level.

## Implementation checks

- Add `lang` to the `html` element when the document has a dominant language.
- Use the highest-level element that accurately scopes a language value.
- Keep language metadata separate from locale preferences and regional formatting decisions.

## Review checks

- Check whether the language value describes the text actually present.
- Look for `lang` on `body` where `html` is the correct target.

## Common mistakes

- Forgetting `lang` on generated HTML shells.

## Related guides

- `choose-language-tags`
- `configure-hyphenation`
