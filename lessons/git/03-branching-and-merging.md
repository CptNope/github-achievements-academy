# Git 3: Branching and merging

Branches let you try things without risking `main`. Merging brings the work back. Merge conflicts are the part that scares people, so this lesson includes a safe practice conflict you can solve on your own machine.

## Make, switch, list, delete

```bash
git switch -c add-search     # create a branch and switch to it
git switch main              # go back to main
git branch                   # list local branches (* marks where you are)
git branch -d add-search     # delete a branch that's been merged
```

> 💡 Older tutorials use `git checkout` for this. `git switch` (for branches) and `git restore`
> (for files) do the same jobs with clearer names. Both have existed since Git 2.23.

Got uncommitted changes? `git switch` brings them with you if they don't clash. If they would be overwritten, Git refuses and asks you to commit or [stash](06-power-tools.md#stash-park-work-for-later) first. It never throws away your work silently.

## Two kinds of merge

**Fast-forward.** If `main` hasn't moved since you branched, Git just slides the `main` label forward to your latest commit. No new commit is needed:

```
before:  A ← B ← C  ← main
                  ↖ D ← E  ← feature

after:   A ← B ← C ← D ← E  ← main, feature
```

**Merge commit.** If both branches have new commits, Git creates a new commit with **two parents** that joins them:

```
A ← B ← C ← F ← M   ← main
         ↖ D ← E ↙
```

```bash
git switch main
git merge feature            # fast-forward if possible, merge commit if not
git merge --no-ff feature    # always make a merge commit (keeps a visible "feature" bump)
```

On GitHub, the **Merge pull request** button gives you three choices:

| Option | Result |
|--------|--------|
| Create a merge commit | Keeps every commit, plus a merge commit |
| Squash and merge | All the PR's commits become **one** commit on main |
| Rebase and merge | Replays each commit on top of main, with no merge commit |

## Merge conflicts, demystified

A conflict happens when both branches changed **the same lines** of the same file. Git can't guess which version is right, so it stops and asks you. Nothing is broken or lost.

The file will contain markers like this:

```
<<<<<<< HEAD
Welcome to the Blue Cafe!
=======
Welcome to the Green Cafe!
>>>>>>> rename-cafe
```

- Between `<<<<<<< HEAD` and `=======` is **your current branch's** version
- Between `=======` and `>>>>>>> rename-cafe` is the **incoming** version

**To resolve:**

1. Edit the file so it says what it *should* say. Keep one version, combine them, or write something new. **Delete all three marker lines.**
2. Stage it: `git add <file>`
3. Finish the merge: `git commit` (Git suggests a message)

Changed your mind halfway? `git merge --abort` puts everything back the way it was before the merge.

🎮 **See it happen:** the sandbox has challenges for [branching](https://cptnope.github.io/github-achievements-academy/sandbox/?level=branch), [fast-forward merges](https://cptnope.github.io/github-achievements-academy/sandbox/?level=fast-forward) and [merge commits](https://cptnope.github.io/github-achievements-academy/sandbox/?level=merge-commit), with a live graph.

> 💡 VS Code shows **Accept Current / Accept Incoming / Accept Both** buttons above each conflict,
> and a 3-way merge editor. Use them, but always read the result before committing.

## Practice: a conflict made just for you

This repo includes a [script](../../scripts/practice-conflict.sh) that builds a tiny throwaway repo with a conflict waiting in it. It runs entirely on your computer and never touches GitHub. Run it from your clone of this repo (you made one in [Lesson 3](../03-pull-shark.md)). On Windows, use Git Bash:

```bash
./scripts/practice-conflict.sh
cd /tmp/git-conflict-practice     # the script prints the exact path
git merge rename-cafe             # → CONFLICT!
```

Now resolve it using the steps above. Check your work with `git log --oneline --graph`. You should see the two branches joined by a merge commit. Delete the folder when you're done.

## Keep branches short-lived

The longer a branch lives, the more `main` moves underneath it, and the bigger your conflicts get. Good habits:

- One branch per task, merged within days, not weeks
- Pull `main` into your branch (or [rebase onto it](04-rebase.md)) regularly
- Delete branches once they're merged. GitHub can do this automatically: **Settings → General → Automatically delete head branches**

## What you learned
- Creating, switching and deleting branches
- Fast-forward merges vs. merge commits, and GitHub's three merge buttons
- Reading conflict markers and resolving conflicts calmly

➡️ Next: [Git 4: Rebase without fear](04-rebase.md)
