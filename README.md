# i18n-guidance

Portable agent guidance package and local CLI for finding focused W3C-backed internationalization guidance before implementing, reviewing, or editing web-facing content, UI, CSS, localization, specs, schemas, or translation work.

It is designed for Codex, Claude Code, and other coding agents. The package keeps detailed guidance in `references/guides/` and exposes a compact search/retrieve workflow so agents can load the narrowest relevant material before acting.

## What It Provides

- A reusable agent entrypoint in `SKILL.md`.
- OpenAI/Codex agent metadata in `agents/openai.yaml`.
- A dependency-free Node.js CLI in `scripts/i18n-guidance.mjs`.
- A guide index in `references/index.json`.
- Focused Markdown guides in `references/guides/`.
- Node test coverage for the CLI contract and validation rules.

## Requirements

- Node.js with built-in `node:test` support.
- No npm package install is required.

## Usage

List all available guides:

```sh
node scripts/i18n-guidance.mjs list
```

Search for a guide with an action-oriented query:

```sh
node scripts/i18n-guidance.mjs search "declare page language"
```

Retrieve one guide by stable id:

```sh
node scripts/i18n-guidance.mjs retrieve "declare-document-language"
```

Retrieve multiple guides when a task crosses boundaries:

```sh
node scripts/i18n-guidance.mjs retrieve "declare-document-language,handle-bidirectional-text"
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

Codex can use the `SKILL.md` and `agents/openai.yaml` metadata directly. Claude Code and other agents can use the same workflow by reading `SKILL.md` as the instruction entrypoint and calling `scripts/i18n-guidance.mjs` for guide discovery and retrieval.

## Development

Run the test suite:

```sh
npm test
```

Run structural validation:

```sh
npm run validate
```

Run both checks after editing `SKILL.md`, `agents/openai.yaml`, `references/index.json`, any guide in `references/guides/`, or the CLI implementation.

## Repository Layout

```text
.
|-- SKILL.md
|-- CLI.md
|-- agents/
|   `-- openai.yaml
|-- package.json
|-- references/
|   |-- index.json
|   `-- guides/
|-- scripts/
|   `-- i18n-guidance.mjs
`-- test/
    `-- cli.test.mjs
```
