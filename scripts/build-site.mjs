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
const GROUPS = ["Badges", "Git fundamentals", "GitHub skills", "Guides"];
const pages = [
  ...numbered("lessons").map((f) => ({ src: `lessons/${f}`, out: f.replace(/\.md$/, ".html"), group: "Badges", label: "Lesson" })),
  ...numbered("lessons/git").map((f) => ({ src: `lessons/git/${f}`, out: "git-" + f.replace(/\.md$/, ".html"), group: "Git fundamentals", label: "Git" })),
  ...numbered("lessons/github").map((f) => ({ src: `lessons/github/${f}`, out: "github-" + f.replace(/\.md$/, ".html"), group: "GitHub skills", label: "GitHub" })),
  { src: "lessons/oh-no.md", out: "oh-no.html", group: "Guides", detail: "Undo any Git mistake" },
  { src: "lessons/troubleshooting.md", out: "troubleshooting.html", group: "Guides", detail: "When a badge won't show" },
  { src: "FAIR-PLAY.md", out: "fair-play.html", group: "Guides", detail: "Read before you start" },
];
const bySrc = new Map(pages.map((p) => [p.src, p]));

const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}]️?|️|‍/gu;
const clean = (s) => s.replace(EMOJI, "").replace(/\s{2,}/g, " ").trim();
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => clean(s).toLowerCase().replace(/<[^>]+>/g, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");

// Read titles first so navigation can use them.
for (const p of pages) {
  p.md = readFileSync(join(ROOT, p.src), "utf8");
  const h1 = (p.md.match(/^#\s+(.+)$/m) || [, p.out])[1];
  p.title = clean(h1);
  const m = p.title.match(/^(?:Lesson|Git|GitHub)\s+(\d+):\s*(.+)$/i);
  p.num = m ? Number(m[1]) : null;
  p.short = m ? m[2] : p.title;
  if (p.src === "FAIR-PLAY.md") p.short = "Fair play";
  if (p.src === "lessons/oh-no.md") p.short = "Oh no! Undo mistakes";
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
      table(token) {
        // wrap tables so they scroll on small screens instead of widening the page
        const head = token.header.map((c) => `<th${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map((r) => "<tr>" + r.map((c) => `<td${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</td>`).join("") + "</tr>")
          .join("\n");
        return `<div class="table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  return marked.parse(p.md);
}

const nav = (current) =>
  GROUPS.map((g) => {
    const items = pages
      .filter((p) => p.group === g)
      .map((p) => {
        const label = p.num !== null ? `<span class="n">${p.num}</span>${esc(p.short)}` : esc(p.short);
        return `<li><a href="${p.out}"${p === current ? ' aria-current="page"' : ""}>${label}</a></li>`;
      })
      .join("\n        ");
    return `<h2>${esc(g)}</h2>\n    <ol>\n        ${items}\n    </ol>`;
  }).join("\n    ");

function layout({ title, description, body, current }) {
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
<body>
<a class="skip" href="#content">Skip to content</a>
<header class="bar">
  <a class="mark" href="../">Earn it<span class="vh">: GitHub Achievements Academy home</span></a>
  <nav aria-label="Site">
    <a href="index.html"${current === "index" ? ' aria-current="page"' : ""}>Lessons</a>
    <a href="../#check">Check a profile</a>
    <a href="${REPO}">GitHub</a>
  </nav>
</header>
${body}
<footer class="foot">
  <p>GitHub Achievements Academy · free and MIT licensed · by <a href="https://jeremyanderson.tech">Jeremy Anderson Tech</a></p>
  <p>Not affiliated with GitHub. GitHub is a trademark of GitHub, Inc.</p>
</footer>
<!-- Generated by scripts/build-site.mjs from the Markdown sources. Do not edit by hand. -->
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

pages.forEach((p, i) => {
  const html = render(p);
  const prev = pages[i - 1];
  const next = pages[i + 1];
  const pager = `<nav class="pager" aria-label="Next and previous">
    ${prev ? `<a class="prev" href="${prev.out}"><span>Previous</span>${esc(prev.title)}</a>` : "<span></span>"}
    ${next ? `<a class="next" href="${next.out}"><span>Next</span>${esc(next.title)}</a>` : `<a class="next" href="index.html"><span>Back to</span>All lessons</a>`}
  </nav>`;
  const body = `<div class="page">
  <main id="content" class="lesson">
    <h1>${esc(p.title)}</h1>
    ${onThisPage(html)}
    <article class="prose">
${html}
    </article>
    <p class="edit"><a href="${REPO}/blob/main/${p.src}">Improve this page on GitHub</a>. Every fix you send counts toward Pull Shark.</p>
    ${pager}
  </main>
  <aside class="toc" aria-label="All lessons">
    ${nav(p)}
  </aside>
</div>`;
  writeFileSync(join(OUT, p.out), layout({ title: p.title, description: firstSentence(p.md), body, current: p }));
});

// Index of all lessons
const INTRO = {
  "Badges": "Earn every obtainable GitHub achievement, and learn the real skill behind each one.",
  "Git fundamentals": "Master Git itself: how it works, branching, rebasing, remotes and the power tools.",
  "GitHub skills": "Work the way professional teams do: profiles, Issues and Projects, code review, Actions, releases, security and open source.",
  "Guides": "Keep these open in a tab. Everyone needs them eventually.",
};
const list = GROUPS.map((g) => {
  const items = pages
    .filter((p) => p.group === g)
    .map((p) => `<li><a href="${p.out}"><span class="item">${esc(p.short)}</span><span class="detail">${p.num !== null ? `${p.label} ${p.num}` : esc(p.detail)}</span></a></li>`)
    .join("\n      ");
  return `<section class="track" id="${slug(g)}" aria-labelledby="t-${slug(g)}">
    <h2 id="t-${slug(g)}">${esc(g)}</h2>
    <p>${esc(INTRO[g])}</p>
    <ul class="poster">
      ${items}
    </ul>
  </section>`;
}).join("\n  ");
writeFileSync(
  join(OUT, "index.html"),
  layout({
    title: "All lessons",
    description: "Every lesson in GitHub Achievements Academy: the GitHub badges track, Git fundamentals, GitHub skills, and guides for undoing mistakes.",
    current: "index",
    body: `<main id="content" class="index">
  <h1>All lessons</h1>
  <p class="lead">Three tracks and three guides. Start with the badges, master Git itself, then learn to work like a professional team on GitHub. Each track runs in order, top to bottom.</p>
  ${list}
</main>`,
  })
);

console.log(`Built ${pages.length + 1} pages into docs/learn/`);
