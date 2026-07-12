---
name: i18n-guidance
description: Use before implementing, reviewing, or editing web-facing content, UI, CSS, localization, specs, schemas, or translation work; search and retrieve W3C-backed i18n guides before acting.
---

# I18n Guidance

Use this skill to find focused W3C internationalization guidance before changing or reviewing web-facing behavior.

Before running a command:

1. Resolve the absolute path of the directory that contains this loaded `SKILL.md`. Resolve it from the skill file location, not from the user's project or the current working directory.
2. In every shell invocation below, assign that path to `SKILL_ROOT` as its own statement. Do not prefix the `node` command with the assignment: the shell expands `$SKILL_ROOT` before that temporary assignment takes effect.
3. Confirm that `$SKILL_ROOT/scripts/i18n-guidance.mjs` exists in the same shell invocation. Only then run the command.

## Workflow

1. Search with an action-oriented query that describes the task.

```sh
SKILL_ROOT="/absolute/path/to/i18n-guidance"
test -f "$SKILL_ROOT/scripts/i18n-guidance.mjs"
node "$SKILL_ROOT/scripts/i18n-guidance.mjs" search "declare page language"
```

2. Retrieve the most relevant guide id before acting.

```sh
SKILL_ROOT="/absolute/path/to/i18n-guidance"
test -f "$SKILL_ROOT/scripts/i18n-guidance.mjs"
node "$SKILL_ROOT/scripts/i18n-guidance.mjs" retrieve "declare-document-language"
```

3. Apply the retrieved guide to the local code, spec, schema, or translation work. Adapt the guidance to the project, and use the guide's source status note when authority matters.

## Browse All Guides

If search results are weak, list the available guides.

```sh
SKILL_ROOT="/absolute/path/to/i18n-guidance"
test -f "$SKILL_ROOT/scripts/i18n-guidance.mjs"
node "$SKILL_ROOT/scripts/i18n-guidance.mjs" list
```

## Rules

- Search first; retrieve before giving guidance or changing code.
- In each shell invocation, assign the absolute skill directory to `SKILL_ROOT` in a separate statement before invoking the CLI; shell variables may not persist between tool calls, and the user's project directory is not the skill directory.
- Never combine the assignment and invocation as `SKILL_ROOT="..." node "$SKILL_ROOT/scripts/i18n-guidance.mjs" ...`; that expands to the wrong path when `SKILL_ROOT` was previously unset.
- Prefer the narrowest guide that matches the task.
- Retrieve multiple ids when the task crosses boundaries, such as language metadata plus bidirectional layout.
- Do not copy guide content into the skill body. Keep detailed guidance in `references/guides/`.

## Validation

Run the local checks after editing guides, metadata, or the retrieval command.

```sh
npm test
npm run validate
```
