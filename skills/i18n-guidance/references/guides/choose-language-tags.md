# Choose Language Tags

## Guide metadata

- Id: `choose-language-tags`
- Category: language-metadata
- Use when: choosing values for `lang`, `xml:lang`, metadata, localization filenames, or language-related data.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Use BCP 47 language tags. Prefer the shortest tag that accurately identifies the language needs of the content. Add script, region, or variant subtags only when they change interpretation, processing, or user expectations. For Chinese, script distinctions such as `zh-Hans` and `zh-Hant` are often more useful than region alone.

## Implementation checks

- Use BCP 47 syntax for every language tag value.
- Choose the shortest accurate tag for the content.
- Use script subtags when script is the meaningful distinction.
- Represent non-linguistic text and undetermined language intentionally.
- Keep filenames, metadata, and markup conventions consistent where this repo already has language-tag style.

## Review checks

- Verify `zh-Hans` and `zh-Hant` are used when simplified/traditional script is the distinction.

## Common mistakes

- Treating `zh-CN` and `zh-TW` as general simplified/traditional script markers.

## Related guides

- `declare-document-language`
