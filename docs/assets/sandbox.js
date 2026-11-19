import { GitSim } from "./git-engine.js";
import { LEVELS } from "./sandbox-levels.js";
import { renderGraph } from "./git-graph.js";

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
  sim.rootMessage = l.root || "Initial commit";
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
function draw() {
  const { svg, label } = renderGraph(sim, { fresh: lastIds });
  const g = $("graph");
  g.innerHTML = svg;
  g.setAttribute("aria-label", label);
  g.scrollLeft = g.scrollWidth;
  lastIds = new Set(sim.order);
}

// ---------- boot ----------
const params = new URLSearchParams(location.search);
const want = params.get("level");
try {
  const cmds = JSON.parse(params.get("cmds") || "null");
  if (Array.isArray(cmds) && cmds.length <= 40 && cmds.every((c) => typeof c === "string" && c.startsWith("git ") && c.length < 120)) {
    FREE.setup = cmds; FREE.root = params.get("root") || undefined;
    FREE.intro = "This is the graph from the lesson you came from. Carry on from here: try a commit, a merge or a rebase, and watch what changes. Type `restart` to rebuild it.";
  }
} catch { /* ignore a malformed link */ }
start(FREE.setup.length ? FREE : ALL.find((l) => l.id === want) || ALL.find((l) => !solved.has(l.id)) || ALL[0]);
