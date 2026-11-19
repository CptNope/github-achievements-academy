# Repo 4: Websites and documentation sites

GitHub Pages hosts static websites for free, straight from a repository: portfolios, project sites, documentation, landing pages. This very site is one. This lesson covers the setups that work and the one security step most people miss.

## Three ways to publish

| Setup | Use it when | Settings → Pages |
|-------|------------|------------------|
| **Branch + folder** | Plain HTML/CSS/JS with no build step | Source: *Deploy from a branch*, then `main` and `/` (root) or `/docs` |
| **GitHub Actions** | The site needs building (Astro, Vite, Next.js static export, Hugo, a docs generator) | Source: *GitHub Actions*, then pick or write a workflow |
| **Jekyll** (built in) | Markdown blogs, without your own build | Branch-based. Pages runs Jekyll automatically |

> 💡 If you publish plain HTML and don't use Jekyll, add an empty `.nojekyll` file to the published
> folder. It stops Pages from processing your files, which can otherwise hide folders starting with `_`.

### Repo name decides the address

| Repo name | URL |
|-----------|-----|
| `yourname.github.io` | `https://yourname.github.io/` (your main site, only one per account) |
| anything else, e.g. `portfolio` | `https://yourname.github.io/portfolio/` |

Because project sites live in a subfolder, use **relative links** (`assets/style.css`, not `/assets/style.css`), or set your build tool's base path.

## A build-and-deploy workflow

For sites with a build step, choose **Source: GitHub Actions**:

```yaml
name: Deploy site
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
      - run: npm ci
      - run: npm run build             # outputs to dist/
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
```

Action versions change, and Dependabot will keep them current ([GitHub 6](../github/06-security.md#dependabot)). GitHub's **Pages → GitHub Actions** setup screen also suggests ready-made workflows for popular tools.

## Custom domains, safely

1. **Verify the domain first:** profile **Settings → Pages → Add a domain**, then add the TXT record it gives you at your DNS provider. Verification stops other GitHub users from claiming your domain or its subdomains if your site is ever unpublished.
2. **Add the domain in the repo** (**Settings → Pages → Custom domain**) **before** changing DNS.
3. At your DNS provider:
   - For `www.example.com`, add a **CNAME** record pointing to `yourname.github.io`
   - For the apex `example.com`, add **A** records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`
4. Wait for DNS (up to 24 hours), then tick **Enforce HTTPS**.

**Never use wildcard DNS records** (`*.example.com`) pointing at GitHub Pages. They invite subdomain takeovers. Always check GitHub's [custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for the current addresses.

## Documentation sites

- **Keep docs in the same repo as the code** (usually `docs/`), so a PR that changes behavior also changes the docs.
- **Write for tasks**, not file structure: "How to export a report" beats "The ExportService class".
- **Add an "Edit this page" link** to each page, pointing at the source file on GitHub. Every lesson on this site does this, and it turns readers into contributors.
- **Check links in CI**, for example with a link-checker action, so docs don't rot.
- Popular generators include Docusaurus, MkDocs (Material), Astro Starlight and VitePress.

## What Pages isn't for

Pages serves **static files only**: no server code, no database, no secrets. Anything in the repo is public on a public site. For server code, deploy elsewhere and keep this repo for the front end. Check GitHub's terms of service for usage limits too.

## Exercise

1. Create a repo with an `index.html` and publish it with **Deploy from a branch**.
2. Add a second page and link between them with relative links.
3. If you own a domain: verify it, add a `www` CNAME, and enforce HTTPS.

## What you learned
- Branch, Actions and Jekyll publishing, and how repo names map to URLs
- A build-and-deploy workflow
- Custom domains with verification and HTTPS, and good docs habits

➡️ Next: [Repo 5: Team and client projects](05-team-and-client-projects.md)
