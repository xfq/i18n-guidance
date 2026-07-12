# Apply Global Typography

## Guide metadata

- Id: `apply-global-typography`
- Category: typography-layout
- Use when: reviewing fonts, counters, ruby, emphasis, annotations, list markers, or script-specific typographic conventions.
- Source status: W3C guidance.

## Guidance

Scripts and languages differ in emphasis, ruby and annotations, list counters, justification, punctuation behavior, text decoration, and preferred spacing. Use platform features that express the intended typography rather than hard-coding Latin script assumptions.

Review typography with real target-language samples. Placeholder Latin text hides many issues.

## Implementation checks

- Choose fonts and font stacks that cover expected scripts and weights.
- Review emphasis, underline, and text-decoration behavior for target scripts.
- Keep typographic choices language-aware where browser features depend on `lang`.

## Review checks

- Look for missing glyphs, incorrect fallback, or inconsistent metrics.
- Check list markers, counters, and generated labels in non-Latin scripts.
- Review ruby, annotations, and emphasis in scripts that use them.
- Test with real samples from target languages and writing systems.

## Common mistakes

- Assuming a Latin font stack is globally adequate.
- Hard-coding list marker styles that do not suit the language.
- Reviewing typography with translated strings but not target-script typography.

## Related guides

- `support-writing-modes`
- `align-text-by-direction`
