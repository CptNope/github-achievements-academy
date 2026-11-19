#!/usr/bin/env node
// Validates a Learners Wall pull request.
// Runs from the BASE branch checkout (trusted code) against the PR checkout (untrusted content).
// No dependencies. Usage:
//   node validate-learner-pr.mjs --repo <pr-checkout-dir> --base <sha> --head <sha> --author <login> [--maintainer <login>]

import { execFileSync } from "node:child_process";
import { readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, cur, i, arr) => {
    if (cur.startsWith("--")) acc.push([cur.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);

const { repo = ".", base, head = "HEAD", author, maintainer } = args;
if (!base || !author) {
  console.error("Missing --base or --author");
  process.exit(2);
}

const MAX_BYTES = 4096;
const MAX_LINKS = 3;
const REQUIRED_HEADINGS = ["## About me", "## Lessons completed", "## What I learned"];
const SPAM = /\b(star|follow)\s+(me|my|back|for\s+(a\s+)?(star|follow))\b|\bstar[-\s]?for[-\s]?star\b|\bf4f\b|\bs4s\b/i;

const errors = [];
const login = author.toLowerCase();

const diff = execFileSync("git", ["-C", repo, "diff", "--name-status", "--no-renames", `${base}...${head}`], {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    const [status, ...rest] = line.split("\t");
    return { status, path: rest.join("\t") };
  });

const learnerChanges = diff.filter((c) => c.path.startsWith("learners/"));

if (learnerChanges.length === 0) {
  report("ℹ️ No Learners Wall files changed. Skipping learner validation (a maintainer will review).", true);
}

if (maintainer && login === maintainer.toLowerCase()) {
  report("ℹ️ PR opened by a maintainer. Skipping learner validation.", true);
}

const expected = `learners/${login}.md`;

if (diff.length !== learnerChanges.length) {
  errors.push(
    "Learners Wall PRs may only change files in `learners/`. Please open a separate PR for lesson or tooling changes."
  );
}
if (learnerChanges.length > 1) {
  errors.push(`Only one learner file may change per PR. You changed: ${learnerChanges.map((c) => "`" + c.path + "`").join(", ")}`);
}

for (const change of learnerChanges) {
  if (change.path.toLowerCase() !== expected) {
    errors.push(`You can only add or edit your own page: \`${expected}\` (got \`${change.path}\`).`);
    continue;
  }
  if (change.path !== expected) {
    errors.push(`Please use a lowercase filename: \`${expected}\`.`);
  }
  if (!["A", "M"].includes(change.status)) {
    errors.push(`Your page must be added or modified, not deleted (status \`${change.status}\`).`);
    continue;
  }

  const body = readFileSync(join(repo, change.path), "utf8");
  const bytes = Buffer.byteLength(body, "utf8");
  if (bytes > MAX_BYTES) errors.push(`Your page is ${bytes} bytes. Please keep it under ${MAX_BYTES}.`);

  const firstLine = body.split(/\r?\n/).find((l) => l.trim() !== "") ?? "";
  if (firstLine.trim().toLowerCase() !== `# @${login}`) {
    errors.push(`The first line must be \`# @${author}\`.`);
  }

  for (const h of REQUIRED_HEADINGS) {
    if (!body.includes(h)) errors.push(`Missing required heading: \`${h}\`.`);
  }

  const links = body.match(/https?:\/\//gi) ?? [];
  if (links.length > MAX_LINKS) errors.push(`Please use at most ${MAX_LINKS} links (found ${links.length}).`);

  if (SPAM.test(body)) {
    errors.push("Star/follow requests aren't allowed. See FAIR-PLAY.md.");
  }

  if (change.status === "M") {
    const learned = (body.split("## What I learned")[1] ?? "").replace(/<!--[\s\S]*?-->/g, "");
    const notes = learned.split(/\r?\n/).filter((l) => /^\s*[-*]\s+\S/.test(l));
    if (notes.length === 0) {
      errors.push("For progress updates, add at least one line under `## What I learned` about what you learned.");
    }
  }
}

if (errors.length) {
  report(["❌ **Learners Wall check failed**", "", ...errors.map((e) => `- ${e}`), "", "See CONTRIBUTING.md for help."].join("\n"), false);
} else {
  report(`✅ **Learners Wall check passed** for \`${expected}\`. A maintainer will review it soon. Thanks for learning in public!`, true);
}

function report(message, ok) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, message + "\n");
  process.exit(ok ? 0 : 1);
}
