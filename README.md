# inonda.site

Website of Inonda LTD, property management in Nicosia and Cyprus. Hosted on Wasmer Edge; domain at GoDaddy.

## How updates go live

The `main` branch connects to the Wasmer app that serves https://inonda.site.
Each change saved to `main` deploys on its own within a minute or two.
You never need to touch GoDaddy DNS for updates.

## Folder layout

| Path | What it is |
|------|------------|
| `public/` | The website itself, one folder per language: `el`, `en`, `ru`, `uk`, `he`, `ro` |
| `public/assets/` | Stylesheet, script, logo and images |
| `public/sitemap.xml`, `robots.txt`, `llms.txt` | Search engine and AI crawler files |
| `settings/config.toml` | Web server settings (404 page, headers, old-URL redirects) |
| `Staticfile` | Tells Wasmer to serve `public/` as a static site |

## Quick edits from a browser

1. Open the file on github.com, for example `public/en/contact/index.html`.
2. Click the pencil icon, edit the text, then click **Commit changes**.
3. Wait a minute and refresh https://inonda.site.

Change the same text in every language folder you use. If you add or rename a page, add it to `public/sitemap.xml` too.

## Undo a change

Open **Commits**, pick the bad commit, and click **Revert**. The site returns to the previous version.
