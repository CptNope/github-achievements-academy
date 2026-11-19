# Contributing

Thanks for helping! There are two kinds of contributions.

## 1. Learners Wall pages

See [Lesson 3](lessons/03-pull-shark.md) for the step-by-step guide. In short:

- Copy `learners/_TEMPLATE.md` to `learners/<your-username>.md` (lowercase).
- One PR = one meaningful update (a new page, or a newly finished lesson with a sentence about what you learned).
- Your PR may only touch your own file. The **Validate learner page** check enforces this.
- A maintainer reviews every PR by hand. Please be patient. This is a hobby-sized project.

PRs that are empty, duplicate or spammy (e.g. ticking one box per PR with no learning note, or asking for stars/follows) will be closed.

## 2. Improving the lessons

Corrections, clearer explanations, new screenshots and translations are all very welcome.

- Achievement rules change. If you spot something outdated, include a link to your source.
- Keep the tone friendly and beginner-safe.
- Never add instructions that automate bulk activity or fake interactions. See [FAIR-PLAY.md](FAIR-PLAY.md).
- The website's lesson pages are generated from the Markdown. After editing a lesson, run `npm install` once, then `npm run build`, and commit the updated `docs/learn/` files too. A CI check reminds you if you forget.

## Code of conduct

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).
