import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(root, "..");
const cli = path.join(root, "scripts", "i18n-guidance.mjs");

function runJson(args) {
  const output = execFileSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8",
  });
  return JSON.parse(output);
}

function runText(args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: root,
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

test("documented repo-root command path works", () => {
  const output = execFileSync(
    process.execPath,
    ["i18n-guidance/scripts/i18n-guidance.mjs", "search", "declare page language"],
    {
      cwd: repoRoot,
      encoding: "utf8",
    }
  );
  const results = JSON.parse(output);
  assert.equal(results[0].id, "declare-document-language");
});

test("retrieve fails clearly for unknown guide ids", () => {
  const result = spawnSync(process.execPath, [cli, "retrieve", "missing-guide"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown guide id: missing-guide/);
});

test("validate checks the skill and guide library", () => {
  const result = spawnSync(process.execPath, [cli, "validate"], {
    cwd: root,
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /i18n-guidance validation OK/);
});
