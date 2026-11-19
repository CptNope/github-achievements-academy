# Repo 6: WordPress plugins and themes

WordPress powers a huge share of the web, and its official plugin directory still uses **Subversion (SVN)**, not Git. The good news: you can develop entirely on GitHub and let Actions publish to WordPress.org every time you tag a release.

## A repo layout that works

```
my-plugin/
├── my-plugin.php          main file with the plugin header
├── readme.txt             the WordPress.org listing (not README.md)
├── uninstall.php          cleans up options and tables on delete
├── includes/              PHP classes
├── assets/                the plugin's own CSS, JS and images
├── languages/             translation files
├── .wordpress-org/        directory banners, icons and screenshots (deployed to SVN /assets)
├── .distignore            files that must NOT ship to users
├── composer.json          PHPCS + WordPress Coding Standards
├── README.md              the GitHub page, for developers
└── .github/workflows/
    ├── ci.yml
    └── deploy.yml
```

**Two readmes on purpose:** `readme.txt` uses WordPress's own format (stable tag, tested-up-to, changelog) and powers your directory listing. `README.md` is for developers on GitHub.

### .distignore: keep dev files out of the release

```
/.git
/.github
/.wordpress-org
/node_modules
/tests
.distignore
.gitignore
composer.json
composer.lock
package.json
package-lock.json
phpcs.xml.dist
README.md
```

## Licensing

Plugins and themes in the WordPress.org directory must be **GPL-compatible**, and most use `GPL-2.0-or-later`. Say so in the plugin header, in `readme.txt` and in a `LICENSE` file.

## CI: coding standards and security checks

Run [PHP_CodeSniffer](https://github.com/PHPCSStandards/PHP_CodeSniffer) with the [WordPress Coding Standards](https://github.com/WordPress/WordPress-Coding-Standards) on every PR. They catch escaping, sanitizing and nonce problems before a reviewer does:

```yaml
name: CI
on: [pull_request, push]
permissions:
  contents: read
jobs:
  phpcs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer
      - run: composer install --no-interaction --no-progress
      - run: vendor/bin/phpcs
```

Also consider running the official **Plugin Check** plugin before submitting.

### The review checklist people fail most

Plugin reviewers reject submissions for the same few things again and again. Before every release, check that:

- [ ] **Every handler that reads `$_GET`, `$_POST` or `$_REQUEST` verifies a nonce** (`check_admin_referer()`, `check_ajax_referer()` or `wp_verify_nonce()`) **and checks permissions** (`current_user_can()`)
- [ ] All input is **sanitized** (`sanitize_text_field()`, `absint()`…) and all output **escaped** (`esc_html()`, `esc_attr()`, `esc_url()`…)
- [ ] Database queries use `$wpdb->prepare()`
- [ ] Function, class, option and hook names have a **unique prefix**
- [ ] No external calls, tracking or remote assets without clear consent
- [ ] `readme.txt` has an accurate **Stable tag** that matches the plugin header version

## Deploy to WordPress.org on every release

[10up's WordPress.org Plugin Deploy action](https://github.com/10up/action-wordpress-plugin-deploy) commits your tagged release to SVN, respecting `.distignore`:

```yaml
name: Deploy to WordPress.org
on:
  release:
    types: [published]
permissions:
  contents: write    # to attach the zip to the GitHub release
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: wordpress-org
    steps:
      - uses: actions/checkout@v7
      - name: WordPress Plugin Deploy
        id: deploy
        uses: 10up/action-wordpress-plugin-deploy@stable
        with:
          generate-zip: true
        env:
          SVN_USERNAME: ${{ secrets.SVN_USERNAME }}
          SVN_PASSWORD: ${{ secrets.SVN_PASSWORD }}
          SLUG: my-plugin            # only needed if it differs from the repo name
      - name: Attach zip to the GitHub release
        run: gh release upload "${{ github.event.release.tag_name }}" "${{ steps.deploy.outputs.zip-path }}"
        env:
          GH_TOKEN: ${{ github.token }}
```

- Store `SVN_USERNAME` and `SVN_PASSWORD` as **environment secrets** on a `wordpress-org` environment, ideally with yourself as a required reviewer.
- The **[Readme/Assets Update action](https://github.com/10up/action-wordpress-plugin-asset-update)** updates `readme.txt` and banners between releases without a new version.
- **Themes** use a similar flow. The WordPress.org theme directory has its own review process and upload steps, so check its current docs.

## The release routine

1. Merge PRs into `main`, with CI green.
2. Bump the version in the plugin header **and** the `Stable tag` in `readme.txt`, and add a changelog entry.
3. Run through the review checklist above.
4. Publish a GitHub release tagged with the same version (for example `1.4.0`).
5. The deploy workflow updates WordPress.org, and the zip is attached to the GitHub release.

## Exercise

1. Add `.distignore`, `composer.json` with WordPress Coding Standards, and the CI workflow to a plugin repo.
2. Fix whatever PHPCS reports, especially nonces and escaping.
3. Draft (don't publish) the deploy workflow and add the secrets to a `wordpress-org` environment.

## What you learned
- A repo layout for plugins and themes, with two readmes on purpose
- Coding-standard CI and the review checklist that catches common rejections
- Automatic deploys from GitHub releases to WordPress.org's SVN

➡️ Next: [Repo 7: Courses, workshops and templates](07-courses-and-templates.md)
