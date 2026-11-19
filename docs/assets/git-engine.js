// A small, honest simulation of Git's commit graph for the sandbox.
// It models commits, branches, tags, HEAD and the reflog. There are no files, so every
// commit is a snapshot with a message. That's enough to practice branching, merging,
// rebasing and undoing, which is where people actually get stuck.

export class GitSim {
  constructor() { this.reset(); }

  reset() {
    this.commits = {};        // id -> { id, parents: [], msg, n }
    this.order = [];          // ids in creation order
    this.branches = {};       // name -> id
    this.tags = {};           // name -> id
    this.head = { branch: "main" };   // or { detached: id }
    this.reflog = [];         // newest first: { id, msg }
    this.counter = 0;
    this.stashes = [];
    const root = this._newCommit([], "Initial commit");
    this.branches.main = root;
    this._log(root, "commit (initial): Initial commit");
  }

  // ---------- helpers ----------
  _hash() {
    // deterministic 7-char hex ids that look like Git's
    let x = (++this.counter * 2654435761) >>> 0;
    x ^= x >>> 13; x = Math.imul(x, 0x5bd1e995) >>> 0; x = (x ^ (x >>> 15)) >>> 0;
    return x.toString(16).padStart(8, "0").slice(0, 7);
  }
  _newCommit(parents, msg) {
    const id = this._hash();
    this.commits[id] = { id, parents: [...parents], msg, n: this.order.length };
    this.order.push(id);
    return id;
  }
  _log(id, msg) { this.reflog.unshift({ id, msg }); }
  headId() { return this.head.branch ? this.branches[this.head.branch] : this.head.detached; }
  _moveHead(id) { if (this.head.branch) this.branches[this.head.branch] = id; else this.head.detached = id; }
  where() { return this.head.branch ? this.head.branch : "detached HEAD"; }

  ancestors(id) {
    const seen = new Set(); const stack = [id];
    while (stack.length) { const c = stack.pop(); if (!c || seen.has(c)) continue; seen.add(c); stack.push(...this.commits[c].parents); }
    return seen;
  }
  isAncestor(a, b) { return this.ancestors(b).has(a); }   // is a reachable from b
  reachable() {
    const all = new Set();
    const tips = [...Object.values(this.branches), ...Object.values(this.tags), this.headId(), ...this.stashes];
    for (const t of tips) for (const c of this.ancestors(t)) all.add(c);
    return all;
  }

  resolve(ref) {
    if (!ref) throw new Error("missing a branch, tag or commit");
    const m = ref.match(/^(.+?)((?:[~^]\d*)*)$/);
    let base = m[1]; const suffix = m[2] || "";
    let id;
    if (base === "HEAD" || base === "@") id = this.headId();
    else if (base === "ORIG_HEAD") id = this.origHead;
    else if (/^HEAD@\{(\d+)\}$/.test(base)) { const k = +base.match(/\d+/)[0]; id = this.reflog[k]?.id; }
    else if (this.branches[base]) id = this.branches[base];
    else if (this.tags[base]) id = this.tags[base];
    else {
      const hits = this.order.filter((c) => c.startsWith(base.toLowerCase()));
      if (base.length >= 4 && hits.length === 1) id = hits[0];
      else if (hits.length > 1) throw new Error(`short ID '${base}' is ambiguous`);
    }
    if (!id) throw new Error(`'${ref}' isn't a branch, tag or commit here`);
    for (const step of suffix.match(/[~^]\d*/g) || []) {
      const kind = step[0]; const num = step.length > 1 ? +step.slice(1) : 1;
      if (kind === "~") { for (let i = 0; i < num; i++) { id = this.commits[id].parents[0]; if (!id) throw new Error(`${ref} goes back further than the first commit`); } }
      else { id = this.commits[id].parents[num - 1]; if (!id) throw new Error(`${ref}: that parent doesn't exist`); }
    }
    return id;
  }

  // commits reachable from `tip` but not from `base`, oldest first (first-parent friendly)
  _range(base, tip) {
    const exclude = this.ancestors(base);
    return [...this.ancestors(tip)].filter((c) => !exclude.has(c)).sort((a, b) => this.commits[a].n - this.commits[b].n);
  }

  // ---------- command line ----------
  run(line) {
    const args = tokenize(line.trim());
    if (!args.length) return "";
    if (args[0] !== "git") {
      if (["help", "?"].includes(args[0])) return HELP;
      throw new Error(`'${args[0]}' isn't available here. Every command starts with 'git'. Type 'help' for the list.`);
    }
    const [, cmd, ...rest] = args;
    const fn = {
      commit: this.commit, branch: this.branch, switch: this.switch, checkout: this.checkout, merge: this.merge,
      rebase: this.rebase, reset: this.resetCmd, revert: this.revert, "cherry-pick": this.cherryPick, tag: this.tag,
      log: this.logCmd, reflog: this.reflogCmd, status: this.status, stash: this.stash, help: () => HELP,
    }[cmd];
    if (!fn) throw new Error(`'git ${cmd || ""}' isn't supported in the sandbox. Type 'help' to see what is.`);
    return fn.call(this, rest);
  }

  commit(a) {
    const amend = a.includes("--amend");
    let msg = flagValue(a, "-m") ?? flagValue(a, "--message");
    if (amend) {
      const old = this.commits[this.headId()];
      if (!old.parents.length) throw new Error("can't amend the initial commit in the sandbox");
      const id = this._newCommit(old.parents, msg ?? old.msg);
      this._moveHead(id); this._log(id, `commit (amend): ${this.commits[id].msg}`);
      return `[${this.where()} ${id}] ${this.commits[id].msg}  (replaced ${old.id}; the old commit still exists in the reflog)`;
    }
    msg = msg ?? `Commit ${this.order.length}`;
    const id = this._newCommit([this.headId()], msg);
    this._moveHead(id); this._log(id, `commit: ${msg}`);
    return `[${this.where()} ${id}] ${msg}`;
  }

  branch(a) {
    const del = a.find((x) => x === "-d" || x === "-D" || x === "--delete");
    const names = a.filter((x) => !x.startsWith("-"));
    if (del) {
      const name = names[0]; if (!this.branches[name]) throw new Error(`branch '${name}' not found`);
      if (this.head.branch === name) throw new Error(`can't delete '${name}' because you're on it. Switch to another branch first`);
      const id = this.branches[name];
      if (del === "-d" && !this.isAncestor(id, this.headId())) throw new Error(`'${name}' isn't fully merged. Use -D to delete it anyway (you can recover it from the reflog)`);
      delete this.branches[name];
      return `Deleted branch ${name} (was ${id}).`;
    }
    if (!names.length) return Object.keys(this.branches).sort().map((b) => (b === this.head.branch ? "* " : "  ") + b).join("\n");
    const [name, start] = names;
    validName(name);
    if (this.branches[name]) throw new Error(`a branch named '${name}' already exists`);
    this.branches[name] = start ? this.resolve(start) : this.headId();
    return `Created branch ${name} at ${this.branches[name]}`;
  }

  _goto(target, label) {
    const from = this.where();
    if (this.branches[target] !== undefined && !label) { this.head = { branch: target }; }
    else { this.head = { detached: this.resolve(target) }; }
    this._log(this.headId(), `checkout: moving from ${from} to ${target}`);
    return this.head.branch ? `Switched to branch '${target}'`
      : `HEAD is now at ${this.headId()} (detached HEAD). Commits you make here aren't on any branch: run 'git switch -c <name>' to keep them.`;
  }

  switch(a) {
    const create = flagValue(a, "-c") ?? flagValue(a, "--create") ?? flagValue(a, "-C");
    if (create) { const start = a.filter((x) => !x.startsWith("-") && x !== create)[0]; this.branch([create, ...(start ? [start] : [])]); this._goto(create); return `Switched to a new branch '${create}'`; }
    if (a.includes("--detach")) { const t = a.filter((x) => !x.startsWith("-"))[0] || "HEAD"; return this._goto(t, "detach"); }
    if (a[0] === "-") { const prev = this.reflog.find((r) => r.msg.startsWith("checkout: moving from"))?.msg.match(/from (\S+) to/)?.[1]; if (!prev || prev === "detached") throw new Error("no previous branch"); return this._goto(prev); }
    const t = a[0]; if (!t) throw new Error("switch to what? Try 'git switch main'");
    if (!this.branches[t]) throw new Error(`'${t}' isn't a branch. To look at a commit or tag, use 'git switch --detach ${t}'. To create a branch, use 'git switch -c ${t}'`);
    return this._goto(t);
  }

  checkout(a) {
    const b = flagValue(a, "-b");
    if (b) return this.switch(["-c", b, ...a.filter((x) => x !== "-b" && x !== b)]);
    const t = a[0]; if (!t) throw new Error("checkout what?");
    return this.branches[t] ? this._goto(t) : this._goto(t, "detach");
  }

  merge(a) {
    if (a.includes("--abort")) return "Nothing to abort: the sandbox has no files, so merges never conflict here. Try the practice-conflict script from Git 3 for real conflicts.";
    const noff = a.includes("--no-ff");
    const name = a.filter((x) => !x.startsWith("-"))[0];
    const theirs = this.resolve(name); const ours = this.headId();
    if (this.isAncestor(theirs, ours)) return "Already up to date.";
    if (this.isAncestor(ours, theirs) && !noff) {
      this.origHead = ours; this._moveHead(theirs); this._log(theirs, `merge ${name}: Fast-forward`);
      return `Updating ${ours}..${theirs}\nFast-forward`;
    }
    const msg = flagValue(a, "-m") ?? `Merge branch '${name}'${this.head.branch && this.head.branch !== "main" ? ` into ${this.head.branch}` : ""}`;
    this.origHead = ours;
    const id = this._newCommit([ours, theirs], msg);
    this._moveHead(id); this._log(id, `merge ${name}: Merge made by the 'ort' strategy.`);
    return `Merge made by the 'ort' strategy.\n[${this.where()} ${id}] ${msg}`;
  }

  rebase(a) {
    if (a.includes("--abort") || a.includes("--continue")) return "Nothing in progress: rebases never conflict in the sandbox, so they finish in one step.";
    if (a.includes("-i") || a.includes("--interactive")) return "Interactive rebase needs an editor, which the sandbox doesn't have. Practice it in your own repo with Git 4.";
    const onto = this.resolve(a.filter((x) => !x.startsWith("-"))[0]);
    const ours = this.headId();
    if (this.isAncestor(onto, ours)) return "Current branch is up to date.";
    this.origHead = ours;
    if (this.isAncestor(ours, onto)) { this._moveHead(onto); this._log(onto, "rebase (finish): fast-forward"); return `Fast-forwarded ${this.where()} to ${onto}.`; }
    const replay = this._range(onto, ours).filter((c) => this.commits[c].parents.length === 1);
    this._log(ours, "rebase (start)");
    let base = onto;
    for (const c of replay) { base = this._newCommit([base], this.commits[c].msg); this._log(base, `rebase (pick): ${this.commits[c].msg}`); }
    this._moveHead(base); this._log(base, `rebase (finish): returning to ${this.where()}`);
    return `Successfully rebased and updated ${this.where()}. Replayed ${replay.length} commit${replay.length === 1 ? "" : "s"} as new commits with new IDs.`;
  }

  resetCmd(a) {
    const mode = a.find((x) => ["--soft", "--mixed", "--hard"].includes(x)) || "--mixed";
    const target = this.resolve(a.filter((x) => !x.startsWith("-"))[0] || "HEAD");
    this.origHead = this.headId();
    this._moveHead(target); this._log(target, `reset: moving to ${a.filter((x) => !x.startsWith("-"))[0] || "HEAD"}`);
    const note = { "--soft": "(In a real repo, --soft keeps those changes staged.)", "--mixed": "(In a real repo, the changes stay in your files, unstaged.)", "--hard": "(In a real repo, --hard also throws away uncommitted changes. Commits are still in the reflog.)" }[mode];
    return `HEAD is now at ${target} ${this.commits[target].msg}\n${note}`;
  }

  revert(a) {
    const t = this.resolve(a.filter((x) => !x.startsWith("-"))[0]);
    const c = this.commits[t];
    if (c.parents.length > 1 && !a.includes("-m")) throw new Error(`${t} is a merge commit. Say which side to keep with -m 1`);
    const msg = `Revert "${c.msg}"`;
    const id = this._newCommit([this.headId()], msg);
    this._moveHead(id); this._log(id, `revert: ${msg}`);
    return `[${this.where()} ${id}] ${msg}`;
  }

  cherryPick(a) {
    const out = [];
    for (const r of a.filter((x) => !x.startsWith("-"))) {
      const t = this.resolve(r); const c = this.commits[t];
      if (c.parents.length > 1) throw new Error(`${t} is a merge commit. The sandbox can't cherry-pick merges`);
      const id = this._newCommit([this.headId()], c.msg);
      this._moveHead(id); this._log(id, `cherry-pick: ${c.msg}`);
      out.push(`[${this.where()} ${id}] ${c.msg}`);
    }
    if (!out.length) throw new Error("cherry-pick which commit?");
    return out.join("\n");
  }

  tag(a) {
    const names = a.filter((x) => !x.startsWith("-") && x !== flagValue(a, "-m"));
    if (a.includes("-d")) { const n = names[0]; if (!this.tags[n]) throw new Error(`tag '${n}' not found`); delete this.tags[n]; return `Deleted tag '${n}'`; }
    if (!names.length) return Object.keys(this.tags).sort().join("\n") || "(no tags yet)";
    validName(names[0]);
    if (this.tags[names[0]]) throw new Error(`tag '${names[0]}' already exists`);
    this.tags[names[0]] = names[1] ? this.resolve(names[1]) : this.headId();
    return `Tagged ${this.tags[names[0]]} as ${names[0]}`;
  }

  logCmd(a) {
    const start = a.includes("--all") ? null : this.resolve(a.filter((x) => !x.startsWith("-"))[0] || "HEAD");
    const set = start ? this.ancestors(start) : this.reachable();
    const ids = [...set].sort((x, y) => this.commits[y].n - this.commits[x].n);
    return ids.map((id) => `${id} ${this._decor(id)}${this.commits[id].msg}`).join("\n");
  }
  _decor(id) {
    const labels = [];
    if (this.head.detached === id) labels.push("HEAD");
    for (const [b, t] of Object.entries(this.branches)) if (t === id) labels.push(this.head.branch === b ? `HEAD -> ${b}` : b);
    for (const [t, v] of Object.entries(this.tags)) if (v === id) labels.push(`tag: ${t}`);
    return labels.length ? `(${labels.join(", ")}) ` : "";
  }
  reflogCmd() { return this.reflog.slice(0, 30).map((r, i) => `${r.id} HEAD@{${i}}: ${r.msg}`).join("\n"); }
  status() {
    return this.head.branch ? `On branch ${this.head.branch}\nnothing to commit (the sandbox has commits, not files)`
      : `HEAD detached at ${this.head.detached}\nCommits made here aren't on a branch. 'git switch -c <name>' keeps them.`;
  }
  stash() { return "The sandbox has no files, so there's nothing to stash. Stash is covered in Git 6."; }

  // ---------- snapshot for undo / levels ----------
  save() { return JSON.stringify({ c: this.commits, o: this.order, b: this.branches, t: this.tags, h: this.head, r: this.reflog, n: this.counter, oh: this.origHead }); }
  load(s) { const d = JSON.parse(s); Object.assign(this, { commits: d.c, order: d.o, branches: d.b, tags: d.t, head: d.h, reflog: d.r, counter: d.n, origHead: d.oh, stashes: [] }); }
}

function tokenize(s) {
  const out = []; const re = /"([^"]*)"|'([^']*)'|(\S+)/g; let m;
  while ((m = re.exec(s))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}
function flagValue(a, flag) { const i = a.indexOf(flag); return i >= 0 && i + 1 < a.length ? a[i + 1] : undefined; }
function validName(n) { if (!n || !/^[A-Za-z0-9._\/-]+$/.test(n) || n.startsWith("-") || n.endsWith("/") || n.includes("..")) throw new Error(`'${n}' isn't a valid name. Use letters, numbers, dashes, dots and slashes`); }

export const HELP = `Commands you can use (each starts with git):
  git commit -m "message"         make a commit        (--amend to replace the last one)
  git branch [name] [start]       list or create branches   (-d / -D name to delete)
  git switch name | -c name       move to a branch, or create one and move to it
  git switch --detach <ref>       look at a commit directly (detached HEAD)
  git checkout name | -b name     the older way to do the same
  git merge name [--no-ff]        merge a branch into the current one
  git rebase name                 replay your commits on top of another branch
  git reset [--soft|--hard] <ref> move the current branch to another commit
  git revert <ref>                add a commit that undoes another one
  git cherry-pick <ref>           copy a commit onto the current branch
  git tag name [ref]              label a commit
  git log [--all] · git reflog · git status

Refs can be branch names, tags, commit IDs (4+ chars), HEAD, HEAD~2, main^, HEAD@{3}, ORIG_HEAD.
Also: undo (step back), restart (reset this level), clear (clear the screen).`;
