# Configure Hyphenation

## Guide metadata

- Id: `configure-hyphenation`
- Category: typography-layout
- Use when: enabling, reviewing, or debugging CSS hyphenation in localized text.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Hyphenation is language sensitive. CSS hyphenation depends on accurate language metadata and browser support for the relevant language dictionaries. Enable it deliberately where it improves readability, and test with real words from target languages.

## Implementation checks

- Add accurate `lang` metadata before relying on `hyphens: auto`.
- Test with real target-language content, including long words.
- Check print, narrow viewport, and component states where line breaks change.

## Review checks

- Verify language metadata is present and correct.
- Check whether the target browser/platform supports hyphenation for the language.

## Common mistakes

- Enabling `hyphens: auto` without language metadata.
- Testing with English while shipping German or other long-word languages.

## Related guides

- `declare-document-language`
