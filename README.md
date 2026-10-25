# inonda.site

Website of Inonda LTD, property management in Nicosia and Cyprus. Hosted on Wasmer Edge; domain at GoDaddy.

## How updates go live

The `main` branch connects to the Wasmer app that serves https://www.inonda.site.
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
3. Wait a minute and refresh https://www.inonda.site.

Change the same text in every language folder you use. If you add or rename a page, add it to `public/sitemap.xml` too.

## Undo a change

Open **Commits**, pick the bad commit, and click **Revert**. The site returns to the previous version.


## Connected INONDA websites

All public language pages now include shared navigation and a three-website chooser.

- https://www.inonda.site: property management and owner support.
- https://www.inonda.org: maintenance, repairs and renovation scope.
- https://www.inonda.homes: configurable planning estimates, including 19% VAT.

The visitor’s language is preserved. Relevant service pages link to selected calculator services; regional pages can preselect their named area. No personal details, visitor notes or saved estimates are synchronized between domains. Specialist work still requires an assessment.

To update shared wording, edit tools/network-copy.json in all three repositories, keep tools/inonda_network.py synchronized, then run:

```bash
python tools/inonda_network.py site
```

Commit the tools, versioned CSS/JS and changed HTML pages together. The inonda.org build generator also applies the component automatically. Keep each site’s canonical URLs and existing content.

## Shared chatbot and contact icons

The same automated INONDA service and request guide is installed on all three websites. Source: tools/inonda_chat.js, tools/inonda_chat.css, tools/chat-copy.json and tools/chat-ui.json. Keep these copies synchronized alongside the network generator. It supports six languages, service combinations, referrals and a guided request draft. On inonda.homes it can explain the actual current budget. Visitor messages stay in page memory; no AI service or shared conversation database is configured.

Visitors review a request before opening a WhatsApp or email draft. Viber buttons open the selected person’s chat; the visitor can copy their visible request. No message is sent automatically. Original communication icons are self-hosted; see BRAND-ASSETS.md.

Company footer social profiles are in tools/social-links.json. Facebook and Instagram use the owner’s previously supplied company URLs. TikTok is supported by the generator and appears automatically when its exact company URL is supplied in that file; do not guess its handle. Keep the configuration synchronized across all three repositories. LinkedIn is excluded by the owner.
