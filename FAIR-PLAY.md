# 🤝 Fair Play: earning badges without risking your account

GitHub is where many of us keep our work, our portfolios and our businesses. Losing an account over a badge would be a terrible trade. This page explains where the line is.

> This is a plain-English summary, not legal advice. The source of truth is always
> [GitHub's Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies)
> and the [Community Guidelines](https://docs.github.com/en/site-policy/github-terms/github-community-guidelines).
> Read them yourself, since they can change.

## What the policies prohibit (paraphrased)

GitHub's Acceptable Use Policies have a section on spam and inauthentic activity. It forbids, among other things:

- **Automated excessive bulk activity** and **coordinated inauthentic activity**, such as spamming.
- **Inauthentic interactions**, like fake/sock-puppet accounts and automated inauthentic activity.
- **Rank abuse**, like automated starring or following.
- **Secondary markets** for inauthentic activity, such as buying or selling stars or followers.

GitHub keeps full discretion to remove content or suspend accounts that break these rules.

## ✅ Green light: do this

| Activity | Why it's fine |
|----------|---------------|
| Opening and quickly closing an issue in **your own** repo because you made a mistake or it was a duplicate | That's normal triage. It happens every day. |
| Merging your own PR without review in **your own** solo project | Solo developers do this all the time. |
| Real PRs that fix typos, docs, bugs or tests in other projects | That's exactly what open source wants. |
| Adding `Co-authored-by` for someone who actually helped write the code | That's accurate credit. |
| Answering Discussions questions you actually know the answer to | That's real help. |
| Sharing your project in communities where it's relevant | That's normal promotion. |
| Sponsoring a maintainer, even for $1 | That's real support. |

## 🛑 Red light: never do this

| Activity | Why it's a problem |
|----------|--------------------|
| Scripts that open and merge hundreds or thousands of empty PRs | Automated excessive bulk activity |
| Alt accounts that star your repos, or answer and accept your own Discussions | Fake accounts and inauthentic interactions |
| "Star for star" / "follow for follow" exchanges, or buying stars | Rank abuse and secondary markets |
| `Co-authored-by` trailers for people who didn't contribute | It falsifies authorship, and it's dishonest |
| Spamming low-effort PRs to strangers' repos (e.g. whitespace changes) | It wastes maintainers' time. Many projects ban accounts that do this. |
| Asking people in this repo to star or follow you | Please don't. Those PRs will be closed. |

## 🟡 A rule of thumb

> **Would you be comfortable if a hiring manager or a GitHub staff member read the activity log?**

If the answer is yes, you're fine. Badges should *describe* what you did, not be the reason you did it.

## Why this repo has no "auto-farm" mode

Even the self-serve badges (Quickdraw, YOLO) are taught one action at a time, with an explanation, in your own sandbox. The [`coach.sh`](scripts/coach.sh) script deliberately **does not loop**. It does one thing, explains it, and stops. Bulk automation is the exact behavior the policies call out.
