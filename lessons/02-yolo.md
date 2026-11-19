# Lesson 2: YOLO 🤠

**Badge:** merge a pull request **without a code review**. One-time.

## The real skill: the pull request flow (and why reviews exist)

A pull request (PR) says: "here's a set of changes on a branch, please merge them into `main`." On a team, someone reviews the PR first. In a solo project, you're often the only one, so you merge your own work. That's YOLO.

The badge's name is a wink: **on a team, skipping review is risky.** This lesson teaches the flow *and* how to protect yourself from YOLO-ing by accident later.

## Exercise (in your sandbox repo)

```bash
cd my-github-sandbox
git switch -c add-about-section          # 1. create a branch
printf "\n## About\nThis is my sandbox for learning GitHub.\n" >> README.md
git add README.md
git commit -m "docs: add About section"  # 2. commit
git push -u origin add-about-section     # 3. push the branch
gh pr create --fill                      # 4. open the PR
gh pr merge --squash --delete-branch     # 5. merge it yourself, with no review
git switch main && git pull              # 6. sync your local main
```

Or run `./scripts/coach.sh yolo` for a guided version that explains each step.

## Bonus lesson: turn on protection

Now do what real teams do: **Settings → Rules → Rulesets → New branch ruleset**
- Target: `main`
- ✅ *Require a pull request before merging*
- Required approvals: `1`

Try steps 1 to 5 again with a new branch. GitHub now blocks the merge until someone approves. (On a solo repo, you can remove the rule afterwards.)

## What you learned
- Branch → commit → push → PR → merge
- Squash merging and deleting branches
- Branch rulesets, and why reviews protect `main`

🧱 **Learners Wall:** tick *Lesson 2* on your page.

➡️ Next: [Lesson 3: Pull Shark](03-pull-shark.md)
