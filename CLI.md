# How `i18n-guidance.mjs` Works

This document explains the implementation of `i18n-guidance/scripts/i18n-guidance.mjs`.

## Role

`i18n-guidance.mjs` is the local command-line interface for the portable `i18n-guidance` skill. It gives agents a stable public contract:

- `list`: return guide metadata.
- `search "<query>"`: rank guides for an action-oriented task.
- `retrieve "<id[,id]>"`: print guide Markdown by stable guide id.
- `validate`: check the skill folder, guide index, and guide files.

The script has no runtime package dependencies. It uses only Node built-ins: `fs`, `path`, and `url`.

## `list`

`listGuides()` loads `references/index.json` and maps each entry through `publicMetadata(entry)`.

The public metadata object contains:

- `id`
- `title`
- `description`
- `category`
- `tasks`
- `tokenCount`

`tokenCount` is computed from the corresponding guide Markdown file by splitting on whitespace. It is approximate, but good enough to help an agent estimate context size.

`list` does not return full guide content. It is intentionally compact.
