# Repo 8: Maintaining a repo over time

Creating a repo takes an afternoon. Keeping it healthy takes a little time, regularly. This lesson is a maintenance routine you can actually stick to, and a kind way to step back when it's time.

## A routine that fits in your week

| How often | What to do | Time |
|-----------|-----------|------|
| **Weekly** | Triage new issues and PRs: label, answer, close duplicates ([Lesson 1](../01-quickdraw.md)). Merge Dependabot PRs whose checks pass | 15–30 min |
| **Monthly** | Cut a release if anything merged. Read Dependabot and code scanning alerts. Close stale branches | 30–60 min |
| **Every few months** | Update docs and screenshots, review who has access, check that CI action versions and runtimes are still supported | 1–2 hours |
| **Yearly** | Ask whether the project still has a purpose. Update the license year if you like, and refresh the roadmap | 1 hour |

Put the routine in your calendar, or have a scheduled workflow open a reminder issue each month.

## Triage like a pro

- **Label everything** with a small set: `bug`, `enhancement`, `docs`, `question`, `good first issue`, `needs info`.
- **Saved replies** (profile **Settings → Saved replies**) for common answers: "Can you share steps to reproduce?", "Thanks! This is out of scope because…"
- **Move questions to Discussions** (the issue's **Convert to discussion** option), so issues stay actionable.
- **Close kindly and clearly.** "Closing because X. Happy to reopen if Y" is better than leaving things open forever.

### Automate the boring parts

```yaml
# .github/workflows/stale.yml: nudges, then closes, inactive issues that are waiting on the reporter
name: Stale
on:
  schedule:
    - cron: "30 4 * * 1"     # Mondays at 04:30 UTC
permissions:
  issues: write
  pull-requests: write
jobs:
  stale:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v10
        with:
          only-labels: "needs info"
          days-before-stale: 14
          days-before-close: 7
          stale-issue-message: "Is this still happening? Without more information we'll close this in a week. Reply any time to keep it open."
```

Limiting it to `needs info` avoids the bad pattern of auto-closing real bugs that nobody has had time to look at. Dependabot will keep the action version current.

## Keep dependencies and CI healthy

- Let **Dependabot** open grouped updates weekly ([GitHub 6](../github/06-security.md#dependabot)). Merge green ones quickly, so small updates don't pile up into a scary big one.
- **Read major-version release notes** before merging. Test locally if it touches your build.
- Keep a **required CI check** on `main`, so broken updates can't merge unnoticed.
- Watch for **deprecated runtimes** (old Node, PHP or Python versions) in your workflows and `engines` fields.

## Use Insights to see what's happening

**Insights** shows contributors, traffic (views, clones, popular pages and referrers), commit activity, the dependency graph, and community standards. A quick monthly look tells you which docs people read and where they came from.

## Big changes without breaking people

- **Renaming a repo:** GitHub redirects the old URL, but update links you control. Don't create a new repo with the old name, or the redirect breaks.
- **Renaming `master` to `main`:** **Settings → General → Default branch**. GitHub retargets open PRs and shows a notice to people who visit.
- **Moving to an organization:** **Transfer ownership**. Issues, PRs, stars and redirects come along.
- **Breaking changes:** announce them in release notes, deprecate first if you can, and bump the major version ([GitHub 5](../github/05-releases.md)).

## Stepping back, kindly

Projects end, and that's healthy. Choose the clearest option:

| Situation | What to do |
|-----------|-----------|
| You'll check in rarely | Add a **maintenance status** at the top of the README ("Maintained, slowly", or "Security fixes only") |
| Someone wants to take over | Add them as a maintainer, or **transfer** the repo to them or to an org. Say so in the README |
| It's done, or replaced by something better | **Archive** it (**Settings → General → Archive this repository**). It becomes read-only and clearly labeled, and links keep working. Point to any successor in the README |
| It must disappear | **Delete** it only if necessary. It breaks every link and anything that depends on it |

Archiving is almost always better than deleting.

## Exercise

1. Pick a repo you own and do a "monthly" pass: triage open issues, merge or close stale PRs, and delete merged branches.
2. Add a maintenance-status line to its README.
3. Optional: add the stale workflow, limited to a `needs info` label.

## 🎓 You've finished Repo recipes

You can now set up the right kind of repo for any purpose, from a portfolio piece to a published package, a client project, a WordPress plugin or a course, and keep it healthy for years.

🧱 **Learners Wall:** add a line about which repo you upgraded during this track.
