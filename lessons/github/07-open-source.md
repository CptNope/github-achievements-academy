# GitHub 7: Contributing to open source

Contributing to a project you use is the best way to learn from experienced developers, build a public track record, and earn badges the honest way. It's also a little intimidating. This lesson is the unwritten etiquette that maintainers wish everyone knew.

## Find the right project

The best first project is one **you already use**: a library, a WordPress plugin, a tool, a docs site. You understand its users, and you'll notice the rough edges.

Signs a project welcomes newcomers:
- Recent commits and PRs that get merged, not hundreds sitting untouched
- A `CONTRIBUTING.md` file and a code of conduct
- Issues labeled [`good first issue`](https://github.com/search?q=label%3A%22good+first+issue%22+is%3Aopen&type=issues) or `help wanted`
- Maintainers who reply kindly in issues

## Before you write code

1. **Read `CONTRIBUTING.md`.** It tells you how they want PRs, which tests to run, and whether they need something like a CLA (Contributor License Agreement) or DCO sign-off (`git commit -s`).
2. **Search existing issues and PRs.** Someone may already be on it.
3. **For anything bigger than a typo, comment on the issue first:** "I'd like to work on this. My plan is X. Does that sound right?" Wait for a maintainer to agree. This one step prevents most rejected PRs.
4. **Claim it, then deliver.** If you can't finish, say so, so someone else can pick it up.

## Making the contribution

You already know the mechanics from [Lesson 3](../03-pull-shark.md): fork, branch, commit, PR. On top of that:

- **Match the project's style**, even where you'd do it differently
- **One change per PR.** Don't fix three unrelated things at once
- **Run their tests** and add one for your change if you can
- **Fill in the PR template** completely, and link the issue (`Fixes #123`)
- **Keep your branch up to date** with their `main` ([Git 5](../git/05-remotes.md#keep-your-fork-in-sync))

## After you open the PR

- **Be patient.** Many maintainers are volunteers. A week without a reply is normal. A polite nudge after about two weeks is fine.
- **Respond to every review comment**, and push fixes to the same branch. The PR updates automatically.
- **Don't take it personally.** "Can you change X?" is the process working, not criticism.
- **If it's declined, ask what would help next time,** thank them, and move on. Some ideas don't fit a project's direction, and that's their call.

## Contributions that aren't code

These are just as valued, and often more needed:

- **Docs:** fix confusing instructions, add examples, translate
- **Bug reports** with clear steps to reproduce ([GitHub 2](02-issues-and-projects.md))
- **Triage:** confirm bugs others reported, find duplicates
- **Answering questions** in Discussions ([Galaxy Brain](../05-galaxy-brain.md))
- **Testing betas** and reporting back
- **Sponsoring** maintainers ([Public Sponsor](../07-public-sponsor.md))

## Please don't

- Send AI-generated or automated PRs you haven't read, run and understood
- Open "fixed typo" PRs to dozens of repos just to collect merges
- Comment "+1" or "any update?" over and over. Use a 👍 reaction instead
- Argue in public when a maintainer says no

All of these burn out maintainers, and they're noticed. See [FAIR-PLAY.md](../../FAIR-PLAY.md).

## Exercise

1. Pick one tool you use every week and find its repo.
2. Read its `CONTRIBUTING.md` and browse its open issues.
3. Find one thing you could genuinely help with, even a confusing sentence in the docs, and either comment on an issue or open a small PR.

🧱 **Learners Wall:** add a line about your first contribution to someone else's project. That's a milestone worth recording.

## 🎓 You've finished GitHub skills

Between the three tracks so far, you now know how to use Git confidently, work the way professional teams do on GitHub, and contribute to open source with good manners. Consider giving back: answer a question in our [Discussions](https://github.com/CptNope/github-achievements-academy/discussions), or improve a lesson that confused you.

➡️ Next: put it all together in the Repo recipes track, starting with [Repo 1: Foundations every repo needs](../repos/01-foundations.md)
