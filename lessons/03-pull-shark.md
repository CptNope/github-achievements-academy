# Lesson 3: Pull Shark 🦈

**Badge:** have pull requests **merged**.

| Tier | Merged PRs |
|------|-----------:|
| Base | 2 |
| 🥉 Bronze | 16 |
| 🥈 Silver | 128 |
| 🥇 Gold | 1024 |

## The real skill: contributing to someone else's project

In Lesson 2 you merged into your own repo. Most open source work goes through a **fork**: your own copy of someone else's repo. You push to your fork and ask the original ("upstream") project to pull your changes in.

> ⚠️ Only PRs **merged into the parent repo** count. Commits that stay in your fork don't.

## Exercise: join the Learners Wall (earns the base tier)

### PR #1: create your page
```bash
gh repo fork CptNope/github-achievements-academy --clone
cd github-achievements-academy
git switch -c add-<your-username>
cp learners/_TEMPLATE.md learners/<your-username>.md    # use your exact GitHub username, lowercase
# edit the file: tell us about yourself and tick the lessons you've done
git add learners/<your-username>.md
git commit -m "learners: add <your-username>"
git push -u origin add-<your-username>
gh pr create --fill
```

An automated check verifies your PR. Then a maintainer reviews and merges it. 🎉

### PR #2: after your next lesson
```bash
git switch main
git pull upstream main          # gh sets up "upstream" when you fork with --clone
git switch -c update-<your-username>
# tick the new lesson and write one sentence about what you learned
git commit -am "learners: update <your-username> progress"
git push -u origin update-<your-username>
gh pr create --fill
```

Once two of your PRs are merged, you'll get the base badge.

## Going further, honestly (Bronze and beyond)

Higher tiers come from being a **real contributor**. Good places to start:

- **Your own projects.** Use a branch-and-PR workflow for real features in repos you own. Each merged PR counts, and it gives you a clean history. (One real change per PR. Don't split a typo fix into 20 PRs.)
- **Good first issues.** Search [`label:"good first issue" is:open`](https://github.com/search?q=label%3A%22good+first+issue%22+is%3Aopen&type=issues) for projects you actually use.
- **Docs and translations.** Maintainers love these.
- **This repo!** Keeping the achievement info accurate, fixing typos, and translating lessons are all welcome.

🚫 Don't send trivial whitespace or "fixed typo in comment" PRs to strangers just to collect merges. Maintainers notice, and it's the spam [FAIR-PLAY.md](../FAIR-PLAY.md) warns about.

## What you learned
- Fork, upstream, branch, PR
- Passing CI checks and responding to review
- Keeping your fork in sync

➡️ Next: [Lesson 4: Pair Extraordinaire](04-pair-extraordinaire.md)
