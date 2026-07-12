# i18n-guidance

My agent skills and CLI for finding focused W3C i18n guidance before implementing, reviewing, or editing web-facing content, UI, CSS, localization, specs, schemas, or translation work.

It is designed for Codex, Claude Code, and other coding agents. The package keeps detailed guidance in `skills/i18n-guidance/references/guides/` and exposes a compact search/retrieve workflow so agents can load the narrowest relevant material before acting.

## What It Provides

- A reusable agent entrypoint in `skills/i18n-guidance/SKILL.md`.
- OpenAI/Codex agent metadata in `skills/i18n-guidance/agents/openai.yaml`.
- A dependency-free Node.js CLI in `skills/i18n-guidance/scripts/i18n-guidance.mjs`.
- A guide index in `skills/i18n-guidance/references/index.json`.
- Focused Markdown guides in `skills/i18n-guidance/references/guides/`.
- Node test coverage for the CLI contract and validation rules.

## Requirements

- Node.js with built-in `node:test` support.
- No npm package install is required.

## Installation

This repository is installable with the `skills` CLI.

Install it globally:

```sh
npx skills@latest add xfq/i18n-guidance --global
```

Install it into the current project:

```sh
npx skills@latest add xfq/i18n-guidance
```

## Updating

When a new version of the skill is published, update a project-local installation from that project's directory:

```sh
npx skills@latest update i18n-guidance --project
```

Update a global installation with:

```sh
npx skills@latest update i18n-guidance --global
```

The command checks the installed skill against its source and replaces it only when changes are available.

## Usage

List all available guides:

```sh
node skills/i18n-guidance/scripts/i18n-guidance.mjs list
```

Search for a guide with an action-oriented query:

```sh
node skills/i18n-guidance/scripts/i18n-guidance.mjs search "declare page language"
```

Retrieve one guide by stable id:

```sh
node skills/i18n-guidance/scripts/i18n-guidance.mjs retrieve "declare-document-language"
```

Retrieve multiple guides when a task crosses boundaries:

```sh
node skills/i18n-guidance/scripts/i18n-guidance.mjs retrieve "declare-document-language,handle-bidirectional-text"
```

Validate the skill folder, guide index, and guide files:

```sh
npm run validate
```

## Agent Workflow

1. Search with a task-specific query.
2. Retrieve the most relevant guide id before giving guidance or changing code.
3. Apply the guide to the local code, spec, schema, or translation work.
4. Retrieve multiple guides only when the task spans multiple i18n concerns.

If search results are weak, use `list` to inspect the available guide catalog.

## Agent Integration

The `skills` CLI installs the complete `skills/i18n-guidance/` directory, including its bundled script and references, for Codex, Claude Code, Cursor, OpenCode, and other supported agents. Codex can also use the bundled `agents/openai.yaml` metadata directly. Other agents can use the same workflow by reading the installed `SKILL.md` and calling its sibling `scripts/i18n-guidance.mjs` for guide discovery and retrieval.

Example prompt for a coding agent:

```text
Use the i18n-guidance skill to declare this page's language correctly.
```

## Development

Run the test suite:

```sh
npm test
```

Run structural validation:

```sh
npm run validate
```

Run the pinned `skills` CLI installation test when changing the distributable layout:

```sh
npm run test:install
```

Run all three checks after editing files under `skills/i18n-guidance/`, changing the distributable layout, or changing the CLI tests.

## Repository Layout

```text
.
|-- CLI.md
|-- package.json
|-- skills/
|   `-- i18n-guidance/
|       |-- SKILL.md
|       |-- agents/
|       |   `-- openai.yaml
|       |-- references/
|       |   |-- index.json
|       |   `-- guides/
|       `-- scripts/
|           `-- i18n-guidance.mjs
`-- test/
    `-- cli.test.mjs
```
