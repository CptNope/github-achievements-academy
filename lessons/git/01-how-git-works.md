# Git 1: How Git actually works

Most Git confusion comes from one missing picture. Once you can see what Git is storing, commands stop feeling like spells. This lesson has no commands to memorize, just the model that makes the rest easy.

## A commit is a snapshot

A commit isn't a list of changes. It's a **snapshot of your whole project** at one moment, plus:

- who made it, and when
- a message saying why
- a pointer to its **parent** commit (the one before it)

Every commit gets an ID, a long hash like `3f9c2a1e…`. You'll usually see the first 7 characters. The hash comes from the commit's contents, so if anything changes, the ID changes. That's why Git history is so hard to tamper with silently.

Because each commit points to its parent, your history forms a chain:

```
A ← B ← C
```

> 💡 Git doesn't waste space storing the same file twice. If a file didn't change between snapshots, both commits point to the same stored copy.

## A branch is just a label

This is the big one. A branch is **not** a copy of your code. It's a tiny file containing one commit ID, a movable label that says "this commit is the tip of `main`".

```
A ← B ← C   ← main
```

When you commit on `main`, Git makes commit D and moves the `main` label forward to it. Creating a branch just adds a second label:

```
A ← B ← C   ← main
            ← feature
```

That's why making a branch is instant, even in a huge project.

## HEAD is "you are here"

`HEAD` tells Git which branch you're currently on. When you run `git switch feature`, `HEAD` moves to point at `feature`, and your files change to match that branch's snapshot. New commits move whichever branch `HEAD` points at.

If `HEAD` points straight at a commit instead of a branch, Git calls that a **detached HEAD**. It's safe to look around, but commits you make there aren't on any branch. See the ["Oh no" guide](../oh-no.md#i-am-in-detached-head-state) if you end up there.

## The three places your work lives

| Place | What it is | Commands that move work here |
|-------|-----------|------------------------------|
| **Working tree** | The files you see and edit | (you, editing) |
| **Staging area** (also called the index) | What will go into your next commit | `git add` |
| **Repository** | The saved history of commits | `git commit` |

The staging area is what lets you commit *part* of your work. You can fix a bug and a typo in the same session, then commit them separately with clear messages.

## Local vs. remote

Your laptop holds a **full copy** of the repository, with every commit and every branch you've fetched. GitHub holds another copy. They only sync when you tell them to:

- `git fetch` / `git pull` bring commits **down** from GitHub
- `git push` sends commits **up** to GitHub

Git also keeps read-only labels like `origin/main`. They record where `main` was on GitHub the last time you fetched.

## Try it: see the model for yourself

```bash
git log --oneline --graph --all --decorate
```

You'll see commits as a graph, with branch labels (`main`, `origin/main`, `HEAD -> main`) attached to commits. Make a branch and look again:

```bash
git switch -c try-labels
git log --oneline --graph --all --decorate
```

Both labels sit on the same commit. Nothing was copied.

🎮 **No repo handy?** Try the [first sandbox challenge](https://cptnope.github.io/github-achievements-academy/sandbox/?level=commits) in your browser and watch commits and labels move as you type.

> 💡 This command is so useful that most people make a shortcut:
> `git config --global alias.lg "log --oneline --graph --all --decorate"`
> Now `git lg` shows the graph.

## What you learned
- Commits are snapshots that point to their parents
- Branches are movable labels, and `HEAD` is "you are here"
- Work moves from the working tree to the staging area to the repository
- Your copy and GitHub's copy only sync when you fetch, pull or push

➡️ Next: [Git 2: The everyday loop](02-everyday-loop.md)
