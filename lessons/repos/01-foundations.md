# Repo 1: Foundations every repo needs

Every repository, from a weekend experiment to a company product, benefits from the same handful of files and settings. Set them up once in a few minutes and your repo is understandable, safe to contribute to, and easy to maintain. The rest of this track builds on this checklist for specific kinds of projects.

## Before you create it: three decisions

| Decision | Options | Rule of thumb |
|----------|---------|---------------|
| **Owner** | Your personal account, or an organization | Personal for your own projects. An org for anything a team, client or community will share, so it doesn't depend on one person's account |
| **Visibility** | Public, private, internal (orgs on Enterprise) | Public unless there's a reason not to: client code, secrets you can't remove, unreleased product |
| **Name** | Short, lowercase, hyphens | `invoice-generator`, not `My_Invoice_Generator_FINAL2`. It ends up in URLs and clone commands |

## The files

```
your-repo/
├── README.md            what it is, how to use it
├── LICENSE              who may use it, and how
├── .gitignore           files Git should never track
├── CONTRIBUTING.md      how to help (public projects)
├── CODE_OF_CONDUCT.md   how people should treat each other (public projects)
├── SECURITY.md          how to report vulnerabilities privately
└── .github/
    ├── ISSUE_TEMPLATE/  bug and feature forms
    ├── PULL_REQUEST_TEMPLATE.md
    └── dependabot.yml   keeps dependencies current
```

### README: the front door

A good README answers, in this order:
1. **What is it?** One sentence, plus a screenshot or demo link.
2. **Why would I use it?** The problem it solves.
3. **How do I install and use it?** Copy-and-paste steps.
4. **How do I get help or contribute?**
5. **License.**

### LICENSE: no license means "all rights reserved"

Without a license, nobody can legally reuse your code, even in a public repo. Pick one when you create the repo (GitHub offers a dropdown) or later with **Add file → Create new file → `LICENSE`**, which shows a license picker.

| License | In short | Common for |
|---------|----------|-----------|
| **MIT** | Do almost anything, keep the copyright notice | Libraries, tools, most small projects |
| **Apache-2.0** | Like MIT, plus an explicit patent grant | Larger projects, company-backed open source |
| **GPL-3.0 / GPL-2.0-or-later** | Changes you distribute must stay open source under the GPL | Apps, WordPress plugins and themes (which must be GPL-compatible) |
| **None (private repo)** | All rights reserved | Client or company code |

[choosealicense.com](https://choosealicense.com/) explains each in plain English. This isn't legal advice: for anything commercial or unusual, ask a lawyer.

### .gitignore

Start from the template for your language (GitHub offers one at creation, or see [github/gitignore](https://github.com/github/gitignore)), then add your own. **Always** ignore `.env` files, keys, and build output. More in [Git 6](../git/06-power-tools.md#gitignore-keep-junk-out).

## The settings

**Settings → General**
- Description, website and **topics** (the gear next to *About* on the repo's main page)
- Features: turn off **Wiki** and **Projects** if you won't use them, and turn on **Discussions** if you want Q&A
- Pull requests: pick the merge buttons you want, and tick **Automatically delete head branches**

**Settings → Rules → Rulesets** (protect `main`)
- Require a pull request, block force pushes, and require status checks once you have CI. See [GitHub 3](../github/03-code-review.md#require-reviews-with-rulesets)

**Settings → Advanced Security**
- Dependabot alerts and security updates, secret scanning and push protection, private vulnerability reporting. See [GitHub 6](../github/06-security.md)

## Check your work: the community profile

For public repos, open **Insights → Community standards**. GitHub lists which recommended files you have, with buttons to add the missing ones.

## Copy-ready files

The [starter templates](../../templates/) folder has a CI workflow, issue forms, a PR template, CODEOWNERS, Dependabot, release notes config and a SECURITY.md. You can also turn a fully set-up repo into a **template repository** (**Settings → General → Template repository**) and click **Use this template** for every new project. [Repo 7](07-courses-and-templates.md) covers that.

## Exercise

Pick one of your existing repos and bring it up to standard:
1. Rewrite the README's first paragraph to answer "what is it?" in one sentence.
2. Add a LICENSE if it has none.
3. Fill in the description and three topics.
4. Add a ruleset protecting `main`.
5. Check **Insights → Community standards** (public repos).

## What you learned
- The decisions to make before creating a repo
- The files and settings every repo benefits from
- Licenses in plain English, and the community profile checklist

➡️ Next: [Repo 2: Personal projects and portfolio pieces](02-personal-projects.md)
