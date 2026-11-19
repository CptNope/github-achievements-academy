# 🏆 GitHub Achievements Academy

**Learn real Git and GitHub skills, and earn every obtainable GitHub achievement honestly along the way.**

🌐 **Website:** [cptnope.github.io/github-achievements-academy](https://cptnope.github.io/github-achievements-academy/). Check how close you are to your next badge.

GitHub achievements are the little badges in the sidebar of your profile. There are plenty of "badge farming" scripts out there that spam hundreds of empty pull requests or trade stars. This isn't one of them.

Each badge here is treated as a **lesson**. You'll learn the real-world skill behind it (issue triage, pull requests, pair programming, community support, building a project worth starring), and the badge is your certificate.

> 🤝 **Our promise:** nothing in this repo automates bulk activity, fakes interactions, or trades stars. Read [FAIR-PLAY.md](FAIR-PLAY.md) to learn why, and how to keep your account in good standing.

---

## 🗺️ The curriculum

### Track 1: Badges

| # | Lesson | Badge | Skill you'll actually learn | Tiers |
|---|--------|-------|-----------------------------|-------|
| 0 | [Setup](lessons/00-setup.md) | none | Git identity, verified email, the `gh` CLI | none |
| 1 | [Quickdraw](lessons/01-quickdraw.md) | ⚡ Quickdraw | The issue lifecycle and triaging mistakes fast | One-time |
| 2 | [YOLO](lessons/02-yolo.md) | 🤠 YOLO | The pull request flow, and why code review exists | One-time |
| 3 | [Pull Shark](lessons/03-pull-shark.md) | 🦈 Pull Shark | Fork → branch → PR → merge into someone else's project | 2 / 16 / 128 / 1024 merged PRs |
| 4 | [Pair Extraordinaire](lessons/04-pair-extraordinaire.md) | 👯 Pair Extraordinaire | Pair programming and `Co-authored-by` credit | 1 / 10 / 24 / 48 co-authored PRs |
| 5 | [Galaxy Brain](lessons/05-galaxy-brain.md) | 🧠 Galaxy Brain | Helping people well in GitHub Discussions | 2 / 8 / 16 / 32 accepted answers |
| 6 | [Starstruck](lessons/06-starstruck.md) | ⭐ Starstruck | Shipping a project people want to star | 16 / 128 / 512 / 4096 stars |
| 7 | [Public Sponsor](lessons/07-public-sponsor.md) | 💖 Public Sponsor | Funding the open source you depend on | One-time |
| 8 | [Highlights & retired badges](lessons/08-highlights-and-retired.md) | 🏅 | What you can't (or no longer can) earn | none |
| ? | [Troubleshooting](lessons/troubleshooting.md) | 🔧 | "I did it but no badge appeared!" | none |

### Track 2: Git fundamentals

| # | Lesson | What you'll learn |
|---|--------|-------------------|
| 1 | [How Git actually works](lessons/git/01-how-git-works.md) | Snapshots, branches as labels, HEAD, the staging area |
| 2 | [The everyday loop](lessons/git/02-everyday-loop.md) | `status`, `diff`, `add -p`, commit messages people can use |
| 3 | [Branching and merging](lessons/git/03-branching-and-merging.md) | Fast-forward vs. merge commits, resolving conflicts (with a practice repo) |
| 4 | [Rebase without fear](lessons/git/04-rebase.md) | The golden rule, interactive rebase, `--force-with-lease` |
| 5 | [Fetch, pull and push](lessons/git/05-remotes.md) | Remotes, tracking branches, rejected pushes, syncing forks |
| 6 | [Power tools](lessons/git/06-power-tools.md) | Stash, cherry-pick, bisect, blame, tags, `.gitignore`, aliases |
| 🆘 | [Oh no! Undo any mistake](lessons/oh-no.md) | Copy-and-paste fixes for the common Git disasters |

**Lessons 1 and 2** can be done in an afternoon in your own sandbox repo.
**Lesson 3** starts right here: your first two merged PRs to this repo earn you the first Pull Shark tier.
**Lessons 4 to 7** take real time and real people, and that's the point.

---

## 🚀 Start here

1. Star ⭐ this repo *only if you find it useful* (seriously, that's the whole philosophy).
2. Work through [Lesson 0: Setup](lessons/00-setup.md).
3. Optional: use the guided coach script, which explains every command before it runs:
   ```bash
   ./scripts/coach.sh help
   ```
4. Join the **Learners Wall**: add your own page to [`learners/`](learners/) with a pull request. See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🧱 How the Learners Wall works

The [`learners/`](learners/) folder is a real, maintained part of this project. It's a wall of people learning GitHub in public.

- **PR #1:** create `learners/<your-github-username>.md` from the [template](learners/_TEMPLATE.md).
- **PR #2+:** each time you finish a lesson, update your page: tick the box and write a sentence about what you learned.

A maintainer reviews and merges every PR by hand. An automated check makes sure each PR only touches your own file and follows the template. That's the same kind of CI check you'll meet in real projects.

Two genuine, reviewed contributions get you the base **Pull Shark** tier, and you'll have learned the fork-and-PR workflow used by almost every open source project on Earth.

---

## 📜 Credits

Created and maintained by **[Jeremy Anderson Tech](https://jeremyanderson.tech)**.
Achievement details are community-sourced because GitHub no longer publishes an official list. If something has changed, please [open an issue](../../issues/new/choose). Keeping this accurate is itself a great first contribution!

Licensed under the [MIT License](LICENSE).
