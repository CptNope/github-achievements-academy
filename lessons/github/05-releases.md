# GitHub 5: Releases and versioning

A release tells users "this version is ready, here's what changed." It turns a stream of commits into something people can depend on, and a project with clear releases looks maintained and trustworthy.

## Semantic versioning in one minute

Version numbers follow `MAJOR.MINOR.PATCH`, for example `2.4.1`:

| Bump | When | Example |
|------|------|---------|
| **PATCH** | Bug fixes only, nothing breaks | 2.4.1 → 2.4.2 |
| **MINOR** | New features, still compatible | 2.4.2 → 2.5.0 |
| **MAJOR** | Breaking changes: users must update their code | 2.5.0 → 3.0.0 |

Versions below `1.0.0` mean "still settling, anything may change." The full rules are at [semver.org](https://semver.org/).

## Tag it, then release it

A **tag** marks a commit with a version (see [Git 6](../git/06-power-tools.md#tags-mark-releases)). A **release** is GitHub's page built on a tag, with notes and downloadable files.

**On github.com:** **Releases → Draft a new release**
1. **Choose a tag:** type a new one like `v1.2.0`. GitHub creates it when you publish.
2. **Target:** usually `main`.
3. Click **Generate release notes**. GitHub lists every merged PR and new contributor since the last release.
4. Edit the notes into something humans want to read (see below).
5. Attach files if you ship builds (a plugin `.zip`, binaries).
6. Tick **Set as a pre-release** for betas like `v2.0.0-beta.1`.
7. **Publish**.

**With the CLI:**
```bash
gh release create v1.2.0 --generate-notes
gh release create v1.2.0 ./dist/my-plugin.zip --title "v1.2.0" --notes-file NOTES.md
```

## Release notes people actually read

Generated notes list PR titles. Good notes add a human summary on top:

```markdown
## Highlights
- **Dark mode** is here. Toggle it in Settings → Appearance.
- Checkout is about 40% faster on mobile.

## ⚠️ Breaking changes
- `getCart()` now returns a Promise. Add `await` where you call it.

## Fixes
- Cart total no longer shows NaN when empty (#42)
```

Lead with what users care about. Always call out **breaking changes** and how to upgrade.

### Organize generated notes by label

Add `.github/release.yml` and GitHub groups PRs by their labels:

```yaml
changelog:
  exclude:
    labels: [ignore-for-release]
  categories:
    - title: 🚀 Features
      labels: [enhancement]
    - title: 🐛 Fixes
      labels: [bug]
    - title: 📚 Docs
      labels: [docs]
    - title: Other changes
      labels: ["*"]
```

A copy-ready version is in [templates/release.yml](../../templates/release.yml).

## Keep a changelog

Many projects also keep a `CHANGELOG.md` in the repo, newest version first, in the style of [Keep a Changelog](https://keepachangelog.com/). Release pages are great for announcements, and a changelog file travels with the code (WordPress.org plugins, for example, have their own changelog section in `readme.txt`).

## Exercise (in your sandbox)

1. Merge two small PRs, one labeled `enhancement` and one labeled `bug`.
2. Add `.github/release.yml` from the template.
3. Draft release `v0.1.0`, click **Generate release notes**, and see your PRs grouped.
4. Add a two-line *Highlights* section and publish.

## What you learned
- Semantic versioning
- Creating releases on the web and with `gh`
- Writing and organizing release notes people read

➡️ Next: [GitHub 6: Security basics](06-security.md)
