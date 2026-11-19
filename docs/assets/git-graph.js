// Draws a GitSim commit graph as SVG. Shared by the sandbox (live) and the lesson build (static),
// so a diagram in a lesson looks exactly like the graph learners see when they practice.

const GAP_Y = 78, PAD_X = 40, TOP = 64, R = 13;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// Lanes: main first, then other branches by age, then detached HEAD and tags, then commits on no branch.
function lanesFor(sim) {
  const lane = {}; let next = 0;
  const chain = (tip) => { const out = []; let c = tip; while (c) { out.push(c); c = sim.commits[c].parents[0]; } return out; };
  const tips = [];
  if (sim.branches.main) tips.push(sim.branches.main);
  Object.entries(sim.branches).filter(([b]) => b !== "main").sort((a, b) => sim.commits[a[1]].n - sim.commits[b[1]].n).forEach(([, t]) => tips.push(t));
  if (sim.head.detached) tips.push(sim.head.detached);
  Object.values(sim.tags).forEach((t) => tips.push(t));
  for (const tip of tips) {
    let used = false;
    for (const c of chain(tip)) { if (lane[c] !== undefined) break; lane[c] = next; used = true; }
    if (used) next++;
  }
  const orphans = sim.order.filter((c) => lane[c] === undefined).sort((a, b) => sim.commits[b].n - sim.commits[a].n);
  for (const c of orphans) {
    if (lane[c] !== undefined) continue;
    for (const x of chain(c)) { if (lane[x] !== undefined) break; lane[x] = next; }
    next++;
  }
  return { lane, lanes: next };
}

function labelsFor(sim) {
  const labels = {};
  const add = (id, l) => (labels[id] = labels[id] || []).push(l);
  for (const [b, t] of Object.entries(sim.branches)) add(t, { text: b, on: sim.head.branch === b, kind: "branch" });
  for (const [t, v] of Object.entries(sim.tags)) add(v, { text: t, kind: "tag" });
  if (sim.head.detached) add(sim.head.detached, { text: "HEAD", on: true, kind: "branch" });
  return labels;
}

/**
 * @param {GitSim} sim
 * @param {{ fresh?: Set<string>, showIds?: boolean, msgMax?: number, big?: boolean }} opts
 *   fresh: ids that are new since the last draw (they get a pop-in animation)
 *   big:   lesson style, where the commit message is the main label (e.g. "A", "B")
 */
export function renderGraph(sim, opts = {}) {
  const { fresh = null, showIds = true, msgMax = 13, big = false, noLabels = false } = opts;
  const GAP_X = big ? 74 : 92;
  const reach = sim.reachable();
  const { lane, lanes } = lanesFor(sim);
  const ids = sim.order;
  const x = (id) => PAD_X + sim.commits[id].n * GAP_X;
  const y = (id) => TOP + lane[id] * GAP_Y;
  const labels = noLabels ? {} : labelsFor(sim);
  const maxStack = Math.max(1, ...Object.values(labels).map((a) => a.length));
  const lift = (maxStack - 1) * 24;
  const W = PAD_X * 2 + (ids.length - 1) * GAP_X + 60;
  const H = TOP + lift + Math.max(1, lanes) * GAP_Y + (big ? 4 : 10);
  const head = sim.headId();
  let svg = `<svg class="gg${big ? " gg-big" : ""}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g transform="translate(0 ${lift})">`;
  for (const id of ids) for (const p of sim.commits[id].parents) {
    const x1 = x(p), y1 = y(p), x2 = x(id), y2 = y(id);
    const d = y1 === y2 ? `M${x1},${y1} L${x2},${y2}` : `M${x1},${y1} C${x1 + GAP_X * 0.6},${y1} ${x2 - GAP_X * 0.6},${y2} ${x2},${y2}`;
    svg += `<path class="edge${reach.has(id) ? "" : " faded"}" d="${d}"/>`;
  }
  for (const id of ids) {
    const f = reach.has(id) ? "" : " faded";
    const isNew = fresh && !fresh.has(id) ? " new" : "";
    const m = sim.commits[id].msg; const short = m.length > msgMax ? m.slice(0, msgMax - 1) + "…" : m;
    svg += `<g><title>${esc(id)}: ${esc(m)}</title><circle class="node${id === head ? " head" : ""}${f}${isNew}" cx="${x(id)}" cy="${y(id)}" r="${R}"/>`;
    if (big) {
      svg += `<text class="cmsg-big${f ? " faded-t" : ""}" x="${x(id)}" y="${y(id) + R + 20}" text-anchor="middle">${esc(short)}</text>`;
      if (showIds) svg += `<text class="cid${f ? " faded-t" : ""}" x="${x(id)}" y="${y(id) + R + 36}" text-anchor="middle">${id}</text>`;
    } else {
      if (showIds) svg += `<text class="cid${f ? " faded-t" : ""}" x="${x(id)}" y="${y(id) + R + 15}" text-anchor="middle">${id}</text>`;
      svg += `<text class="cmsg${f ? " faded-t" : ""}" x="${x(id)}" y="${y(id) + R + 29}" text-anchor="middle">${esc(short)}</text>`;
    }
    svg += "</g>";
    (labels[id] || []).forEach((l, i) => {
      const w = l.text.length * 7.4 + 16; const ly = y(id) - R - 12 - i * 24;
      svg += `<g class="lbl${l.on ? " on" : ""}${l.kind === "tag" ? " tag" : ""}"><rect x="${x(id) - w / 2}" y="${ly - 15}" width="${w}" height="21" rx="10.5"/><text x="${x(id)}" y="${ly}" text-anchor="middle">${esc(l.text)}</text></g>`;
    });
  }
  svg += "</g></svg>";
  return { svg, label: describeGraph(sim) };
}

// A plain-language description for screen readers (and anyone who prefers text).
export function describeGraph(sim) {
  const reach = sim.reachable();
  const name = (id) => sim.commits[id].msg;
  const parts = sim.order.map((id) => {
    const c = sim.commits[id];
    const after = c.parents.length === 0 ? "the first commit" : c.parents.length === 1 ? `after ${name(c.parents[0])}` : `merging ${c.parents.map(name).join(" and ")}`;
    return `${name(id)} (${after}${reach.has(id) ? "" : ", no longer on any branch"})`;
  });
  const labels = Object.entries(sim.branches).map(([b, t]) => `${b} points to ${name(t)}`);
  Object.entries(sim.tags).forEach(([t, v]) => labels.push(`tag ${t} on ${name(v)}`));
  const head = sim.head.branch ? `HEAD is on ${sim.head.branch}` : `HEAD is detached at ${name(sim.head.detached)}`;
  return `Commit graph. Commits: ${parts.join("; ")}. ${labels.join(", ")}. ${head}.`;
}
