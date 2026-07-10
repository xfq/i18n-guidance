---
name: i18n-guidance
description: Use before implementing, reviewing, or editing web-facing content, UI, CSS, localization, specs, schemas, or translation work; search and retrieve W3C-backed i18n guides before acting.
---

# I18n Guidance

Use this skill to find focused W3C internationalization guidance before changing or reviewing web-facing behavior.

## Workflow

1. Search with an action-oriented query that describes the task.

From this skill folder:

```sh
node scripts/i18n-guidance.mjs search "declare page language"
```

2. Retrieve the most relevant guide id before acting.

From this skill folder:

```sh
node scripts/i18n-guidance.mjs retrieve "declare-document-language"
```

3. Apply the retrieved guide to the local code, spec, schema, or translation work. Adapt the guidance to the project, and use the guide's source status note when authority matters.

## Browse All Guides

If search results are weak, list the available guides.

From this skill folder:

```sh
node scripts/i18n-guidance.mjs list
```

## Rules

- Search first; retrieve before giving guidance or changing code.
- Prefer the narrowest guide that matches the task.
- Retrieve multiple ids when the task crosses boundaries, such as language metadata plus bidirectional layout.
- Do not copy guide content into the skill body. Keep detailed guidance in `references/guides/`.

## Validation

Run the local checks after editing guides, metadata, or the retrieval command.

```sh
npm test
npm run validate
```
