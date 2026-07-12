import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("skills CLI installs bundled resources and the installed CLI runs", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "i18n-guidance-install-"));

  try {
    execFileSync(
      "npx",
      [
        "--yes",
        "skills@1.5.16",
        "add",
        repoRoot,
        "--agent",
        "codex",
        "--skill",
        "i18n-guidance",
        "--copy",
        "--yes",
      ],
      { cwd: projectRoot, encoding: "utf8" }
    );

    const installedRoot = path.join(
      projectRoot,
      ".agents",
      "skills",
      "i18n-guidance"
    );
    const installedCli = path.join(installedRoot, "scripts", "i18n-guidance.mjs");

    assert.equal(fs.existsSync(path.join(installedRoot, "SKILL.md")), true);
    assert.equal(fs.existsSync(installedCli), true);
    assert.equal(fs.existsSync(path.join(installedRoot, "references", "index.json")), true);
    assert.equal(fs.existsSync(path.join(installedRoot, "agents", "openai.yaml")), true);

    const guide = execFileSync(
      process.execPath,
      [installedCli, "retrieve", "declare-document-language"],
      { cwd: projectRoot, encoding: "utf8" }
    );
    assert.match(guide, /^# Declare Document Language/m);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});
