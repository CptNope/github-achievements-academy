# Git and GitHub cheat sheet

Every command from the course on one page. Print it (it fits two sides of a page), or keep it open in a tab. `<thing>` means "put your own value here".

## Set up once

| Command | What it does |
|---------|-------------|
| `git config --global user.name "Name"` | Name on your commits |
| `git config --global user.email you@example.com` | Must be a verified email on GitHub |
| `git config --global pull.rebase true` | Pull rebases instead of making merge commits |
| `git config --global fetch.prune true` | Clean up deleted remote branches on fetch |
| `git config --global alias.lg "log --oneline --graph --all --decorate"` | Adds a `git lg` shortcut |
| `gh auth login` | Sign in the GitHub CLI |

## Start a project

| Command | What it does |
|---------|-------------|
| `git init` | Make the current folder a repo |
| `git clone <url>` | Copy a repo from GitHub |
| `gh repo create <name> --public --clone` | New GitHub repo, cloned locally |
| `gh repo fork <owner/repo> --clone` | Fork and clone in one step |

## The everyday loop

| Command | What it does |
|---------|-------------|
| `git status` | What changed, and what's staged |
| `git diff` | Unstaged changes, line by line |
| `git diff --staged` | What the next commit will contain |
| `git add <file>` · `git add -p` | Stage a file · stage piece by piece |
| `git restore --staged <file>` | Unstage, keeping your edits |
| `git commit -m "Fix crash on empty cart"` | Save a snapshot |
| `git log --oneline -10` | The last 10 commits |
| `git show <ref>` | One commit in full |

## Branches

| Command | What it does |
|---------|-------------|
| `git switch -c <name>` | Create a branch and move to it |
| `git switch <name>` · `git switch -` | Move to a branch · back to the last one |
| `git branch` · `git branch -vv` | List branches · with tracking info |
| `git branch -d <name>` | Delete a merged branch (`-D` to force) |
| `git merge <branch>` | Bring a branch into the current one |
| `git merge --abort` | Back out of a conflicted merge |
| `git rebase main` | Replay your commits on top of main |
| `git rebase -i main` | Tidy commits: reword, squash, fixup, drop |
| `git rebase --continue` · `--abort` | Carry on after fixing a conflict · cancel |

## Remotes

| Command | What it does |
|---------|-------------|
| `git remote -v` | List remotes |
| `git remote add upstream <url>` | Track the project you forked from |
| `git fetch` | Download new commits, change nothing locally |
| `git pull` | Fetch, then update your branch |
| `git push -u origin <branch>` | First push of a new branch |
| `git push --force-with-lease` | Safe force-push after a rebase, on your own branch only |
| `gh repo sync` | Update your fork from the original |

## Undo

| Situation | Command |
|-----------|---------|
| Fix the last commit's message | `git commit --amend -m "New message"` |
| Add a forgotten file to the last commit | `git add <file>` then `git commit --amend --no-edit` |
| Throw away changes to a file | `git restore <file>` (can't be undone) |
| Undo the last commit, keep the changes | `git reset --soft HEAD~1` |
| Undo a commit that's already pushed | `git revert <commit>` |
| Find "lost" commits | `git reflog` |
| Bring back a deleted branch | `git branch <name> <commit>` |
| Go back to before a bad rebase or reset | `git reset --hard ORIG_HEAD` |
| Keep work made in detached HEAD | `git switch -c <name>` |

Full explanations are in the [Oh no! guide](oh-no.md).

## Power tools

| Command | What it does |
|---------|-------------|
| `git stash push -m "note"` · `git stash pop` | Park work · bring it back |
| `git stash list` | See parked work |
| `git cherry-pick <commit>` | Copy one commit onto your branch |
| `git bisect start` · `bad` · `good <ref>` · `reset` | Binary-search for the commit that broke something |
| `git blame -L 10,20 <file>` | Who last changed those lines, and in which commit |
| `git log -S "text"` | Commits that added or removed some text |
| `git tag -a v1.0.0 -m "msg"` · `git push origin v1.0.0` | Tag a release · push the tag |
| `git rm --cached <file>` | Stop tracking a file, keep it on disk |

## Refs: ways to name a commit

| Ref | Means |
|-----|-------|
| `HEAD` | Where you are now |
| `HEAD~1` · `HEAD~3` | One or three commits back |
| `main^2` | The second parent of a merge commit |
| `origin/main` | Where main was on GitHub when you last fetched |
| `HEAD@{2}` | Where HEAD was two moves ago (from the reflog) |
| `a1b2c3d` | Any commit, by the start of its ID |

## GitHub CLI

| Command | What it does |
|---------|-------------|
| `gh pr create --fill` | Open a PR from the current branch |
| `gh pr checkout 123` | Check out PR #123 locally |
| `gh pr merge --squash --delete-branch` | Merge and tidy up |
| `gh issue create` · `gh issue list` | Create · list issues |
| `gh release create v1.2.0 --generate-notes` | Publish a release |
| `gh run watch` | Follow an Actions run live |

## Words that trip people up

| Word | Meaning |
|------|---------|
| Working tree | The files you see and edit |
| Staging area (index) | What goes into the next commit |
| Fast-forward | Merge by moving the label, with no merge commit |
| Upstream | The branch or repo yours tracks or came from |
| Detached HEAD | You're on a commit, not a branch |
| Squash | Combine several commits into one |

Practice any of this safely in the [Git sandbox](https://cptnope.github.io/github-achievements-academy/sandbox/).
