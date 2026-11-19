# Lesson 0: Setup ⚙️

Most "I did it but got no badge" problems come down to setup. Get this right once and everything else just works.

## 1. Make sure your commits are linked to your account

GitHub credits a commit to you by matching its **author email** to a **verified email** on your account. Unverified or unknown emails don't count.

```bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
git config --global user.email          # print it to double-check
```

Then go to **Settings → Emails** on GitHub and confirm that this address is listed and **verified**.

> 💡 **Privacy tip:** turn on *Keep my email addresses private*. Then use your no-reply address,
> `ID+username@users.noreply.github.com` (you'll find it on that same settings page), as your
> `user.email`. It still counts toward achievements.

## 2. Install the GitHub CLI (optional, but handy)

```bash
# macOS
brew install gh
# Windows
winget install --id GitHub.cli
# Linux: see https://github.com/cli/cli#installation

gh auth login
```

## 3. Decide about private contributions

By default, only **public** activity counts toward what's visible on your profile. If much of your work is in private repos:

**Settings → Public profile → Contributions & activity**
- ✅ *Include private contributions on my profile*
- ✅ *Show private contributions & achievements* (wording may vary)

Private activity shows as anonymized counts. Nobody sees the private repo names.

## 4. Make a sandbox repo

Lessons 1 and 2 happen in **your own** repo, so you never create noise in anyone else's project.

```bash
gh repo create my-github-sandbox --public --add-readme --clone
cd my-github-sandbox
```

Or click **New repository** on github.com and tick *Add a README file*.

## 5. Make sure achievements are visible

**Settings → Public profile → Achievements**: make sure they aren't hidden.

✅ **Done?** Move on to [Lesson 1: Quickdraw](01-quickdraw.md).

You can also run `./scripts/coach.sh doctor` to check steps 1 and 2 automatically.
