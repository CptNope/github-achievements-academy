# Git 2: The everyday loop

Ninety percent of your Git life is one loop: **look, choose, save, check.** Get fast and careful at this, and everything else is the occasional extra.

## 1. Look: what changed?

```bash
git status            # which files changed, and which are staged
git diff              # the exact lines changed, not yet staged
git diff --staged     # the exact lines that WILL go in the next commit
```

Make `git status` a reflex. Run it before and after everything. It also tells you what to do next, for example how to unstage a file.

## 2. Choose: stage what belongs together

```bash
git add path/to/file.js     # stage one file
git add .                   # stage everything in this folder (check git status first!)
git add -p                  # go through your changes piece by piece
```

`git add -p` is the habit that separates beginners from pros. Git shows each change ("hunk") and asks what to do:

| Key | Meaning |
|-----|---------|
| `y` | stage this hunk |
| `n` | skip it |
| `s` | split it into smaller hunks |
| `q` | quit |
| `?` | help |

You'll often catch a stray debug line or a forgotten `console.log` this way.

Changed your mind?

```bash
git restore --staged path/to/file.js   # unstage, but keep your edits
```

## 3. Save: write a commit message people can use

```bash
git commit -m "Fix crash when the cart is empty"
```

For anything bigger, leave out `-m` and Git opens your editor so you can write a subject and a body:

```
Fix crash when the cart is empty

The total() function divided by the item count, which is zero for an
empty cart. Return 0 early instead, and add a test for it.

Closes #42
```

**Good commit messages:**
- Keep the subject around **50 characters**, with no full stop at the end
- Use the **imperative mood**: "Fix crash", not "Fixed crash" or "Fixes crash". Read it as "This commit will… fix crash"
- Leave a blank line, then explain **why** in the body. The diff already shows what changed
- Mention issues: `Closes #42` closes the issue automatically when merged to the default branch on GitHub

Some teams use [Conventional Commits](https://www.conventionalcommits.org/) prefixes like `feat:`, `fix:` and `docs:`. This repo uses them too.

**Commit size:** one logical change per commit. "Add login form" is good. "Add login form, rename utils, update deps" should be three commits.

## 4. Check: did it do what you meant?

```bash
git log --oneline -5        # the last 5 commits, one line each
git show                    # the latest commit in full
git show HEAD~1             # the one before it
```

`HEAD~1` means "one commit before HEAD", and `HEAD~2` means two before. You'll use this notation a lot.

## Exercise (in your sandbox repo)

1. Edit two different parts of your README: fix something, and add something new.
2. Run `git diff` and read it.
3. Use `git add -p` to stage **only** the fix.
4. Run `git diff --staged` to confirm, then commit with a good message.
5. Stage and commit the addition separately.
6. Run `git log --oneline -3`. You should see two clean, separate commits.

🧱 **Learners Wall:** add a line to your page about your best commit message today.

## What you learned
- `status`, `diff` and `diff --staged` to see exactly what's going on
- `add -p` to build focused commits
- How to write commit messages people can actually use

➡️ Next: [Git 3: Branching and merging](03-branching-and-merging.md)
