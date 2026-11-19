# Repo 3: Open source libraries and packages

A library is code other people install and build on: an npm package, a Python module, a PHP library. Your users depend on it not breaking, so the setup focuses on **stability, clear releases and safe publishing**.

## What's different from a personal project

| Concern | What to set up |
|---------|---------------|
| People depend on your API | Semantic versioning, a changelog, and loud warnings about breaking changes ([GitHub 5](../github/05-releases.md)) |
| Contributors you've never met | CONTRIBUTING.md, CODE_OF_CONDUCT.md, issue forms, a PR template |
| It must work everywhere users run it | CI that tests several versions of your language and runtime |
| Publishing is a target for attackers | Publish from CI with **trusted publishing**, not a token on your laptop |
| Support questions | Discussions for Q&A, so issues stay for bugs |

## Test against what your users run

Use a **matrix** in your CI workflow to test several versions in parallel:

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [20, 22, 24]
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: ${{ matrix.node }}
      - run: npm ci
      - run: npm test
```

Then make the tests a **required status check** in your ruleset, so nothing merges red.

## Publish from CI with trusted publishing

The old way was to store a long-lived registry token as a secret. If it leaks, anyone can publish a malicious version of your package. **Trusted publishing** replaces the token: the registry trusts one specific workflow in one specific repo, using short-lived OIDC credentials.

npm, PyPI, RubyGems and crates.io all support it. For **npm**:

1. On npmjs.com, open your package → **Settings → Trusted publishing**, and add your GitHub user or org, repo and workflow file name.
2. Publish from a workflow like this, triggered when you publish a GitHub release:

```yaml
name: Publish
on:
  release:
    types: [published]

permissions:
  contents: read
  id-token: write          # lets the workflow prove its identity to npm

jobs:
  publish:
    runs-on: ubuntu-latest
    environment: npm       # optional: add required reviewers to this environment
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24   # trusted publishing needs npm 11.5.1+ (Node 22.14+)
      - run: npm ci
      - run: npm test
      - run: npm publish
```

Check the registry's current docs when you set this up ([npm](https://docs.npmjs.com/trusted-publishers), [PyPI](https://docs.pypi.org/trusted-publishers/)), because details like minimum versions change. Packages published this way also get **provenance**, a public record that links each version to the exact commit and workflow that built it.

## Files a library needs on top of the foundations

| File | Purpose |
|------|---------|
| `CHANGELOG.md` | Every version, newest first, with breaking changes called out |
| `CONTRIBUTING.md` | How to set up the dev environment, run tests, and what PRs you want |
| `CODE_OF_CONDUCT.md` | Expected behavior, and how to report problems |
| `SECURITY.md` + private vulnerability reporting | So vulnerabilities aren't disclosed in public issues |
| `.github/FUNDING.yml` | A Sponsor button, if you'd like support |

## Releasing safely

1. Merge PRs labeled `bug`, `enhancement` and so on into `main`.
2. Decide the version: patch, minor or major.
3. Update `CHANGELOG.md` and the version number in a PR.
4. Draft a GitHub release with **Generate release notes**, edit the highlights, and publish.
5. The publish workflow runs and pushes the package to the registry.

## Sustainability

- **Say what's in scope** in the README, and close out-of-scope requests kindly.
- **Use `good first issue` labels** to grow contributors who can share the load.
- **Write down decisions** in issues or a `docs/decisions/` folder, so you don't re-argue them.
- **It's fine to step back.** Add a maintenance status to the README, find co-maintainers, or archive. A clear "unmaintained" notice is kinder than silence.

## Exercise

For a library you maintain, or a tiny one you create for practice:
1. Add a test matrix with at least two versions.
2. Make the tests a required status check.
3. Write a `CHANGELOG.md` entry and publish a `v0.1.0` release.
4. Optional: set up trusted publishing for your registry.

## What you learned
- What changes when other people depend on your code
- Test matrices and required checks
- Trusted publishing instead of long-lived tokens, and a safe release routine

➡️ Next: [Repo 4: Websites and documentation sites](04-websites-and-docs.md)
