# GitHub 3: Code review

Code review is where teams catch bugs, share knowledge and agree on how things should be done. Being a good reviewer, and being easy to review, are two of the most valued skills on any team.

## Make your PR easy to review

- **Keep it small.** Under about 400 changed lines gets far better reviews than 2,000. Split big work into a series of PRs.
- **Write a description** that answers: what changed, why, and how to test it. Add screenshots for anything visual.
- **Review it yourself first.** Read your own diff on GitHub before asking anyone else. You'll catch half the comments.
- **Use a draft PR** (**Create pull request ▾ → Create draft pull request**) to share early work without asking for a full review.
- **Link the issue** with `Fixes #12`.

A PR template (`.github/PULL_REQUEST_TEMPLATE.md`) prompts people to do all this. This repo has [one](../../.github/PULL_REQUEST_TEMPLATE.md).

## Reviewing: the mechanics

Open the PR's **Files changed** tab.

- Click the **+** next to a line to comment on it. Drag to comment on several lines.
- **Start a review** (instead of *Add single comment*) to batch your comments into one notification.
- Tick **Viewed** on each file as you go, so you can track your progress.
- Finish with **Review changes**:

| Choice | Meaning |
|--------|---------|
| Comment | General feedback, no verdict |
| Approve | Good to merge |
| Request changes | Must be addressed before merging |

### Suggested changes

For small fixes, suggest the exact code. The author can apply it with one click:

````markdown
```suggestion
const total = items.reduce((sum, item) => sum + item.price, 0);
```
````

## Reviewing: the human part

- **Review the code, not the person.** "This loop runs twice" beats "You wrote this wrong".
- **Ask, don't order:** "What happens if `items` is empty?" invites thinking.
- **Label how much it matters.** Prefixes like `nit:` (tiny, optional), `question:` and `blocking:` save a lot of back-and-forth.
- **Say what's good.** "Nice test coverage here" costs nothing and builds trust.
- **Be quick.** A review within a day keeps everyone moving. Can't review in depth? Say when you will.

**Receiving feedback:** assume good intent, reply to every comment (even just "Done"), and push back politely with reasons when you disagree. Resolve conversations once they're addressed.

## Require reviews with rulesets

**Settings → Rules → Rulesets → New branch ruleset**, targeting your default branch:

- ✅ *Require a pull request before merging*, with at least 1 approval
- ✅ *Dismiss stale approvals when new commits are pushed*
- ✅ *Require status checks to pass* (your CI tests, see [GitHub 4](04-actions.md))
- ✅ *Block force pushes*

## CODEOWNERS: automatic reviewers

A `CODEOWNERS` file (in `.github/`, the root, or `docs/`) requests reviews from the right people automatically:

```
# Everything: the core team
*               @your-org/core

# Docs: the docs team
/docs/          @your-org/docs

# Payments code: two named people
/src/payments/  @alice @bob
```

Later lines take priority. Combine it with the ruleset option *Require review from Code Owners* for sensitive areas.

## Exercise

1. Ask a friend (or someone from this repo's Discussions) to swap reviews: each of you opens a small PR in your own repo and reviews the other's.
2. Leave at least one suggested change and one question.
3. Apply the suggestion you received with one click.

That swap also counts toward [Pair Extraordinaire](../04-pair-extraordinaire.md) if you co-author a fix.

## What you learned
- Writing PRs that are easy to review
- Line comments, suggested changes and review verdicts
- Kind, useful feedback, plus rulesets and CODEOWNERS

➡️ Next: [GitHub 4: Automate with Actions](04-actions.md)
