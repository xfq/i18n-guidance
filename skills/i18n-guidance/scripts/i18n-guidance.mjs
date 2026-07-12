#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(skillRoot, "references", "index.json");
const guideDir = path.join(skillRoot, "references", "guides");

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "by",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
  "without",
]);

main(process.argv.slice(2));

function main(args) {
  const [command, ...rest] = args;

  try {
    if (command === "list") {
      printJson(listGuides());
      return;
    }

    if (command === "search") {
      const query = rest.join(" ").trim();
      if (!query) fail("Usage: i18n-guidance search \"query\"");
      printJson(searchGuides(query));
      return;
    }

    if (command === "retrieve") {
      const rawIds = rest.join(",").trim();
      if (!rawIds) fail("Usage: i18n-guidance retrieve \"guide-id[,other-id]\"");
      process.stdout.write(retrieveGuides(rawIds));
      return;
    }

    if (command === "validate") {
      validateSkill();
      process.stdout.write("i18n-guidance validation OK\n");
      return;
    }

    fail("Usage: i18n-guidance <list|search|retrieve|validate>");
  } catch (error) {
    fail(error.message);
  }
}

function readIndex() {
  const raw = fs.readFileSync(indexPath, "utf8");
  return JSON.parse(raw);
}

function listGuides() {
  return readIndex().map((entry) => publicMetadata(entry));
}

function searchGuides(query) {
  const entries = readIndex();
  const queryText = normalizeText(query);
  const queryTokens = tokenize(queryText);

  return entries
    .map((entry) => ({
      ...publicMetadata(entry),
      score: scoreEntry(entry, queryText, queryTokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, 5);
}

function retrieveGuides(rawIds) {
  const entries = readIndex();
  const knownIds = new Set(entries.map((entry) => entry.id));
  const ids = rawIds
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const content = [];
  for (const id of ids) {
    if (!knownIds.has(id)) {
      throw new Error(`Unknown guide id: ${id}`);
    }
    content.push(readGuide(id));
  }

  return `${content.join("\n\n---\n\n").trim()}\n`;
}

function publicMetadata(entry) {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    tasks: entry.tasks,
    tokenCount: countTokens(readGuide(entry.id)),
  };
}

function scoreEntry(entry, queryText, queryTokens) {
  const fields = [
    entry.id,
    entry.title,
    entry.description,
    entry.category,
    ...(entry.tasks || []),
    ...(entry.keywords || []),
  ];
  const searchable = normalizeText(fields.join(" "));
  const searchableTokens = new Set(tokenize(searchable));
  let score = 0;

  for (const keyword of entry.keywords || []) {
    const normalizedKeyword = normalizeText(keyword);
    if (normalizedKeyword && queryText.includes(normalizedKeyword)) {
      score += 8;
    }
  }

  for (const token of queryTokens) {
    if (searchableTokens.has(token)) {
      score += 3;
    } else if (searchable.includes(token)) {
      score += 1;
    }
  }

  return score;
}

function readGuide(id) {
  return fs.readFileSync(path.join(guideDir, `${id}.md`), "utf8");
}

function validateSkill() {
  const errors = [];
  const skillMd = path.join(skillRoot, "SKILL.md");
  const openaiYaml = path.join(skillRoot, "agents", "openai.yaml");
  const index = readIndex();
  const seenIds = new Set();

  if (!fs.existsSync(skillMd)) {
    errors.push("SKILL.md is missing.");
  } else {
    const skillText = fs.readFileSync(skillMd, "utf8");
    errors.push(...validateSkillFrontMatter(skillText));
    if (!skillText.includes("search") || !skillText.includes("retrieve")) {
      errors.push("SKILL.md must explain search and retrieve.");
    }
    if (skillText.includes("[TODO")) {
      errors.push("SKILL.md still contains TODO placeholders.");
    }
  }

  if (!fs.existsSync(openaiYaml)) {
    errors.push("agents/openai.yaml is missing.");
  } else {
    const yaml = fs.readFileSync(openaiYaml, "utf8");
    if (!yaml.includes("$i18n-guidance")) {
      errors.push("agents/openai.yaml default_prompt must mention $i18n-guidance.");
    }
    const shortDescription = yaml.match(/short_description:\s*"([^"]+)"/)?.[1] || "";
    if (shortDescription.length < 25 || shortDescription.length > 64) {
      errors.push("agents/openai.yaml short_description must be 25-64 characters.");
    }
  }

  if (!Array.isArray(index) || index.length === 0) {
    errors.push("references/index.json must be a non-empty array.");
  }

  const knownIds = new Set(index.map((entry) => entry.id));
  for (const [position, entry] of index.entries()) {
    const prefix = `index entry ${position + 1}`;
    for (const field of ["id", "title", "description", "category"]) {
      if (!entry[field] || typeof entry[field] !== "string") {
        errors.push(`${prefix} is missing string field ${field}.`);
      }
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id || "")) {
      errors.push(`${prefix} has invalid id ${entry.id}.`);
    }
    if (seenIds.has(entry.id)) {
      errors.push(`duplicate guide id ${entry.id}.`);
    }
    seenIds.add(entry.id);
    if (!Array.isArray(entry.tasks) || entry.tasks.length === 0) {
      errors.push(`${entry.id} must define task keywords.`);
    }
    if (!Array.isArray(entry.keywords) || entry.keywords.length === 0) {
      errors.push(`${entry.id} must define search keywords.`);
    }
    const guidePath = path.join(guideDir, `${entry.id}.md`);
    if (!fs.existsSync(guidePath)) {
      errors.push(`${entry.id} guide file is missing.`);
      continue;
    }
    const guide = fs.readFileSync(guidePath, "utf8");
    for (const required of [
      `Id: \`${entry.id}\``,
      "Source status:",
      "## Implementation checks",
      "## Review checks",
      "## Common mistakes",
      "## Related guides",
    ]) {
      if (!guide.includes(required)) {
        errors.push(`${entry.id} is missing ${required}.`);
      }
    }

    const relatedIds = [...extractSection(guide, "Related guides").matchAll(/`([^`]+)`/g)].map(
      (match) => match[1]
    );
    for (const relatedId of relatedIds) {
      if (!knownIds.has(relatedId)) {
        errors.push(`${entry.id} references unknown related guide ${relatedId}.`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}

function extractSection(markdown, heading) {
  const marker = `## ${heading}\n`;
  const start = markdown.indexOf(marker);
  if (start === -1) return "";
  const bodyStart = start + marker.length;
  const nextHeading = markdown.indexOf("\n## ", bodyStart);
  return markdown.slice(bodyStart, nextHeading === -1 ? undefined : nextHeading);
}

function validateSkillFrontMatter(skillText) {
  const errors = [];
  const match = skillText.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return ["SKILL.md front matter is missing or malformed."];
  }

  const lines = match[1].split("\n").filter((line) => line.trim());
  const keys = new Set();
  for (const line of lines) {
    const lineMatch = line.match(/^([a-z][a-z0-9-]*):\s*(.+)$/);
    if (!lineMatch) {
      errors.push(`SKILL.md front matter line is malformed: ${line}`);
      continue;
    }
    const [, key, value] = lineMatch;
    keys.add(key);
    if (key === "name" && value.trim() !== "i18n-guidance") {
      errors.push("SKILL.md front matter name must be i18n-guidance.");
    }
    if (key === "description") {
      const description = value.trim().replace(/^["']|["']$/g, "");
      if (!description || description.includes("[TODO")) {
        errors.push("SKILL.md front matter description must be complete.");
      }
      if (description.includes("<") || description.includes(">")) {
        errors.push("SKILL.md front matter description cannot contain angle brackets.");
      }
      if (description.length > 1024) {
        errors.push("SKILL.md front matter description is too long.");
      }
    }
  }

  const allowedKeys = new Set(["name", "description"]);
  for (const key of keys) {
    if (!allowedKeys.has(key)) {
      errors.push(`SKILL.md front matter has unexpected key: ${key}.`);
    }
  }
  for (const key of allowedKeys) {
    if (!keys.has(key)) {
      errors.push(`SKILL.md front matter is missing ${key}.`);
    }
  }

  return errors;
}

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .replace(/utf-?8/g, "utf8")
    .replace(/right-to-left/g, "rtl")
    .replace(/left-to-right/g, "ltr")
    .replace(/non-translatable/g, "nontranslatable")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalizeText(value)
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function countTokens(value) {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
