# Git 6: Power tools

These commands aren't needed every day, but each one saves you hours on the day you need it.

## Stash: park work for later

You're halfway through something and need to switch branches *now*:

```bash
git stash push -m "half-done search filter"   # park your changes
git switch hotfix                              # do the urgent thing...
git switch -                                   # back to where you were
git stash pop                                  # bring your changes back
```

| Command | What it does |
|---------|-------------|
| `git stash list` | see everything you've parked |
| `git stash show -p stash@{1}` | see what's in a specific stash |
| `git stash apply` | bring changes back but **keep** them in the stash list |
| `git stash pop` | bring changes back and **remove** them from the list |
| `git stash push -u` | also stash new, untracked files |
| `git stash drop stash@{1}` | delete one stash |

> 💡 Stashes are easy to forget. If something sits there for more than a day, it probably deserves a branch:
> `git stash branch rescued-work`

## Cherry-pick: copy one commit

You fixed a bug on a feature branch, and `main` needs that one fix today:

```bash
git switch main
git cherry-pick 9a8b7c6
```

Git applies that single commit's changes as a new commit on `main`. Add `-x` to note where it came from in the message, which is handy for release branches.

## Bisect: find the commit that broke it

Something worked last week and is broken now, with 80 commits in between. `git bisect` finds the culprit with a binary search, in about 7 steps instead of 80:

```bash
git bisect start
git bisect bad                 # the current commit is broken
git bisect good v1.2.0         # this tag (or commit ID) was fine
# Git checks out a commit in the middle. Test it, then tell Git:
git bisect good                # or: git bisect bad
# ...repeat until Git prints "<id> is the first bad commit"
git bisect reset               # go back to where you started
```

Have a test command that fails when the bug is present? Let Git do all the steps:

```bash
git bisect run npm test
```

## Blame and pickaxe: why is this line like this?

```bash
git blame -L 40,60 src/cart.js       # who last changed lines 40–60, and in which commit
git log -S "applyDiscount" --oneline  # every commit that added or removed this text
git log -p --follow src/cart.js       # the full history of one file, even across renames
```

`blame` isn't for blaming people. It finds the commit, so you can read the message and the PR that explain *why*. On GitHub, open a file and click **Blame** for the same view.

## Tags: mark releases

```bash
git tag -a v1.0.0 -m "First public release"   # an annotated tag, with author, date and message
git push origin v1.0.0                         # tags aren't pushed automatically
git tag                                        # list tags
```

Use [semantic versioning](https://semver.org/): `MAJOR.MINOR.PATCH`. Bump MAJOR for breaking changes, MINOR for new features and PATCH for fixes. On GitHub, **Releases → Draft a new release** turns a tag into a release page with notes and downloads.

## .gitignore: keep junk out

Create a `.gitignore` file in your repo's root folder:

```gitignore
# dependencies and build output
node_modules/
dist/

# secrets: never commit these
.env
*.pem

# OS and editor clutter
.DS_Store
.vscode/
```

| Pattern | Matches |
|---------|---------|
| `*.log` | any `.log` file, anywhere |
| `build/` | any folder named `build` |
| `/config.local.js` | only that file in the root |
| `!keep.log` | un-ignore something matched earlier |

Already committed a file you meant to ignore? Ignoring it doesn't remove it. Stop tracking it, but keep it on your disk:

```bash
git rm --cached .env
git commit -m "Stop tracking .env"
```

If that file held a secret, **the secret is still in your history**. Follow the [leaked secret steps](../oh-no.md#i-committed-a-password-or-api-key).

GitHub has ready-made templates for most languages at [github/gitignore](https://github.com/github/gitignore).

## Aliases: make your own shortcuts

```bash
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all --decorate"
git config --global alias.undo "reset --soft HEAD~1"
git config --global alias.amend "commit --amend --no-edit"
```

Now `git st`, `git lg`, `git undo` and `git amend` work everywhere.

## 🎓 You've finished Git fundamentals

You now know more Git than most working developers use day to day. Keep the ["Oh no" guide](../oh-no.md) bookmarked. Mistakes happen to everyone, and now you know how to undo them.

🧱 **Learners Wall:** add a line to your page saying you finished the Git track, and which power tool you liked most.

➡️ Next: the GitHub skills track starts with [GitHub 1: Your profile as a portfolio](../github/01-profile.md)
