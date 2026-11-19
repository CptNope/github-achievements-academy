# Oh no! Undoing Git mistakes

Everyone breaks something in Git eventually. The good news: **Git almost never truly loses committed work.** Find your situation below, copy the fix, and breathe.

> ⚠️ **First, a safety net.** Before trying a fix you're unsure about, make a backup label:
> `git branch backup-before-fix`
> If the fix goes wrong, `git switch backup-before-fix` takes you back. Delete it when you're done.

**Has it been pushed?** Many fixes depend on this. If a commit is only on your computer, you can rewrite it freely. If it's on GitHub and others might have pulled it, prefer fixes that **add** a new commit (like `git revert`) over ones that rewrite history.

🎮 **Practice before you need it:** the sandbox has safe challenges for [undoing a local commit](https://cptnope.github.io/github-achievements-academy/sandbox/?level=undo-local), [reverting a pushed one](https://cptnope.github.io/github-achievements-academy/sandbox/?level=revert), [rescuing a deleted branch](https://cptnope.github.io/github-achievements-academy/sandbox/?level=rescue-branch) and [escaping detached HEAD](https://cptnope.github.io/github-achievements-academy/sandbox/?level=detached).

## I made a typo in my last commit message

Not pushed yet:

```bash
git commit --amend -m "The corrected message"
```

Already pushed to your own branch (a PR branch only you use):

```bash
git commit --amend -m "The corrected message"
git push --force-with-lease
```

On `main` or a shared branch, leave it. A typo isn't worth rewriting shared history.

## I forgot to add a file to my last commit

```bash
git add forgotten-file.js
git commit --amend --no-edit
```

Same pushed/not-pushed rules as above.

## I staged a file I didn't mean to

```bash
git restore --staged wrong-file.js
```

Your edits stay in the file. They're just not staged anymore.

## I want to throw away my uncommitted changes to a file

```bash
git restore path/to/file.js
```

⚠️ This one really is permanent. Uncommitted changes were never saved by Git, so they can't be recovered. Not sure? Run `git stash` instead, and you can bring them back later.

## I want to undo my last commit, but keep the changes

```bash
git reset --soft HEAD~1      # the commit is gone, and its changes are staged
git reset HEAD~1             # the commit is gone, and its changes are unstaged
```

Use this only if the commit **hasn't been pushed**.

## I need to undo a commit that's already pushed

```bash
git revert <commit-id>
git push
```

`revert` makes a **new** commit that does the exact opposite of the old one. History stays intact, so it's safe on `main` and shared branches. To find the ID, run `git log --oneline`.

Reverting a merge commit needs one extra flag that says which side to keep. Usually that's `-m 1` (the branch you merged into):

```bash
git revert -m 1 <merge-commit-id>
```

## I committed to main instead of a branch

Not pushed yet:

```bash
git branch my-feature        # 1. put a label on your work so it's safe
git reset --hard HEAD~1      # 2. move main back one commit (use ~2, ~3… for more)
git switch my-feature        # 3. carry on, on the right branch
```

Check with `git log --oneline --graph --all` before step 2. If `main` was in sync with GitHub before your commits, `git reset --hard origin/main` works too.

## I committed to the wrong branch (not main)

```bash
git switch right-branch
git cherry-pick <commit-id>      # copy the commit over
git switch wrong-branch
git reset --hard HEAD~1          # remove it from the wrong branch (only if not pushed)
```

## I deleted a branch I needed

When you delete a branch, Git prints its last commit:

```
Deleted branch my-feature (was 3f9c2a1).
```

Bring it back:

```bash
git branch my-feature 3f9c2a1
```

Lost that message? Look in the **reflog**, Git's diary of everywhere `HEAD` has been:

```bash
git reflog
```

Find the last commit from that branch (the messages help) and run the same `git branch` command with its ID.

## I ran `git reset --hard` and lost commits

The commits still exist, and the reflog remembers them:

```bash
git reflog
# a1b2c3d HEAD@{0}: reset: moving to HEAD~3
# 9f8e7d6 HEAD@{1}: commit: The work I thought I lost   ← this one
git reset --hard 9f8e7d6
```

Reflog entries usually stick around for at least 30 days. They only exist on **your** computer, though, so the sooner you look, the better.

## I messed up a rebase

Still in the middle of it?

```bash
git rebase --abort
```

Already finished, and the result is wrong? The reflog has the commit from just before you started:

```bash
git reflog
# look for the line just before "rebase (start)", then:
git reset --hard <that-id>
```

Shortcut: `git reset --hard ORIG_HEAD` usually takes you back to just before your last rebase, merge or reset.

## I'm stuck in a merge with conflicts and want out

```bash
git merge --abort
```

Everything goes back to how it was before you ran `git merge`. See [Git 3](git/03-branching-and-merging.md#merge-conflicts-demystified) for how to resolve conflicts instead.

## I am in detached HEAD state

You checked out a commit or tag directly, so you're not on any branch. Just looking? Go back:

```bash
git switch main
```

Made commits you want to keep? Give them a branch **before** switching away:

```bash
git switch -c rescued-work
```

Already switched away and lost them? The reflog has them. See "I deleted a branch I needed" above.

## I committed a password or API key

Do these **in this order**:

1. **Revoke or rotate the secret right now**, wherever it was issued (AWS, Stripe, your database, etc.). Assume it's already been copied. Bots scan public GitHub for keys within minutes. Deleting the commit doesn't un-leak it.
2. **Remove it from your code**, move it to an environment variable or a secrets manager, and add the file to `.gitignore`.
3. **Remove it from history** if the repo is public or shared. GitHub recommends [git filter-repo](https://github.com/newren/git-filter-repo) for this. Their guide, [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository), walks through it, including how to ask GitHub to clear cached views.
4. **Prevent it next time.** Turn on **Secret scanning** and **Push protection**. Push protection blocks pushes that contain known key formats before they ever reach GitHub.

Step 1 is the one that actually protects you. Steps 2 to 4 just tidy up.

## GitHub rejected my push: "file is too large"

GitHub blocks files over 100 MB. Removing the file in a new commit isn't enough, because it's still in an earlier commit you're trying to push.

If it's only in your last commit and not pushed:

```bash
git rm --cached huge-file.zip
echo "huge-file.zip" >> .gitignore
git add .gitignore
git commit --amend --no-edit
git push
```

If it's further back in history, use `git filter-repo` (see above). For files you really do need to version, use [Git LFS](https://git-lfs.com/).

## I dropped a stash I needed

```bash
git fsck --unreachable | grep commit
```

Each line is a lost commit, and stashes are among them. Inspect them with `git show <id>`, then:

```bash
git stash apply <id>
```

## I force-pushed and overwrote someone's work

1. **Tell your team right away.** Ask anyone who pulled the old version not to push yet.
2. Anyone who still has the old commits locally (check `git reflog`, or their `origin/branch` label before fetching) can restore them:
   ```bash
   git push --force-with-lease origin <old-commit-id>:branch-name
   ```
3. If a pull request was involved, its page on GitHub often shows the old commits, which can help you find the right ID.

Next time, use `git push --force-with-lease`. It refuses to overwrite commits you haven't seen.

## Still stuck?

- Run `git status`. It often tells you exactly what state you're in and what to do next.
- Ask in our [Discussions Q&A](https://github.com/CptNope/github-achievements-academy/discussions/categories/q-a). Include what you ran and the full error message.
- [Oh Shit, Git!?!](https://ohshitgit.com/) and the free [Pro Git book](https://git-scm.com/book/en/v2) are excellent references.
