import { GitSim } from "./git-engine.js";
import { LEVELS } from "./sandbox-levels.js";

const FREE = { id: "free", title: "Free play", lesson: "git-01-how-git-works.html", intro: "No goal: experiment freely. Try `git commit`, `git switch -c idea`, `git merge`, `git rebase`, `git reset` and `git reflog`. Type `restart` to start over.", setup: [] };
const ALL = [...LEVELS, FREE];
const STORE = "gaa-sandbox-v1";

const $ = (id) => document.getElementById(id);
const sim = new GitSim();
let level = ALL[0];
let cmdHistory = [], hIndex = 0, undoStack = [], solved = load(), lastIds = new Set(), complete = false;

function load() { try { return new Set(JSON.parse(localStorage.getItem(STORE) || "[]")); } catch { return new Set(); } }
function save() { try { localStorage.setItem(STORE, JSON.stringify([...solved])); } catch { /* storage unavailable: progress lasts this visit */ } }
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");

// ---------- level handling ----------
function fillPicker() {
  $("level-select").innerHTML = ALL.map((l, i) => `<option value="${l.id}">${l.id === "free" ? "" : i + 1 + ". "}${esc(l.title)}${solved.has(l.id) ? " (done)" : ""}</option>`).join("");
  $("level-select").value = level.id;
}

function start(l, { focus = false } = {}) {
  level = l; complete = false; undoStack = [];
  sim.reset();
  for (const c of l.setup) sim.run(c);
  lastIds = new Set(sim.order);
  $("level-title").textContent = l.title;
  $("level-intro").innerHTML = md(l.intro);
  $("level-help").textContent = "";
  $("level-done").hidden = true;
  $("btn-hint").hidden = $("btn-solution").hidden = l.id === "free";
  $("level-lesson").href = "../learn/" + l.lesson;
  $("out").innerHTML = "";
  print(l.id === "free" ? "Free play. Type help to see every command." : `Challenge: ${l.title}. Type help any time.`, "r");
  if (l.setup.length) print(`(${l.setup.length} command${l.setup.length === 1 ? " was" : "s were"} run to set this up. Try git log --all or git reflog to see the history.)`, "r");
  fillPicker(); draw(); prompt();
  const url = new URL(location.href); url.searchParams.set("level", l.id); try { window.history.replaceState(null, "", url); } catch { /* file:// or sandboxed frames */ }
  if (focus) $("cmd").focus();
}

function checkGoal() {
  if (complete || !level.goal || !level.goal(sim)) return;
  complete = true; solved.add(level.id); save(); fillPicker();
  const idx = ALL.indexOf(level);
  $("done-text").textContent = idx < LEVELS.length - 1 ? "Ready for the next one?" : "That's every challenge. Free play is next.";
  $("level-done").hidden = false;
  print("Level complete!", "s");
}

// ---------- terminal ----------
function print(text, cls) {
  const div = document.createElement("div"); div.className = cls; div.textContent = text;
  $("out").appendChild(div); $("out").scrollTop = $("out").scrollHeight;
}
function prompt() { $("prompt").textContent = `${sim.head.branch || sim.headId()} $`; }

function exec(line) {
  line = line.trim(); if (!line) return;
  cmdHistory.push(line); hIndex = cmdHistory.length;
  print(`$ ${line}`, "c");
  if (line === "clear") { $("out").innerHTML = ""; return; }
  if (line === "restart") { start(level); return; }
  if (line === "undo") {
    if (!undoStack.length) return print("Nothing to undo.", "r");
    sim.load(undoStack.pop()); draw(); prompt(); return print("Stepped back one command.", "r");
  }
  const snap = sim.save();
  try {
    const out = sim.run(line);
    if (out) print(out, "r");
    if (!/^git (log|reflog|status|branch$|tag$|help)|^help/.test(line)) undoStack.push(snap);
  } catch (e) {
    print(`error: ${e.message}`, "e");
  }
  draw(); prompt(); checkGoal();
}

$("form").addEventListener("submit", (e) => { e.preventDefault(); const v = $("cmd").value; $("cmd").value = ""; exec(v); });
$("cmd").addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && hIndex > 0) { hIndex--; $("cmd").value = cmdHistory[hIndex]; e.preventDefault(); }
  else if (e.key === "ArrowDown") { hIndex = Math.min(cmdHistory.length, hIndex + 1); $("cmd").value = cmdHistory[hIndex] || ""; e.preventDefault(); }
});
$("level-select").addEventListener("change", (e) => start(ALL.find((l) => l.id === e.target.value), { focus: true }));
$("btn-restart").addEventListener("click", () => start(level, { focus: true }));
$("btn-hint").addEventListener("click", () => { $("level-help").innerHTML = "Hint: " + (level.hint.startsWith("git ") ? `<code>${esc(level.hint)}</code>` : md(level.hint)); });
$("btn-solution").addEventListener("click", () => {
  const fresh = new GitSim(); for (const c of level.setup) fresh.run(c);
  const sol = level.solution || level.solutionFn(fresh);
  $("level-help").innerHTML = "One answer: " + sol.map((c) => `<code>${esc(c)}</code>`).join(" then ");
});
$("btn-next").addEventListener("click", () => { const i = ALL.indexOf(level); start(ALL[Math.min(i + 1, ALL.length - 1)], { focus: true }); });

// ---------- graph ----------
const GAP_X = 92, GAP_Y = 78, PAD_X = 40, TOP = 64, R = 13;

function lanesFor() {
  const lane = {}; let next = 0;
  const reach = sim.reachable();
  const chain = (tip) => { const out = []; let c = tip; while (c) { out.push(c); c = sim.commits[c].parents[0]; } return out; };
  const tips = [["main", sim.branches.main], ...Object.entries(sim.branches).filter(([b]) => b !== "main").sort((a, b) => sim.commits[a[1]].n - sim.commits[b[1]].n)];
  if (sim.head.detached) tips.push(["HEAD", sim.head.detached]);
  for (const [, t] of Object.entries(sim.tags)) tips.push(["tag", t]);
  for (const [, tip] of tips) {
    if (!tip) continue; let used = false;
    for (const c of chain(tip)) { if (lane[c] !== undefined) break; lane[c] = next; used = true; }
    if (used) next++;
  }
  // commits no longer on any branch (after reset, rebase or branch -D): their own lanes, faded
  const orphans = sim.order.filter((c) => lane[c] === undefined).sort((a, b) => sim.commits[b].n - sim.commits[a].n);
  for (const c of orphans) {
    if (lane[c] !== undefined) continue;
    for (const x of chain(c)) { if (lane[x] !== undefined) break; lane[x] = next; }
    next++;
  }
  return { lane, reach, lanes: next };
}

function draw() {
  const { lane, reach, lanes } = lanesFor();
  const ids = sim.order;
  const x = (id) => PAD_X + sim.commits[id].n * GAP_X;
  const y = (id) => TOP + lane[id] * GAP_Y;
  const W = PAD_X * 2 + (ids.length - 1) * GAP_X + 120;
  const H = TOP + Math.max(1, lanes) * GAP_Y + 10;
  const head = sim.headId();
  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  for (const id of ids) for (const p of sim.commits[id].parents) {
    const x1 = x(p), y1 = y(p), x2 = x(id), y2 = y(id);
    const d = y1 === y2 ? `M${x1},${y1} L${x2},${y2}` : `M${x1},${y1} C${x1 + GAP_X * 0.6},${y1} ${x2 - GAP_X * 0.6},${y2} ${x2},${y2}`;
    svg += `<path class="edge${reach.has(id) ? "" : " faded"}" d="${d}"/>`;
  }
  // labels per commit
  const labels = {};
  const add = (id, html) => (labels[id] = labels[id] || []).push(html);
  for (const [b, t] of Object.entries(sim.branches)) add(t, { text: b, on: sim.head.branch === b, kind: "branch" });
  for (const [t, v] of Object.entries(sim.tags)) add(v, { text: t, kind: "tag" });
  if (sim.head.detached) add(sim.head.detached, { text: "HEAD", on: true, kind: "branch" });
  for (const id of ids) {
    const f = reach.has(id) ? "" : " faded";
    const isNew = !lastIds.has(id) ? " new" : "";
    svg += `<g><title>${esc(id)}: ${esc(sim.commits[id].msg)}</title><circle class="node${id === head ? " head" : ""}${f}${isNew}" cx="${x(id)}" cy="${y(id)}" r="${R}"/>`;
    svg += `<text class="cid${f ? " faded-t" : ""}" x="${x(id)}" y="${y(id) + R + 15}" text-anchor="middle">${id}</text>`;
    const m = sim.commits[id].msg; const short = m.length > 13 ? m.slice(0, 12) + "…" : m;
    svg += `<text class="cmsg${f ? " faded-t" : ""}" x="${x(id)}" y="${y(id) + R + 29}" text-anchor="middle">${esc(short)}</text></g>`;
    (labels[id] || []).forEach((l, i) => {
      const w = l.text.length * 7.4 + 16; const ly = y(id) - R - 12 - i * 24;
      svg += `<g class="lbl${l.on ? " on" : ""}${l.kind === "tag" ? " tag" : ""}"><rect x="${x(id) - w / 2}" y="${ly - 15}" width="${w}" height="21" rx="10.5"/><text x="${x(id)}" y="${ly}" text-anchor="middle">${esc(l.text)}</text></g>`;
    });
  }
  svg += "</svg>";
  const maxLabels = Math.max(0, ...Object.values(labels).map((a) => a.length));
  const g = $("graph");
  g.innerHTML = svg;
  g.querySelector("svg").style.marginTop = Math.max(0, (maxLabels - 1) * 24) + "px";
  g.setAttribute("aria-label", `Commit graph: ${ids.length} commits. ${Object.entries(sim.branches).map(([b, t]) => `${b} at ${t}`).join(", ")}. HEAD ${sim.head.branch ? "on " + sim.head.branch : "detached at " + sim.head.detached}.`);
  g.scrollLeft = g.scrollWidth;
  lastIds = new Set(ids);
}

// ---------- boot ----------
const want = new URLSearchParams(location.search).get("level");
start(ALL.find((l) => l.id === want) || ALL.find((l) => !solved.has(l.id)) || ALL[0]);
