#!/usr/bin/env node
// Builds the lesson pages of the website (docs/learn/) from the Markdown in lessons/ and FAIR-PLAY.md.
// The Markdown stays the single source of truth: edit lessons/*.md, then run `npm run build`.
// CI (.github/workflows/site-up-to-date.yml) fails if the generated pages are out of date.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { posix, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "docs", "learn");
const REPO = "https://github.com/CptNope/github-achievements-academy";

// Pages, in reading order. `src` is relative to the repo root.
const numbered = (dir) => readdirSync(join(ROOT, dir)).filter((f) => /^\d\d-.+\.md$/.test(f)).sort();
const GROUPS = ["Start here", "Badges", "Git fundamentals", "GitHub skills", "Repo recipes", "Guides"];
const REVIEWED = "November 2026";
const pages = [
  { src: "lessons/start-here.md", out: "start-here.html", group: "Start here", detail: "Pick your path" },
  ...numbered("lessons").map((f) => ({ src: `lessons/${f}`, out: f.replace(/\.md$/, ".html"), group: "Badges", label: "Lesson" })),
  ...numbered("lessons/git").map((f) => ({ src: `lessons/git/${f}`, out: "git-" + f.replace(/\.md$/, ".html"), group: "Git fundamentals", label: "Git" })),
  ...numbered("lessons/github").map((f) => ({ src: `lessons/github/${f}`, out: "github-" + f.replace(/\.md$/, ".html"), group: "GitHub skills", label: "GitHub" })),
  ...numbered("lessons/repos").map((f) => ({ src: `lessons/repos/${f}`, out: "repo-" + f.replace(/\.md$/, ".html"), group: "Repo recipes", label: "Repo" })),
  { src: "lessons/oh-no.md", out: "oh-no.html", group: "Guides", detail: "Undo any Git mistake" },
  { src: "lessons/cheat-sheet.md", out: "cheat-sheet.html", group: "Guides", detail: "Print it, pin it", cls: "cheat" },
  { src: "lessons/markdown.md", out: "markdown.html", group: "Guides", detail: "Format READMEs and issues" },
  { src: "lessons/troubleshooting.md", out: "troubleshooting.html", group: "Guides", detail: "When a badge won't show" },
  { src: "FAIR-PLAY.md", out: "fair-play.html", group: "Guides", detail: "Read before you start" },
];
const bySrc = new Map(pages.map((p) => [p.src, p]));
const QUIZZES = JSON.parse(readFileSync(join(ROOT, "lessons", "quizzes.json"), "utf8"));
const stem = (p) => p.out.replace(/\.html$/, "");

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}]️?|️|‍/gu;
const clean = (s) => s.replace(EMOJI, "").replace(/\s{2,}/g, " ").trim();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => clean(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/&#?\w+;/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

// Read titles first so navigation can use them.
for (const p of pages) {
  p.md = readFileSync(join(ROOT, p.src), "utf8");
  const h1 = (p.md.match(/^#\s+(.+)$/m) || [, p.out])[1];
  p.title = clean(h1);
  const m = p.title.match(/^(?:Lesson|Git|GitHub|Repo)\s+(\d+):\s*(.+)$/i);
  p.num = m ? Number(m[1]) : null;
  p.short = m ? m[2] : p.title;
  if (p.src === "FAIR-PLAY.md") p.short = "Fair play";
  if (p.src === "lessons/oh-no.md") p.short = "Oh no! Undo mistakes";
  if (p.src === "lessons/cheat-sheet.md") p.short = "Cheat sheet";
  // Shorter names for the big-type lesson lists (full titles stay on the pages themselves)
  const SHORT = {
    "lessons/repos/01-foundations.md": "Foundations",
    "lessons/repos/02-personal-projects.md": "Personal projects",
    "lessons/repos/03-open-source-packages.md": "Packages",
    "lessons/repos/04-websites-and-docs.md": "Websites and docs",
    "lessons/repos/05-team-and-client-projects.md": "Team and client",
    "lessons/repos/06-wordpress-plugins.md": "WordPress",
    "lessons/repos/07-courses-and-templates.md": "Courses and templates",
    "lessons/repos/08-maintaining.md": "Maintaining",
  };
  if (SHORT[p.src]) p.short = SHORT[p.src];
  // the template sets the h1; emoji are dropped so the pages match the site's type-only look
  p.md = p.md.replace(/^#\s+.+\n/m, "").replace(/^[ \t]*[\p{Extended_Pictographic}]\uFE0F?[ \t]*/gmu, "").replace(/(\*\*|\| |^|\s)[\p{Extended_Pictographic}]\uFE0F?\s*/gmu, "$1");
}

function rewriteHref(href, fromSrc) {
  if (!href || /^(https?:|mailto:|#)/i.test(href)) return href;
  const [path, hash = ""] = href.split("#");
  const target = posix.normalize(posix.join(posix.dirname(fromSrc), path));
  const page = bySrc.get(target);
  if (page) return page.out + (hash ? "#" + hash : "");
  if (target === "README.md") return "../" + (hash ? "#" + hash : "");
  const isDir = path.endsWith("/") || !/\.[a-z0-9]+$/i.test(target);
  return `${REPO}/${isDir ? "tree" : "blob"}/main/${target.replace(/\/$/, "")}${hash ? "#" + hash : ""}`;
}

function render(p) {
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = clean(this.parser.parseInline(tokens));
        return `<h${depth} id="${slug(text)}">${text}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const out = rewriteHref(href, p.src);
        const ext = /^https?:/.test(out) ? ' rel="noopener"' : "";
        return `<a href="${esc(out)}"${title ? ` title="${esc(title)}"` : ""}${ext}>${this.parser.parseInline(tokens)}</a>`;
      },
      code({ text, lang }) {
        // focusable so keyboard users can scroll long lines (WCAG 2.1.1)
        const l = (lang || "").split(/\s/)[0];
        return `<pre tabindex="0"><code${l ? ` class="language-${esc(l)}"` : ""}>${esc(text)}</code></pre>\n`;
      },
      table(token) {
        // wrap tables so they scroll on small screens instead of widening the page
        const head = token.header.map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map((r) => "<tr>" + r.map((c) => `<td${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</td>`).join("") + "</tr>")
          .join("\n");
        const name = token.header.map((c) => c.text).filter(Boolean).slice(0, 2).join(" and ").replace(/[`*]/g, "");
        return `<div class="table" tabindex="0" role="region" aria-label="Table: ${esc(name || "details")}"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  // Give every scrollable table a unique name from the section it sits in (WCAG landmark names must differ)
  const named = (html) => {
    let section = p.title, seen = {};
    return html.replace(/<h[23] id="[^"]*">([\s\S]*?)<\/h[23]>|aria-label="Table: [^"]*"/g, (m, head) => {
      if (head !== undefined) { section = head.replace(/<[^>]+>/g, "").replace(/&#?\w+;/g, "'"); return m; }
      seen[section] = (seen[section] || 0) + 1;
      return `aria-label="Table: ${esc(section)}${seen[section] > 1 ? ` (${seen[section]})` : ""}"`;
    });
  };
  // Task-list checkboxes: wrap each in a label so it has an accessible name, and let readers tick them
  return named(marked.parse(p.md)).replace(/<li><input (checked="" )?disabled="" type="checkbox">\s*([\s\S]*?)<\/li>/g,
    (_, checked, body) => `<li class="task"><label><input type="checkbox"${checked ? " checked" : ""}> <span>${body.trim()}</span></label></li>`);
}

const nav = (current) =>
  GROUPS.map((g) => {
    const items = pages
      .filter((p) => p.group === g)
      .map((p) => {
        const label = p.num !== null ? `<span class="n">${p.num}</span>${esc(p.short)}` : esc(p.short);
        return `<li><a href="${p.out}" data-page="${stem(p)}"${p === current ? ' aria-current="page"' : ""}>${label}</a></li>`;
      })
      .join("\n        ");
    const only = pages.filter((p) => p.group === g);
    if (only.length === 1 && only[0].short === g) {
      const p = only[0];
      return `<p class="toc-start"><a href="${p.out}" data-page="${stem(p)}"${p === current ? ' aria-current="page"' : ""}>${esc(p.short)}</a></p>`;
    }
    const open = current && current.group === g ? " open" : "";
    return `<details class="toc-group"${open}><summary><h2>${esc(g)}</h2></summary>\n    <ol>\n        ${items}\n    </ol></details>`;
  }).join("\n    ");

function layout({ title, description, body, current, pageId = "", bodyClass = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · GitHub Achievements Academy</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0c0a08">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%230c0a08'/%3E%3Cpath d='M16 5l3.2 7 7.6.7-5.7 5 1.7 7.5L16 21.3 9.2 25.2l1.7-7.5-5.7-5 7.6-.7z' fill='%23c9a45a'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/learn.css">
</head>
<body${pageId ? ` data-page="${pageId}"` : ""}${bodyClass ? ` class="${bodyClass}"` : ""}>
<a class="skip" href="#content">Skip to content</a>
<header class="bar">
  <a class="mark" href="../">Earn it<span class="vh">: GitHub Achievements Academy home</span></a>
  <nav aria-label="Site">
    <a href="index.html"${current === "index" ? ' aria-current="page"' : ""}>Lessons</a>
    <a href="../sandbox/">Sandbox</a>
    <a href="cheat-sheet.html"${current?.out === "cheat-sheet.html" ? ' aria-current="page"' : ""}>Cheat sheet</a>
    <a href="${REPO}">GitHub</a>
  </nav>
</header>
${body}
<footer class="foot">
  <p>GitHub Achievements Academy · free and MIT licensed · by <a href="https://jeremyanderson.tech">Jeremy Anderson Tech</a></p>
  <p>Not affiliated with GitHub. GitHub is a trademark of GitHub, Inc.</p>
</footer>
<!-- Generated by scripts/build-site.mjs from the Markdown sources. Do not edit by hand. -->
<script src="../assets/learn.js" defer></script>
</body>
</html>
`;
}

function firstSentence(md) {
  const para = md.split(/\n\s*\n/).map((s) => s.trim()).find((s) => s && !/^[#>|`-]/.test(s)) || "";
  return clean(para.replace(/\*\*|`|\[([^\]]+)\]\([^)]+\)/g, "$1")).slice(0, 155);
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Pages with many sections (like the "Oh no" guide) get a jump list so people can find their problem fast.
function onThisPage(html) {
  const heads = [...html.matchAll(/<h2 id="([^"]+)">(.+?)<\/h2>/g)];
  if (heads.length < 6) return "";
  return `<nav class="jump" aria-label="On this page">
      <h2>On this page</h2>
      <ul>
        ${heads.map(([, id, text]) => `<li><a href="#${id}">${text}</a></li>`).join("\n        ")}
      </ul>
    </nav>`;
}

// End-of-lesson quiz. Works as a self-check with JavaScript, and shows the answers without it.
function quizHtml(p) {
  const qs = QUIZZES[stem(p)];
  if (!qs) { if (p.num !== null) console.warn(`No quiz for ${stem(p)}`); return ""; }
  const md = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>");
  const sets = qs.map((q, i) => `<fieldset data-answer="${q.answer}">
        <legend><span class="qn">${i + 1}.</span> ${md(q.q)}</legend>
        ${q.options.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> <span>${md(o)}</span></label>`).join("\n        ")}
        <p class="why" hidden><strong class="verdict"></strong> ${md(q.why)}</p>
      </fieldset>`).join("\n      ");
  const answers = qs.map((q, i) => `<li>${md(q.options[q.answer])}: ${md(q.why)}</li>`).join("");
  return `<section class="quiz" aria-labelledby="quiz-h">
    <h2 id="quiz-h">Check what you learned</h2>
    <form id="quiz-form">
      ${sets}
      <div class="quiz-actions"><button type="submit" class="mark-btn">Check my answers</button><button type="reset" class="link-btn">Start over</button></div>
      <p id="quiz-result" class="quiz-result" tabindex="-1" aria-live="polite"></p>
    </form>
    <details class="quiz-answers"><summary>Show the answers</summary><ol>${answers}</ol></details>
  </section>`;
}

const tag = (p) => (p.num !== null ? `: ${p.label} ${p.num}` : "");

pages.forEach((p, i) => {
  const html = render(p);
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const pager = `<nav class="pager" aria-label="Next and previous">
    ${prev ? `<a class="prev" href="${prev.out}"><span>Previous${tag(prev)}</span>${esc(prev.short)}</a>` : "<span></span>"}
    ${next ? `<a class="next" href="${next.out}"><span>Next${tag(next)}</span>${esc(next.short)}</a>` : `<a class="next" href="index.html"><span>Back to</span>All lessons</a>`}
  </nav>`;
  const body = `<div class="page">
  <main id="content" class="lesson">
    <h1>${esc(p.title)}</h1>
    ${p.cls === "cheat" ? `<button type="button" class="mark-btn print-btn" onclick="window.print()">Print this cheat sheet</button>` : onThisPage(html)}
    <article class="prose">
${html}
    </article>
    ${quizHtml(p)}
    ${p.num !== null ? `<div class="complete"><button type="button" id="mark-done" class="mark-btn" aria-pressed="false">Mark this lesson complete</button><p>Your progress is saved in this browser only.</p></div>` : ""}
    <p class="edit">Last reviewed ${REVIEWED}. <a href="${REPO}/blob/main/${p.src}">Improve this page on GitHub</a>. Every fix you send counts toward Pull Shark.</p>
    ${pager}
  </main>
  <aside class="toc" aria-label="All lessons">
    ${nav(p)}
  </aside>
</div>`;
  writeFileSync(join(OUT, p.out), layout({ title: p.title, description: firstSentence(p.md), body, current: p, pageId: stem(p), bodyClass: p.cls || "" }));
});

// Index of all lessons
const INTRO = {
  "Start here": "New here? Pick a path that matches where you are, from total beginner to team lead.",
  "Badges": "Earn every obtainable GitHub achievement, and learn the real skill behind each one.",
  "Git fundamentals": "Master Git itself: how it works, branching, rebasing, remotes and the power tools.",
  "GitHub skills": "Work the way professional teams do: profiles, Issues and Projects, code review, Actions, releases, security and open source.",
  "Repo recipes": "Set up the right repo for the job, from portfolio pieces, packages and websites to client projects, WordPress plugins and courses, then keep it healthy for years.",
  "Guides": "Keep these open in a tab. Everyone needs them eventually.",
};
const TRACKS = GROUPS.filter((g) => g !== "Start here");
const trackPages = (g) => pages.filter((p) => p.group === g);
const progressHtml = (g) => `<div class="track-progress"><div class="bar" aria-hidden="true"><i class="bar-fill"></i></div><span data-track-progress="${esc(g)}" aria-live="polite"></span></div>`;
const list = TRACKS.map((g) => {
  const items = trackPages(g)
    .map((p) => `<li><a href="${p.out}" data-page="${stem(p)}" data-track="${esc(g)}"${p.num !== null ? " data-lesson" : ""}><span class="detail">${p.num !== null ? `${p.label} ${p.num}` : "Guide"}</span><span class="item">${esc(p.short)}</span>${p.num === null ? `<span class="note">${esc(p.detail)}</span>` : ""}</a></li>`)
    .join("\n        ");
  return `<section class="track" id="${slug(g)}" aria-labelledby="t-${slug(g)}">
    <div class="track-head">
      <h2 id="t-${slug(g)}">${esc(g)}</h2>
      <p>${esc(INTRO[g])}</p>
      ${g !== "Guides" ? progressHtml(g) : ""}
    </div>
    <ol class="track-list">
        ${items}
    </ol>
  </section>`;
}).join("\n  ");
const map = TRACKS.map((g) => {
  const n = trackPages(g).length;
  return `<li><a href="#${slug(g)}"><strong>${esc(g)}</strong><span>${n} ${g === "Guides" ? "guides" : "lessons"}</span></a>${g !== "Guides" ? progressHtml(g) : ""}</li>`;
}).join("\n      ");
writeFileSync(
  join(OUT, "index.html"),
  layout({
    title: "All lessons",
    description: "Every lesson in GitHub Achievements Academy: the GitHub badges track, Git fundamentals, GitHub skills, repo recipes, and guides for undoing mistakes.",
    current: "index",
    body: `<main id="content" class="index">
  <div class="index-hero">
    <div>
      <h1>All lessons</h1>
      <p class="lead">Four tracks, from your first commit to running real projects, and five guides to keep open in a tab. Each track runs in order, top to bottom. Practice anything in the <a href="../sandbox/">Git sandbox</a>.</p>
      <a class="start-band" href="start-here.html" data-page="start-here"><strong>New here? Start here</strong><span>Pick one of six paths, from total beginner to team lead</span></a>
    </div>
    <nav class="track-map" aria-label="Tracks on this page">
      <ol>
      ${map}
      </ol>
    </nav>
  </div>
  ${list}
  <p class="reset-row">Your progress is saved in this browser only. <button type="button" id="reset-progress" class="link-btn">Reset my progress</button></p>
</main>`,
  })
);

console.log(`Built ${pages.length + 1} pages into docs/learn/`);
