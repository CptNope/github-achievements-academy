# Git 5: Remotes, fetch, pull and push

A **remote** is another copy of your repository somewhere else, usually on GitHub. Understanding how your copy and the remote stay in sync clears up most "why won't it push?" moments.

## See your remotes

```bash
git remote -v
```

```
origin    https://github.com/you/project.git (fetch)
origin    https://github.com/you/project.git (push)
```

`origin` is just the default name for the place you cloned from. If you forked a project, you'll often add the original as `upstream`:

```bash
git remote add upstream https://github.com/original-owner/project.git
```

## Fetch vs. pull

| Command | What it does | Changes your files? |
|---------|-------------|---------------------|
| `git fetch` | Downloads new commits and updates `origin/main` and the other remote labels | **No** |
| `git pull` | `fetch`, then merges (or [rebases](04-rebase.md#keep-pull-from-making-messy-merges)) into your current branch | Yes |

`git fetch` is always safe. Use it to look before you leap:

```bash
git fetch
git log --oneline main..origin/main    # commits on GitHub you don't have yet
git log --oneline origin/main..main    # your commits GitHub doesn't have yet
```

## Push, and tracking branches

The first time you push a new branch, tell Git where it goes:

```bash
git push -u origin my-feature
```

`-u` (short for `--set-upstream`) links your local branch to `origin/my-feature`. After that, plain `git push` and `git pull` know where to go, and `git status` tells you if you're ahead or behind:

```
Your branch is ahead of 'origin/my-feature' by 2 commits.
```

See every branch's tracking info at once:

```bash
git branch -vv
```

## "Updates were rejected"

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs
```

This means GitHub has commits you don't have, often because you merged a PR on the website. Git refuses to push because that would throw those commits away. The fix:

```bash
git pull          # bring them down (merge or rebase)
git push          # now it works
```

**Don't** reach for `--force` here. That's the command that deletes other people's work.

## Keep your fork in sync

When you've forked a project (like in [Lesson 3](../03-pull-shark.md)), the original keeps moving. Bring your fork up to date:

**On github.com:** open your fork and click **Sync fork → Update branch**.

**With the CLI:**
```bash
gh repo sync                   # updates your fork's default branch on GitHub
git pull                       # then bring it down locally
```

**With plain Git:**
```bash
git switch main
git fetch upstream
git merge upstream/main        # or: git rebase upstream/main
git push origin main
```

Then start new work from the fresh `main`: `git switch -c next-thing`.

## Clean up stale branches

Branches deleted on GitHub (for example after a PR merge) still show as `origin/…` labels locally until you prune them:

```bash
git fetch --prune
git config --global fetch.prune true    # do it automatically on every fetch
```

## HTTPS or SSH?

Both work. HTTPS with the GitHub CLI (`gh auth login`) is the easiest setup. SSH keys are popular with people who push a lot. GitHub's docs walk through [connecting with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh). Either way, **never paste a token or password into a repo file.**

## What you learned
- What `origin` and `upstream` are
- Fetch vs. pull, and how to compare your branch with GitHub's
- Tracking branches, fixing rejected pushes, and keeping a fork in sync

➡️ Next: [Git 6: Power tools](06-power-tools.md)
