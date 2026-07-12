# Choose UTF-8 Encoding

## Guide metadata

- Id: `choose-utf-8-encoding`
- Category: characters-encodings
- Use when: choosing, declaring, migrating, or checking character encodings for web content, CSS, form data, or stored text.
- Source status: canonical W3C Internationalization guidance.

## Guidance

Use UTF-8 for new web content and data interchange. Treat a different encoding as an exceptional compatibility decision that needs an explicit reason and validation.

Avoid legacy encodings that are obsolete or outside the web platform's supported Encoding Standard labels. Forms, databases, templates, CSS, and generated HTML should be checked together because mismatched layers create data corruption that can be hard to diagnose.

## Implementation checks

- Store source files, templates, generated HTML, and localized resources as UTF-8.
- Declare the encoding in HTML early enough for the browser to find it before parsing text content.
- Avoid `@charset` in CSS unless it is needed; when used, it must be the first item except for a byte order mark.
- Confirm server headers do not override or conflict with the intended encoding.
- Check form submission and storage paths for byte-preserving UTF-8 handling.

## Review checks

- Look for legacy `charset` values, server configuration overrides, or missing declarations.
- Check that migration work changed actual file encoding, not just metadata.
- Review generated pages and bundled assets, not only source templates.
- Verify that tests or fixtures include non-ASCII text.

## Common mistakes

- Declaring UTF-8 while the file is still saved in another encoding.
- Adding a CSS `@charset` after comments or imports.
- Using legacy encodings.

## Related guides

- `declare-document-language`
