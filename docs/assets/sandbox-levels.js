// Guided challenges for the Git sandbox. Each level runs `setup` silently, then checks `goal(sim)`
// after every command. Keep goals about the graph, not about which exact commands were typed:
// there's usually more than one right answer.

const tipMsg = (s, ref) => s.commits[s.resolve(ref)].msg;
const has = (s, b) => s.branches[b] !== undefined;
const contains = (s, branch, msgTest) => has(s, branch) && [...s.ancestors(s.branches[branch])].some((id) => msgTest(s.commits[id].msg));
const countAhead = (s, a, b) => s._range(s.branches[b], s.branches[a]).length;

export const LEVELS = [
  {
    id: "commits",
    title: "Your first commits",
    lesson: "git-01-how-git-works.html",
    intro: "Each commit is a snapshot that points back to the one before it. Make **two commits** on `main` and watch the chain grow, and the `main` label move with it.",
    setup: [],
    goal: (s) => s.ancestors(s.branches.main).size >= 3 && s.head.branch === "main",
    hint: 'git commit -m "Add homepage"',
    solution: ['git commit -m "Add homepage"', 'git commit -m "Add contact page"'],
  },
  {
    id: "branch",
    title: "Branch out",
    lesson: "git-03-branching-and-merging.html",
    intro: "Create a branch called **`feature`**, switch to it, and make **two commits** there. Notice that `main` stays where it was: a branch is just a label.",
    setup: ['git commit -m "Set up project"'],
    goal: (s) => has(s, "feature") && s.head.branch === "feature" && countAhead(s, "feature", "main") >= 2,
    hint: "git switch -c feature",
    solution: ["git switch -c feature", 'git commit -m "Add search box"', 'git commit -m "Style search box"'],
  },
  {
    id: "fast-forward",
    title: "A fast-forward merge",
    lesson: "git-03-branching-and-merging.html",
    intro: "`feature` is two commits ahead and `main` hasn't moved. **Merge `feature` into `main`.** Because nothing diverged, Git just slides the `main` label forward, with no merge commit.",
    setup: ["git switch -c feature", 'git commit -m "Add search box"', 'git commit -m "Style search box"'],
    goal: (s) => s.branches.main === s.branches.feature && s.head.branch === "main",
    hint: "Switch to main first: git switch main",
    solution: ["git switch main", "git merge feature"],
  },
  {
    id: "merge-commit",
    title: "A merge commit",
    lesson: "git-03-branching-and-merging.html",
    intro: "This time **both** branches have new commits. **Merge `feature` into `main`.** Git creates a merge commit with two parents to join them.",
    setup: ["git switch -c feature", 'git commit -m "Add search box"', "git switch main", 'git commit -m "Fix footer typo"'],
    goal: (s) => s.commits[s.branches.main].parents.length === 2 && s.isAncestor(s.branches.feature, s.branches.main),
    hint: "You're already on main. Merge the other branch into it.",
    solution: ["git merge feature"],
  },
  {
    id: "rebase",
    title: "Rebase onto main",
    lesson: "git-04-rebase.html",
    intro: "`main` moved on while you worked on `feature`. **Rebase `feature` onto `main`** so your work sits on top of the latest `main` in a straight line. Watch your commits get new IDs.",
    setup: ["git switch -c feature", 'git commit -m "Add search box"', 'git commit -m "Style search box"', "git switch main", 'git commit -m "Update dependencies"', "git switch feature"],
    goal: (s) => s.isAncestor(s.branches.main, s.branches.feature) && countAhead(s, "feature", "main") >= 2 &&
      s._range(s.branches.main, s.branches.feature).every((id) => s.commits[id].parents.length === 1),
    hint: "You're on feature. Rebase it onto main.",
    solution: ["git rebase main"],
  },
  {
    id: "undo-local",
    title: "Undo a commit you haven't pushed",
    lesson: "oh-no.html#i-want-to-uncommit-but-keep-my-changes",
    intro: "Oops: the last commit on `main` was a mistake, and it hasn't been pushed. **Move `main` back so the \"oops\" commit isn't on it.** (It'll still be in the reflog, faded on the graph.)",
    setup: ['git commit -m "Add pricing page"', 'git commit -m "oops: commit debug logs"'],
    goal: (s) => s.head.branch === "main" && !contains(s, "main", (m) => m.startsWith("oops")) && contains(s, "main", (m) => m === "Add pricing page"),
    hint: "HEAD~1 means one commit before where you are.",
    solution: ["git reset --soft HEAD~1"],
  },
  {
    id: "revert",
    title: "Undo a commit that's already pushed",
    lesson: "oh-no.html#i-need-to-undo-a-commit-thats-already-pushed",
    intro: "The \"Change checkout button\" commit broke the site, and it's **already on GitHub**, so rewriting history would hurt your team. **Undo it with a new commit** instead.",
    setup: ['git commit -m "Change checkout button"', 'git commit -m "Update README"'],
    goal: (s) => contains(s, "main", (m) => m === "Change checkout button") && contains(s, "main", (m) => m === 'Revert "Change checkout button"') && contains(s, "main", (m) => m === "Update README"),
    hint: "git log shows commit IDs. Use HEAD~1 or the ID with git revert.",
    solution: ["git revert HEAD~1"],
  },
  {
    id: "rescue-branch",
    title: "Rescue a deleted branch",
    lesson: "oh-no.html#i-deleted-a-branch-i-needed",
    intro: "Someone deleted the **`experiment`** branch, which had two commits nobody merged. They're not gone. **Bring back `experiment`** pointing at its last commit. The reflog remembers everywhere HEAD has been.",
    setup: ["git switch -c experiment", 'git commit -m "Try new layout"', 'git commit -m "Tweak new layout colors"', "git switch main", "git branch -D experiment"],
    goal: (s) => has(s, "experiment") && s.commits[s.branches.experiment].msg === "Tweak new layout colors",
    hint: "Run git reflog and look for the commit 'Tweak new layout colors'.",
    solutionFn: (s) => { const id = s.reflog.find((r) => r.msg.includes("Tweak new layout colors")).id; return [`git branch experiment ${id}`]; },
  },
  {
    id: "cherry-pick",
    title: "Copy just one fix",
    lesson: "git-06-power-tools.html#cherry-pick-copy-one-commit",
    intro: "`feature` has three commits, but only **\"Fix login bug\"** is ready. **Get that one fix onto `main`** without the other two.",
    setup: ["git switch -c feature", 'git commit -m "Start redesign"', 'git commit -m "Fix login bug"', 'git commit -m "More redesign"', "git switch main"],
    goal: (s) => contains(s, "main", (m) => m === "Fix login bug") && !contains(s, "main", (m) => m.includes("redesign")),
    hint: "git log feature shows the IDs of feature's commits.",
    solutionFn: (s) => ["git cherry-pick feature~1"],
  },
  {
    id: "detached",
    title: "Save work from a detached HEAD",
    lesson: "oh-no.html#i-am-in-detached-head-state",
    intro: "You checked out an old commit to look around, then made an **\"Important fix\"** commit there. You're in detached HEAD, so it isn't on any branch yet. **Put it on a branch** before it gets lost.",
    setup: ['git commit -m "Release 1.0"', 'git commit -m "Start 1.1"', "git switch --detach HEAD~1", 'git commit -m "Important fix"'],
    goal: (s) => Object.keys(s.branches).some((b) => contains(s, b, (m) => m === "Important fix")),
    hint: "git switch -c <name> creates a branch right where you are.",
    solution: ["git switch -c hotfix"],
  },
];
