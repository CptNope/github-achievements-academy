# Lesson 4: Pair Extraordinaire 👯

**Badge:** co-author commits in **merged** pull requests.

| Tier | Co-authored merged PRs |
|------|-----------------------:|
| Base | 1 |
| 🥉 Bronze | 10 |
| 🥈 Silver | 24 |
| 🥇 Gold | 48 |

## The real skill: pair programming and giving credit

When two people write code together, whether on a call, at one keyboard, or by passing a branch back and forth, Git can credit **both** of them. You add a `Co-authored-by` trailer at the end of the commit message:

```
feat: add dark mode toggle

Implemented together during Friday's pairing session.

Co-authored-by: Sam Rivera <12345678+samrivera@users.noreply.github.com>
```

Rules for the trailer:
- It goes at the **very end** of the message, after a **blank line**.
- One trailer per co-author.
- The email must be one that's linked to their GitHub account. Their no-reply address is the safest choice. Ask them for it, or find it in one of their existing commits.

## Exercise: pair for real

1. Find a partner: a coworker, a friend, or someone from this repo's **Discussions → Find a pair** thread.
2. Pick a small, real task in either of your repos, like a feature, a test or a doc page.
3. Work on it **together** over a screen share. Take turns driving.
4. Commit with the trailer:
   ```bash
   git commit -m "docs: add install guide" -m "Co-authored-by: Name <id+user@users.noreply.github.com>"
   ```
5. Open a PR and merge it. Both of you get credit once it's merged.

> 💡 In the GitHub web editor, you can add co-authors when committing. VS Code and
> GitHub Desktop also have co-author fields.

## Honesty check ✋

Only add people who **actually contributed** to that change. Crediting someone who didn't help, or yourself through an alt account, falsifies authorship. That's the kind of inauthentic activity [FAIR-PLAY.md](../FAIR-PLAY.md) covers.

## What you learned
- Git trailers and commit message structure
- Pair programming etiquette
- Proper credit in collaborative work

➡️ Next: [Lesson 5: Galaxy Brain](05-galaxy-brain.md)
