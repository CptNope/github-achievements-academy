# Lesson 1: Quickdraw ⚡

**Badge:** close an issue or pull request within **5 minutes** of opening it. One-time.

## The real skill: the issue lifecycle

Issues are how projects track bugs, ideas and tasks. Good maintainers **triage fast**. They close duplicates, mistakes and invalid reports quickly, with a clear reason, so the issue tracker stays useful.

An issue has a few states and outcomes:

| State | Close reason | When to use it |
|-------|--------------|----------------|
| Open | none | Still needs work |
| Closed | **Completed** | The work is done |
| Closed | **Not planned** | Won't fix, out of scope, or invalid |
| Closed | **Duplicate** | Already reported elsewhere (link it!) |

## Exercise (in your sandbox repo, about 3 minutes)

Pretend you just spotted a typo in your README, and then realize you already fixed it.

### On github.com
1. Open your sandbox repo → **Issues** → **New issue**.
2. Title: `Typo in README`. Body: `The word "teh" appears in the intro.`
3. Click **Submit**.
4. Within 5 minutes, add the comment `Already fixed in main, closing.` and click
   **Close issue ▾ → Close as not planned**.

### Or with the CLI
```bash
gh issue create --title "Typo in README" --body 'The word "teh" appears in the intro.'
# note the issue number it prints, e.g. #1
gh issue close 1 --reason "not planned" --comment "Already fixed in main, closing."
```

### Or with the coach
```bash
./scripts/coach.sh quickdraw
```

## What you learned
- Creating, commenting on and closing issues
- Close reasons and why they matter for project history
- How fast triage keeps a backlog healthy

> ⏱️ The badge can take up to 24 hours to appear. See [troubleshooting](troubleshooting.md).

🧱 **Learners Wall:** tick *Lesson 1* on your page in a pull request. That's one more merged PR toward Pull Shark!

➡️ Next: [Lesson 2: YOLO](02-yolo.md)
