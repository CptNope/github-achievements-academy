# Lesson 0: Setup ⚙️

This lesson gets you from nothing to ready in about 20 minutes. If you already use Git and GitHub, skim the checklist at the end. Most "I did it but got no badge" problems come down to step 3.

## 1. Git and GitHub are two different things

| Compared | Git | GitHub |
|---|-----|--------|
| **What it is** | A program on your computer that tracks changes to files | A website that hosts Git repositories online |
| **What it does** | Saves snapshots (commits), branches, merges | Shares your work, and adds pull requests, issues, reviews, Actions and Pages |
| **Works offline?** | Yes | No |

You use **Git** to record your work, and **GitHub** to share it and collaborate. A **repository** (repo) is one project's folder plus its full history. [Git 1](git/01-how-git-works.md) explains how Git works inside.

## 2. Choose how you'll work

You can do every badge lesson in this course in **any** of these. Pick the one that feels comfortable. You can switch later.

| Option | Good for | Get it |
|--------|---------|--------|
| **The github.com website only** | Total beginners, Chromebooks, locked-down work laptops | Nothing to install. Every lesson has "on github.com" steps |
| **GitHub Desktop** | People who prefer buttons to commands | [desktop.github.com](https://desktop.github.com/) |
| **VS Code** with its built-in Git panel | People who already write code in an editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| **The command line** (`git` and `gh`) | Learning Git properly. The Git fundamentals track uses it | See step 4 |

> 💡 On any repo page on github.com, press the **.** (full stop) key to open it in a browser
> version of VS Code (github.dev). No install is needed, which is handy for quick edits.

## 3. Create your account and link your commits to it

1. Sign up at [github.com](https://github.com/signup) if you haven't, and **turn on two-factor authentication** (**Settings → Password and authentication**). [GitHub 6](github/06-security.md) explains why.
2. Go to **Settings → Emails** and tick **Keep my email addresses private**. GitHub shows you a private no-reply address like `ID+username@users.noreply.github.com`.

GitHub credits a commit to you by matching its **author email** to a **verified email** on your account. If you use the command line, Desktop or VS Code, tell Git who you are (use your no-reply address to keep your real email private):

```bash
git config --global user.name  "Your Name"
git config --global user.email "ID+username@users.noreply.github.com"
git config --global user.email          # print it to double-check
```

GitHub Desktop does this for you when you sign in (**Settings → Git**). Commits you make on github.com are always linked correctly.

## 4. Command-line route: install Git and the GitHub CLI

Skip this step if you're using only the website or GitHub Desktop.

**Install Git**

| System | How |
|--------|-----|
| **Windows** | Install [Git for Windows](https://git-scm.com/download/win). It includes **Git Bash**, a terminal where every command in this course works |
| **macOS** | Open Terminal and run `git --version`. If Git isn't installed, macOS offers to install it. Or use [Homebrew](https://brew.sh/): `brew install git` |
| **Linux** | Use your package manager, for example `sudo apt install git` (Debian/Ubuntu) or `sudo dnf install git` (Fedora) |

Check it worked with `git --version`.

**Install the GitHub CLI and sign in**

```bash
# macOS
brew install gh
# Windows
winget install --id GitHub.cli
# Linux: see https://github.com/cli/cli#installation

gh auth login        # choose GitHub.com, then HTTPS, then log in with a web browser
```

`gh auth login` also sets up Git to push to GitHub without asking for passwords.

### Terminal basics in one minute

| Command | What it does |
|---------|-------------|
| `pwd` | Shows which folder you're in |
| `ls` (or `dir` in Windows Command Prompt) | Lists the files here |
| `cd folder-name` | Moves into a folder |
| `cd ..` | Moves up one folder |
| `mkdir name` | Makes a new folder |
| Up arrow | Brings back your last command |
| `Tab` | Completes file and folder names |

Commands in this course are typed one line at a time. Lines starting with `#` are comments: you don't type them.

## 5. Decide about private contributions

By default, only **public** activity shows on your profile. If much of your work is in private repos:

**Settings → Public profile → Contributions & activity**
- ✅ *Include private contributions on my profile*
- ✅ *Show private contributions & achievements* (wording may vary)

Private activity shows as anonymous counts. Nobody sees the private repo names.

## 6. Make a sandbox repo

Lessons 1 and 2 happen in **your own** repo, so you never create noise in anyone else's project.

**On github.com:** click **+ → New repository**, name it `my-github-sandbox`, choose **Public**, tick **Add a README file**, and click **Create repository**.

**With the CLI:**
```bash
gh repo create my-github-sandbox --public --add-readme --clone
cd my-github-sandbox
```

## 7. Make sure achievements are visible

**Settings → Public profile → Achievements**: make sure they aren't hidden.

## Checklist

- [ ] I know the difference between Git and GitHub
- [ ] I've chosen a way to work: website, Desktop, VS Code or command line
- [ ] Two-factor authentication is on
- [ ] My commit email is my verified email or my no-reply address
- [ ] I have a sandbox repo
- [ ] Achievements are visible on my profile

Using the command line? Run `./scripts/coach.sh doctor` from a clone of this repo to check your Git identity and GitHub login automatically.

➡️ Next: [Lesson 1: Quickdraw](01-quickdraw.md). Brand new to Git? Do [Git 1](git/01-how-git-works.md) and [Git 2](git/02-everyday-loop.md) first. They're short and make everything else easier.
