# GitHub 2: Issues and Projects

Issues are GitHub's to-do list, bug tracker and discussion thread rolled into one. Projects turn them into a board or a spreadsheet you can plan with. Used well, they're how solo developers stay organized and how teams avoid duplicate work.

## Writing an issue people can act on

**A good bug report:**

```markdown
**What happened**
The cart total shows NaN after removing the last item.

**Steps to reproduce**
1. Add one item to the cart
2. Remove it
3. Look at the total

**Expected:** $0.00
**Environment:** Chrome 131, macOS 15

Screenshot attached.
```

**A good feature request** explains the *problem* before the solution: "Customers can't find past orders" is more useful than "Add an orders page".

## Organizing issues

| Tool | Use it for |
|------|-----------|
| **Labels** | Categories like `bug`, `docs`, `good first issue` and `help wanted`. Use a small, consistent set |
| **Assignees** | Who's working on it right now. Prevents two people doing the same thing |
| **Milestones** | Group issues into a release or deadline ("v1.2", "Launch"), with a progress bar |
| **Sub-issues** | Break a big issue into smaller ones. The parent shows progress as they close |
| **Issue types** | Organization-wide categories (like Bug, Feature, Task), set by org admins |

> 💡 The labels `good first issue` and `help wanted` are special. GitHub uses them to suggest
> your issues to new contributors.

## Link pull requests to issues

Write a closing keyword followed by the issue number in a PR description (or a commit message):

```
Fixes #42
```

When the PR merges into the default branch, issue #42 closes automatically, and each one links to the other. The keywords are `close`, `closes`, `closed`, `fix`, `fixes`, `fixed`, `resolve`, `resolves` and `resolved`.

## Issue templates and forms

Templates make people give you the information you need up front. Put **issue forms** (YAML files) in `.github/ISSUE_TEMPLATE/`:

```yaml
name: Bug report
description: Something isn't working
labels: ["bug"]
body:
  - type: textarea
    id: what
    attributes:
      label: What happened?
    validations:
      required: true
  - type: input
    id: version
    attributes:
      label: Which version?
```

A `config.yml` in the same folder can turn off blank issues and point questions to Discussions. This repo does both. See [its templates](../../.github/ISSUE_TEMPLATE/) and the copy-ready version in [templates/](../../templates/).

## Projects: boards and tables

A **Project** pulls issues and PRs from one or more repos into a single view. Create one from your profile or org: **Projects → New project**.

- **Table view:** a spreadsheet with custom fields like Priority, Estimate or Sprint
- **Board view:** Kanban columns (Todo → In progress → Done). Drag cards between them
- **Roadmap view:** issues on a timeline using date fields

Set up **built-in workflows** (the **⋯** menu → **Workflows**) so items move automatically, for example "When a PR is merged, set Status to Done".

## Exercise (in your sandbox)

1. Create three issues: one bug, one feature, one docs task. Give each a label.
2. Make the feature a parent and add two sub-issues to it.
3. Create a Project with a board view and add all your issues.
4. Open a PR that says `Fixes #<your docs issue>`, merge it, and watch the issue close itself.

## What you learned
- Writing bug reports and feature requests people can act on
- Labels, milestones, sub-issues and closing keywords
- Issue forms, and planning with Projects

➡️ Next: [GitHub 3: Code review](03-code-review.md)
