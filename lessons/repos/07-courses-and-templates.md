# Repo 7: Courses, workshops and templates

Repositories are great for teaching. Learners get real files, real history and real GitHub practice at the same time. This lesson covers educational repos like this academy: course material, workshop starters, assignment templates and community learning projects.

## Choose the shape

| Shape | What it is | Example |
|-------|-----------|---------|
| **Course repo** | Lessons as Markdown, a site from `docs/`, Discussions for questions | This academy |
| **Workshop starter** | Code with a `start` branch and a `solution` branch, or one folder per step | A "build a to-do app in 90 minutes" session |
| **Template repository** | A ready-made project students copy with one click | A starter for each assignment |
| **Assignments with GitHub Classroom** | Every student gets a private copy of a template, with optional autograding | University or bootcamp courses |
| **Community learning repo** | Learners contribute pages or exercises by PR | The Learners Wall here |

## Template repositories

Turn any repo into a template: **Settings → General → ✅ Template repository**. Visitors then see a green **Use this template** button that creates a fresh copy with **clean history**, which is ideal for starters.

```bash
gh repo create my-copy --template owner/starter-repo --public --clone
```

Templates are also how you standardize your **own** work: make one with your favorite README layout, license, `.gitignore`, issue forms, CI and Dependabot, and start every new project from it. The [starter templates](../../templates/) folder is a good basis.

## Workshops: steps people can catch up on

People fall behind in live sessions. Make catching up a single command:

- **Branches per step:** `step-1`, `step-2`… Learners run `git switch step-3` to jump ahead.
- **Or folders per step:** `01-setup/`, `02-routing/`… Easier for beginners, with no Git needed.
- **Keep a `solution` branch** (or `solutions/` folder) for after the session.
- **Tag the version you taught** (`workshop-2026-11`), so later fixes don't confuse past attendees.

## GitHub Classroom

[GitHub Classroom](https://classroom.github.com/) builds on template repos for formal teaching. You create an assignment from a template, share an invite link, and each student gets their own private copy in your organization. Autograding can run tests on every push. Check GitHub's education pages for current eligibility and features.

## Make the repo teach

- **One lesson per file**, numbered (`01-…`, `02-…`), each ending with an exercise and a "what you learned" recap.
- **A course site from the same Markdown**, published with Pages ([Repo 4](04-websites-and-docs.md)). This academy builds its site from `lessons/` with a small script, and CI fails if the site is out of date.
- **Discussions with a Q&A category**, so learners can mark the answer that helped. That's also [Galaxy Brain](../05-galaxy-brain.md) practice for whoever answers.
- **Issue templates** for "this lesson is unclear" and "this is out of date".
- **Learner contributions by PR**, checked by a workflow that only allows changes to the learner's own file, like the [Learners Wall check](../../.github/workflows/validate-learner-pr.yml) in this repo.
- **Accessibility:** alt text on images, captions on videos, and real text instead of screenshots of code.

## Keeping educational content accurate

Tools change, and outdated tutorials are worse than none.

- Put a **"last reviewed" date** or version note on lessons that depend on fast-moving tools.
- Use **Dependabot** for any code in the repo, and pin versions in examples.
- Invite corrections. "Found something outdated? Open an issue" in every page footer makes readers your reviewers.
- Schedule a review, like a recurring issue each term, to re-check links and screenshots.

## Licensing educational material

Code and prose often get different licenses. A common pattern is **MIT for code** and **CC BY 4.0 for written content** ([Creative Commons](https://creativecommons.org/licenses/by/4.0/)), which lets others reuse and adapt your lessons with credit. Say which applies to what in the README.

## Exercise

1. Turn a small starter project into a **template repository** and create a copy from it.
2. Add a `step-1` and `step-2` branch, or folder, to show progress through a tiny exercise.
3. Turn on Discussions with a Q&A category.

## What you learned
- The shapes educational repos take, and when to use each
- Template repositories and GitHub Classroom
- Making a repo teach well, stay accurate, and be licensed for reuse

➡️ Next: [Repo 8: Maintaining a repo over time](08-maintaining.md)
