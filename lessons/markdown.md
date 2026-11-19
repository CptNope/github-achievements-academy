# Writing Markdown on GitHub

Markdown is the simple formatting language behind READMEs, issues, pull requests, comments, Discussions and wikis on GitHub. You type plain text with a few symbols, and GitHub turns it into formatted text. Ten minutes with this page covers almost everything you'll need.

> 💡 Every comment box on GitHub has a **Preview** tab. Use it to check your formatting before you post.

## Text

| You type | You get |
|----------|---------|
| `**bold**` | **bold** |
| `*italic*` | *italic* |
| `~~struck through~~` | ~~struck through~~ |
| `` `inline code` `` | `inline code` |
| `[link text](https://example.com)` | [link text](https://example.com) |

Leave a **blank line** between paragraphs. A single line break is ignored in files like README.md.

## Headings

```markdown
# Page title (use once, at the top)
## Section
### Sub-section
```

Use headings in order, without skipping levels. Screen-reader users navigate by them, and GitHub builds a table of contents from them (the list icon at the top of a README).

## Lists

```markdown
- An item
- Another item
  - Indent two spaces for a nested item

1. First step
2. Second step

- [ ] A task to do
- [x] A finished task
```

Task lists in issues and pull requests can be ticked by clicking, and GitHub shows progress ("2 of 5 tasks").

## Code

Wrap code in three backticks, and name the language for syntax highlighting:

````markdown
```js
const total = items.reduce((sum, i) => sum + i.price, 0);
```
````

Use `bash` for commands, `diff` to show changes, and `suggestion` in a review comment to propose an exact change ([GitHub 3](github/03-code-review.md#suggested-changes)).

## Images

```markdown
![Screenshot of the checkout page with the total highlighted](docs/checkout.png)
```

**Always write alt text** (the words in square brackets) that describes what the image shows. It's what screen-reader users hear, and what everyone sees if the image fails to load. To add an image to an issue or PR, paste or drag it into the comment box, then edit the alt text GitHub inserts.

## Tables

```markdown
| Command      | What it does           |
|--------------|------------------------|
| `git status` | Shows what changed     |
| `git log`    | Shows commit history   |
```

Keep tables small and give every column a header. For long content, a list is often easier to read, especially on phones.

## GitHub extras

| You type | What it does |
|----------|-------------|
| `#42` | Links to issue or PR 42 in this repo |
| `owner/repo#42` | Links to an issue in another repo |
| `@username` | Mentions someone, and notifies them |
| `@org/team` | Mentions a team |
| A commit ID like `a1b2c3d` | Links to that commit |
| `Fixes #42` in a PR | Closes issue 42 when the PR merges ([GitHub 2](github/02-issues-and-projects.md#link-pull-requests-to-issues)) |

Only mention people who need to see something. Every `@` sends a notification.

### Alerts

```markdown
> [!NOTE]
> Useful information people should know.

> [!WARNING]
> Something that could cause problems.
```

The other alert types are `[!TIP]`, `[!IMPORTANT]` and `[!CAUTION]`. Use them sparingly, or they lose their effect.

### Collapsed sections

```markdown
<details>
<summary>Full error log</summary>

Paste long logs here so they don't swamp the conversation.

</details>
```

## Writing that helps people

- **Lead with the point.** The first sentence of a README, issue or PR should say what it's about.
- **Use descriptive link text.** "Read the [install guide](#)" rather than "click [here](#)". Screen readers often list links out of context.
- **Don't rely on color or emoji alone** to carry meaning. Say it in words too.
- **Keep lines of code in code blocks**, not screenshots, so people can copy them and screen readers can read them.

## Exercise

1. In your sandbox repo, edit `README.md`. Add a heading, a short list, a code block and a link.
2. Open a new issue that uses a task list and an alert, and check it with **Preview** first.
3. Add an image with good alt text.

## What you learned
- Text, headings, lists, code, images and tables in Markdown
- GitHub extras: references, mentions, alerts and collapsed sections
- Writing habits that make your text clearer and more accessible
