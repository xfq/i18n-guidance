import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repoRoot, "skills", "i18n-guidance");
const cli = path.join(skillRoot, "scripts", "i18n-guidance.mjs");

function runJson(args) {
  const output = execFileSync(process.execPath, [cli, ...args], {
    cwd: os.tmpdir(),
    encoding: "utf8",
  });
  return JSON.parse(output);
}

function runText(args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: os.tmpdir(),
    encoding: "utf8",
  });
}

test("list returns all guide metadata required by the skill contract", () => {
  const guides = runJson(["list"]);
  const ids = guides.map((guide) => guide.id);
  const expectedIds = [
    "choose-utf-8-encoding",
    "declare-document-language",
    "choose-language-tags",
    "mark-non-translatable-content",
    "handle-bidirectional-text",
    "use-logical-css-layout",
    "align-text-by-direction",
    "support-writing-modes",
    "configure-hyphenation",
    "apply-global-typography",
  ];

  assert.equal(guides.length, expectedIds.length);
  assert.deepEqual(new Set(ids), new Set(expectedIds));

  for (const guide of guides) {
    assert.equal(typeof guide.title, "string");
    assert.equal(typeof guide.description, "string");
    assert.equal(typeof guide.category, "string");
    assert.ok(Array.isArray(guide.tasks));
    assert.equal(typeof guide.tokenCount, "number");
    assert.ok(guide.tokenCount > 0);
  }
});

test("search returns relevant guides for representative authoring queries", () => {
  const cases = [
    ["declare the page language on html", "declare-document-language"],
    ["choose a BCP 47 language tag for zh-Hans", "choose-language-tags"],
    ["save pages as UTF-8 and declare encoding", "choose-utf-8-encoding"],
    ["mark product name text as not translatable", "mark-non-translatable-content"],
  ];

  for (const [query, expectedId] of cases) {
    const results = runJson(["search", query]);
    assert.equal(results[0].id, expectedId, query);
    assert.ok(results[0].score > 0, query);
  }
});

test("search returns relevant guides for direction and layout queries", () => {
  const cases = [
    ["fix RTL layout for Arabic and Hebrew", "handle-bidirectional-text"],
    ["replace left and right margins with CSS logical properties", "use-logical-css-layout"],
    ["avoid hard-coded left text alignment in localized layout", "align-text-by-direction"],
    ["support vertical writing mode for Japanese", "support-writing-modes"],
    ["enable CSS hyphenation for German text", "configure-hyphenation"],
    ["global typography fonts counters text decoration", "apply-global-typography"],
  ];

  for (const [query, expectedId] of cases) {
    const results = runJson(["search", query]);
    assert.equal(results[0].id, expectedId, query);
    assert.ok(results[0].score > 0, query);
  }
});

test("retrieve returns one guide or multiple guides by id", () => {
  const single = runText(["retrieve", "declare-document-language"]);
  assert.match(single, /^# Declare Document Language/m);
  assert.match(single, /## Implementation checks/);
  assert.doesNotMatch(single, /^## Source /m);

  const multiple = runText([
    "retrieve",
    "declare-document-language,handle-bidirectional-text",
  ]);
  assert.match(multiple, /^# Declare Document Language/m);
  assert.match(multiple, /^# Handle Bidirectional Text/m);
});

test("documented SKILL_ROOT command works outside the skill and project directories", () => {
  const output = execFileSync(
    "sh",
    [
      "-c",
      [
        'SKILL_ROOT="$DOCUMENTED_SKILL_ROOT"',
        'test -f "$SKILL_ROOT/scripts/i18n-guidance.mjs"',
        'node "$SKILL_ROOT/scripts/i18n-guidance.mjs" search "declare page language"',
      ].join("\n"),
    ],
    {
      cwd: os.tmpdir(),
      encoding: "utf8",
      env: { ...process.env, DOCUMENTED_SKILL_ROOT: skillRoot },
    }
  );
  const results = JSON.parse(output);
  assert.equal(results[0].id, "declare-document-language");
});

test("skill commands resolve the CLI from the skill root", () => {
  const skill = fs.readFileSync(path.join(skillRoot, "SKILL.md"), "utf8");

  assert.match(skill, /node "\$SKILL_ROOT\/scripts\/i18n-guidance\.mjs" search/);
  assert.match(skill, /node "\$SKILL_ROOT\/scripts\/i18n-guidance\.mjs" retrieve/);
  assert.match(skill, /node "\$SKILL_ROOT\/scripts\/i18n-guidance\.mjs" list/);
  assert.doesNotMatch(skill, /node scripts\/i18n-guidance\.mjs/);
  assert.match(skill, /Never combine the assignment and invocation/);

  const commandBlocks = [...skill.matchAll(/```sh\n([\s\S]*?)\n```/g)]
    .map((match) => match[1])
    .filter((block) => block.includes("i18n-guidance.mjs"));
  assert.equal(commandBlocks.length, 3);
  for (const block of commandBlocks) {
    assert.match(block, /^SKILL_ROOT="\/absolute\/path\/to\/i18n-guidance"/);
    assert.match(block, /test -f "\$SKILL_ROOT\/scripts\/i18n-guidance\.mjs"/);
    assert.match(block, /node "\$SKILL_ROOT\/scripts\/i18n-guidance\.mjs"/);
  }
});

test("repository exposes the skill as a bundled subdirectory", () => {
  assert.equal(fs.existsSync(path.join(repoRoot, "SKILL.md")), false);
  assert.equal(fs.existsSync(path.join(skillRoot, "SKILL.md")), true);
  assert.equal(fs.existsSync(path.join(skillRoot, "scripts", "i18n-guidance.mjs")), true);
  assert.equal(fs.existsSync(path.join(skillRoot, "references", "index.json")), true);
  assert.equal(fs.existsSync(path.join(skillRoot, "agents", "openai.yaml")), true);
});

test("retrieve fails clearly for unknown guide ids", () => {
  const result = spawnSync(process.execPath, [cli, "retrieve", "missing-guide"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown guide id: missing-guide/);
});

test("validate checks the skill and guide library", () => {
  const result = spawnSync(process.execPath, [cli, "validate"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /i18n-guidance validation OK/);
});
