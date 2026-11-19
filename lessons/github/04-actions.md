# GitHub 4: Automate with Actions

GitHub Actions runs code for you when something happens in your repo: run tests on every pull request, deploy when you merge, label new issues. Public repos get it free on GitHub's runners, and private repos get a monthly allowance of free minutes.

## The anatomy of a workflow

Workflows are YAML files in `.github/workflows/`. Here's a complete one that runs tests on every PR and every push to `main`:

```yaml
name: CI                       # shown in the Actions tab and on PRs

on:                            # WHEN it runs
  pull_request:
  push:
    branches: [main]

permissions:                   # least privilege: read-only
  contents: read

jobs:
  test:                        # a job: runs on a fresh virtual machine
    runs-on: ubuntu-latest
    steps:                     # steps run in order
      - uses: actions/checkout@v7          # a ready-made action: get the code
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm ci                        # a shell command
      - run: npm test
```

| Piece | What it is |
|-------|-----------|
| `on` | The trigger: `push`, `pull_request`, `schedule` (cron), `workflow_dispatch` (a manual button), `release`, `issues`… |
| `jobs` | One or more jobs. They run in parallel unless you add `needs: other-job` |
| `runs-on` | The machine: `ubuntu-latest`, `windows-latest` or `macos-latest` |
| `uses` | Run a reusable action from the [Marketplace](https://github.com/marketplace?type=actions) |
| `run` | Run shell commands |
| `with` | Inputs for an action |

> 💡 Version numbers like `@v7` go out of date. [GitHub 6](06-security.md#dependabot) shows how to let Dependabot keep them current for you.

## A real example: this repo's own checks

This repo has two workflows you can read:

- [validate-learner-pr.yml](../../.github/workflows/validate-learner-pr.yml) checks every Learners Wall PR (it's what told you to use a lowercase filename)
- [site-up-to-date.yml](../../.github/workflows/site-up-to-date.yml) fails if the website wasn't rebuilt after a lesson changed

Notice how both set `permissions: contents: read` and use the `pull_request` trigger. That's deliberate, and the security section below explains why.

## Secrets and variables

Need an API key in a workflow? **Never put it in the YAML.** Add it under **Settings → Secrets and variables → Actions**, then use it:

```yaml
      - run: ./deploy.sh
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

GitHub masks secret values in logs. Non-secret settings go in **Variables** and are read with `${{ vars.NAME }}`.

## Workflow security in four rules

1. **Set `permissions:` to the minimum.** Start with `contents: read` and add only what a job needs.
2. **Be careful with `pull_request_target`.** It runs with write access and secrets, even for PRs from forks. Never check out and run a fork's code in it.
3. **Never put untrusted text straight into `run:`.** Issue titles, PR bodies and branch names can contain shell commands. Pass them through `env:` instead:
   ```yaml
   - run: echo "Title: $TITLE"
     env:
       TITLE: ${{ github.event.issue.title }}
   ```
4. **Pin third-party actions** to a full commit SHA for high-security repos (`uses: owner/action@<40-char-sha>`), so a compromised tag can't change what runs.

## Reading a failed run

Click the ❌ on a PR or commit → **Details**, and expand the red step. Read from the **first** error, not the last line. Can't reproduce it? **Re-run jobs → Enable debug logging** gives more detail.

## Deploy a site with Pages

The simplest way: **Settings → Pages → Deploy from a branch**, then choose `main` and `/docs` (this site works that way). For sites that need a build step (React, Astro, etc.), choose **GitHub Actions** as the source and use one of the suggested workflows.

## Exercise (in your sandbox)

1. Copy [templates/ci.yml](../../templates/ci.yml) to `.github/workflows/ci.yml`, or write a tiny one whose step is `- run: echo "Hello from Actions"`.
2. Push it and open the **Actions** tab to watch it run.
3. Add `workflow_dispatch:` under `on:` and run it from the **Run workflow** button.
4. Break it on purpose (`- run: exit 1`) in a PR and see the red ❌ on the PR. Fix it and watch it turn green.

## What you learned
- Workflow anatomy: triggers, jobs, steps, actions
- Secrets, variables and least-privilege permissions
- Reading failures, and deploying with Pages

➡️ Next: [GitHub 5: Releases and versioning](05-releases.md)
