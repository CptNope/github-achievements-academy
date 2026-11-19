# Repo 2: Personal projects and portfolio pieces

Most repos start as personal projects: a game, a tool you needed, something you built to learn. Set up well, the same repo doubles as a portfolio piece that shows clients and employers how you work.

## Goal: someone understands it in 60 seconds

A visitor should be able to see **what it is**, **that it works**, and **how it's built**, without cloning anything.

## The setup

| Item | Why |
|------|-----|
| **A demo link** in the *About* website field and at the top of the README | Proof it works. Use GitHub Pages for anything that runs in a browser ([Repo 4](04-websites-and-docs.md)) |
| **A screenshot or short GIF** in the README | Most visitors never click through. Show them |
| **A "How it's built" section** | Lists the stack and one or two interesting decisions. This is what hiring managers look for |
| **A license** | MIT is a common choice for personal projects. Without one, nobody can reuse your code |
| **Topics** | `threejs`, `game`, `pwa`… These help people find it |
| **A short roadmap** or a few open issues | Shows the project is alive and you think ahead |

### A README that works as a portfolio piece

```markdown
# Hearthdeep

A cozy browser dungeon crawler built with three.js. **[Play it →](https://example.github.io/hearthdeep/)**

![Gameplay: exploring the first floor](docs/screenshot.png)

## Features
- Procedurally generated floors
- Saves progress in your browser
- Plays with keyboard, mouse or touch

## How it's built
- three.js for rendering, with a custom grid-based dungeon generator
- No framework: plain ES modules, under 60 KB gzipped
- Deployed to GitHub Pages by an Actions workflow on every push to main

## Run it locally
    npm install
    npm run dev

## License
MIT
```

## Habits that help (even solo)

- **Use branches and pull requests anyway.** A PR per feature gives you a readable history and a place for notes. Every merged one counts toward [Pull Shark](../03-pull-shark.md).
- **Write issues for your own to-do list.** Future you will thank present you. Label a few `good first issue` if you'd welcome help.
- **Commit messages that explain why** ([Git 2](../git/02-everyday-loop.md)). Your history becomes a story of decisions.
- **Tag versions** when you reach milestones ([GitHub 5](../github/05-releases.md)), even `v0.1.0`.

## Pin it, then let it be finished

Pin your best 3 to 6 projects to your profile ([GitHub 1](../github/01-profile.md)). Projects can be **finished**. When you stop working on one, say so in the README ("This project is complete and no longer maintained") or archive it (**Settings → General → Archive this repository**). Archived repos are read-only, clearly labeled, and still count as portfolio pieces.

## Exercise

Choose your best personal project and give it:
1. A one-sentence description and a demo link at the top of the README
2. A screenshot
3. A "How it's built" section with two or three bullets
4. A pin on your profile

## What you learned
- What visitors need to see in the first minute
- A README structure that works as a portfolio piece
- Branch, PR and issue habits that pay off even when you work alone

➡️ Next: [Repo 3: Open source libraries and packages](03-open-source-packages.md)
