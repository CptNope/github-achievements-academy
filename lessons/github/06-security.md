# GitHub 6: Security basics

Your GitHub account can push code that runs on other people's machines and servers. That makes it a target. These habits take an hour to set up and protect you, your clients and anyone who uses your code.

## Lock down your account

**Settings → Password and authentication:**

- **Two-factor authentication (2FA):** use an authenticator app, or better, a **passkey** or security key. Avoid SMS if you can.
- **Save your recovery codes** somewhere safe, like a password manager. Losing 2FA without them can mean losing the account.
- **Review sessions** (**Settings → Sessions**) and sign out of devices you don't recognize.

## Tokens: least privilege, short lives

When a tool asks for a personal access token, prefer **fine-grained tokens** (**Settings → Developer settings → Personal access tokens → Fine-grained tokens**):

- Limit it to **only the repos** it needs
- Grant **only the permissions** it needs (often just *Contents: Read*)
- Set an **expiry date**
- Delete tokens you no longer use

Better still, use `gh auth login`, which handles credentials for you, or GitHub Apps for automation.

## Sign your commits

Anyone can set `git config user.email` to *your* email and make commits that look like yours. Signed commits prove they came from you, and GitHub shows a **Verified** badge.

The simplest way is to sign with the SSH key you already use:

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

Then add the same public key on GitHub as a **Signing key** (**Settings → SSH and GPG keys → New SSH key → Key type: Signing Key**). Turn on **Vigilant mode** on that page to flag unsigned commits that claim to be yours.

## Dependabot

Most code is other people's code. **Dependabot** watches your dependencies:

- **Dependabot alerts** tell you when a dependency has a known vulnerability. Turn them on in **Settings → Code security**.
- **Dependabot security updates** open PRs that fix those vulnerabilities automatically.
- **Version updates** open PRs to keep dependencies current. Configure them with `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "github-actions"   # keeps uses: actions/...@vX current
    directory: "/"
    schedule:
      interval: "weekly"
```

This repo uses exactly that. See [its dependabot.yml](../../.github/dependabot.yml), or copy [the template](../../templates/dependabot.yml).

> 💡 **Real example:** minutes after this repo added that file, Dependabot opened three PRs. They bumped
> `actions/checkout` and `actions/setup-node` from v4 to v7, and the `marked` library from 15 to 18.
> Major version bumps can break things, so we tested the new `marked` locally first (the site came out
> identical), then updated. Read the release notes before merging a major bump.

## Secret scanning and push protection

**Secret scanning** looks for leaked keys (AWS, Stripe, GitHub tokens and hundreds more). **Push protection** goes further: it **blocks the push** if it spots a key, before it ever reaches GitHub. Check that both are on in **Settings → Code security**.

If a secret does leak, follow the [Oh no! guide](../oh-no.md#i-committed-a-password-or-api-key). **Revoke it first.**

## Code scanning

For supported languages, **Code scanning with CodeQL** finds bugs like SQL injection and cross-site scripting in your own code. In **Settings → Code security**, choose **Set up → Default** and it runs on every push and PR.

## Tell people how to report problems

Add a `SECURITY.md` explaining how to report a vulnerability **privately**, not in a public issue. Turn on **Private vulnerability reporting** (**Settings → Code security**) and researchers get a private form. This repo has [one](../../SECURITY.md), and there's a [template](../../templates/SECURITY.md).

## Checklist

- [ ] 2FA on, with a passkey or app, and recovery codes saved
- [ ] Old tokens deleted, new ones fine-grained with an expiry date
- [ ] Commit signing on, with the Verified badge showing
- [ ] Dependabot alerts and security updates on
- [ ] Secret scanning and push protection on
- [ ] `SECURITY.md` added and private vulnerability reporting on

## What you learned
- Protecting your account with 2FA, passkeys and least-privilege tokens
- Signing commits
- Dependabot, secret scanning, push protection, code scanning and SECURITY.md

➡️ Next: [GitHub 7: Contributing to open source](07-open-source.md)
