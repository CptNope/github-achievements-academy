# Git 4: Rebase without fear

Rebasing has a scary reputation, but it does one simple thing: **it replays your commits on top of a different starting point.** Learn the one rule below and it becomes one of your favorite tools.

## What rebase does

Your branch started from commit B, but `main` has moved on:

```
A ← B ← C ← D          ← main
     ↖ E ← F           ← my-feature
```

```bash
git switch my-feature
git rebase main
```

Git takes your commits E and F, sets them aside, moves your branch to the tip of `main`, then replays them one by one:

```
A ← B ← C ← D          ← main
             ↖ E' ← F' ← my-feature
```

E' and F' have the same changes as E and F, but they're **new commits with new IDs**, because their parent changed. Remember that, because it's why the golden rule exists.

🎮 **Watch it:** in the [rebase sandbox challenge](https://cptnope.github.io/github-achievements-academy/sandbox/?level=rebase) your old commits fade out and new ones appear on top of `main`.

## Merge or rebase?

| | `git merge main` | `git rebase main` |
|---|---|---|
| History | Keeps exactly what happened, plus a merge commit | Straight line, as if you started today |
| Rewrites commits? | No | Yes, so your commits get new IDs |
| Conflicts | Resolved once | Resolved per commit, which can mean several times |
| Safe on shared branches? | Yes | **Only if nobody else uses the branch** |

Both are fine. Many teams merge on GitHub and rebase locally to stay current.

## ⚠️ The golden rule

> **Never rebase commits that other people have already based work on.**

Rebasing creates new commits. If a teammate built on the old ones, their history and yours no longer match, and everyone has a bad afternoon. Rebasing your *own* feature branch, even after pushing it for a PR, is normal. Just update the remote safely:

```bash
git push --force-with-lease
```

`--force-with-lease` refuses to overwrite the remote if someone else pushed in the meantime. **Never use plain `--force` on shared branches.**

## Conflicts during a rebase

Conflicts appear one commit at a time. For each one:

```bash
# fix the file(s), then:
git add <file>
git rebase --continue
```

Other options:

```bash
git rebase --skip     # drop this commit entirely (rarely what you want)
git rebase --abort    # cancel and go back to exactly where you started
```

## Interactive rebase: tidy up before you share

Before opening a PR, you can clean up messy local history ("wip", "fix typo", "actually fix it"):

```bash
git rebase -i main
```

Git opens a list of your commits, oldest first:

```
pick 1a2b3c4 Add search box
pick 5d6e7f8 wip
pick 9a8b7c6 fix typo in search
```

Change the word at the start of each line:

| Command | Effect |
|---------|--------|
| `pick` | keep the commit as is |
| `reword` | keep it, but edit the message |
| `squash` | combine with the commit above, and edit the combined message |
| `fixup` | combine with the commit above, keeping the message above |
| `drop` | delete the commit |

You can also reorder lines to reorder commits. Save and close, and Git does the rest. Mistake? `git rebase --abort`, or see the ["Oh no" guide](../oh-no.md#i-messed-up-a-rebase).

### The pro shortcut: fixup commits

Noticed a bug in a commit from earlier on your branch?

```bash
git commit --fixup 1a2b3c4          # makes a commit titled "fixup! Add search box"
git rebase -i --autosquash main     # it's already placed and marked as fixup, so just save
```

## Keep pull from making messy merges

By default `git pull` can create "Merge branch 'main' of github.com…" commits when your local branch and GitHub's have both moved. Many people prefer:

```bash
git config --global pull.rebase true
```

Now `git pull` rebases your local commits on top of what you fetched.

## Exercise (in your sandbox)

1. Make a branch with three small commits, including one called `wip`.
2. Run `git rebase -i main` and squash `wip` into the commit before it.
3. Check with `git log --oneline`. You should see two clean commits.

## What you learned
- Rebase replays your commits onto a new base, creating new commits
- The golden rule, and `--force-with-lease`
- Interactive rebase and fixup commits to tidy history before review

➡️ Next: [Git 5: Remotes, fetch, pull and push](05-remotes.md)
