# Repo 5: Team and client projects

When several people, or a paying client, depend on a repo, the setup shifts from "easy to share" to **"hard to break, clear who owns what, and safe to hand over."** This applies to company apps, agency client sites and freelance projects alike.

## Put it in an organization

Create a free **organization** (your profile menu → **Your organizations → New organization**) for your team, agency or client, rather than a personal account.

- The repo survives people leaving
- You give access by **team** ("Developers: write", "Client: read") instead of person by person
- Handing a project to a client is a clean **ownership transfer** of the repo or the whole org

**Freelancers and agencies:** decide in your contract who owns the repo and when it transfers. A common pattern is to build in your agency's org, then transfer the repo to the client's org at handover (**Settings → General → Transfer ownership**). Issues, PRs, stars and history move with it.

## Access: least privilege

| Role | Can | Give it to |
|------|-----|-----------|
| Read | View and clone, open issues | Clients who want visibility, auditors |
| Triage | Manage issues and PRs, no code | Project managers |
| Write | Push branches, merge where rules allow | Developers |
| Maintain | Manage the repo without destructive settings | Tech leads |
| Admin | Everything, including deleting | As few people as possible |

Review access every few months, and when someone leaves the project.

## Protect the branches that matter

A ruleset on `main` (and any `release/*` branches):
- ✅ Require a pull request with **at least 1 approval** (2 for critical systems)
- ✅ **Require review from Code Owners** ([CODEOWNERS](../github/03-code-review.md#codeowners-automatic-reviewers))
- ✅ **Require status checks**: tests, lint and build
- ✅ **Block force pushes** and deletions
- ✅ Optionally **require signed commits** or **linear history**

Rulesets for private repositories need a paid plan, while public repositories get them free. Check GitHub's current plans for your situation.

## Environments: control deployments

Under **Settings → Environments**, create `staging` and `production`:

- **Required reviewers:** a named person must approve before a job deploys to production
- **Environment secrets:** production credentials are only available to jobs that target `production`
- **Deployment branches:** only `main` may deploy to production

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production    # waits for approval, then gets production secrets
    steps:
      - uses: actions/checkout@v7
      - run: ./deploy.sh
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

Prefer **OIDC** (short-lived credentials) over long-lived keys when your host supports it. Most major clouds do.

## A branching strategy everyone understands

| Strategy | How it works | Good for |
|----------|-------------|----------|
| **GitHub Flow** | Short branches off `main`, PR, review, merge, deploy | Most teams and websites |
| **Trunk-based** | Very small PRs merged many times a day, with feature flags for unfinished work | Fast-moving product teams |
| **Release branches** | `release/2.4` branches for maintaining old versions | Software with several supported versions |

Pick one, write it in `CONTRIBUTING.md`, and enforce it with rulesets.

## Write down how the project works

Clients and new teammates shouldn't have to ask:

- **README:** what it is, how to run it locally, where it's deployed
- **`docs/deploy.md`:** how releases happen, and how to roll back
- **`.env.example`:** every environment variable with a fake value (never real ones)
- **Issue labels and a project board** ([GitHub 2](../github/02-issues-and-projects.md)) so the client can see progress

## Handover checklist (client projects)

- [ ] README and deploy docs are current
- [ ] Secrets rotated and moved to the client's accounts
- [ ] Repo transferred to the client's org, or the client given admin
- [ ] Your access reduced to what the support agreement covers
- [ ] A final release tagged, such as `v1.0.0-handover`

## Exercise

1. Create a free organization and move (or create) a practice repo in it.
2. Make a team with **Write** access and add yourself.
3. Add a ruleset requiring a PR and one passing check on `main`.
4. Create a `production` environment with yourself as the required reviewer.

## What you learned
- Organizations, teams and least-privilege access
- Rulesets and environments that keep production safe
- Branching strategies, project docs and a clean client handover

➡️ Next: [Repo 6: WordPress plugins and themes](06-wordpress-plugins.md)
