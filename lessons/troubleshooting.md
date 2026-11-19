# Troubleshooting 🔧

## "I did it, but the badge isn't showing."
- **Wait 24 hours.** Achievements aren't instant.
- Check your profile in a **private/incognito window** to rule out caching.
- Make sure achievements aren't hidden: **Settings → Public profile → Achievements**.

## "My commits / PRs aren't being counted."
- **Email:** `git config user.email` must be a **verified** email on your account (or your no-reply address). Commits from unknown emails aren't linked to you.
- **Forks:** only PRs **merged into the parent repo** count. Work that stays in your fork doesn't.
- **Branches:** commits only count once they're on the **default branch** (`main`/`master`) or `gh-pages`.
- **Private repos:** turn on *Include private contributions on my profile* (see [Lesson 0](00-setup.md)).

## "I missed Quickdraw / YOLO."
One-time badges are awarded the *first* time you qualify. If you qualified before, you already have them. If not, just do the exercise again in your sandbox.

## "Pair Extraordinaire didn't count my co-author."
- The trailer must be at the **end** of the commit message, after a blank line.
- The spelling must be exact: `Co-authored-by: Name <email>`
- The email must be linked to the co-author's GitHub account.
- The PR must be **merged**.

## "Still nothing after 24 hours."
Search [GitHub Community Discussions](https://github.com/orgs/community/discussions) for your problem, or contact [GitHub Support](https://support.github.com).
And ask in this repo's **Discussions → Q&A**. Someone may be one answer away from Galaxy Brain 😉
