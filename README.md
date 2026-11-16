# inonda.site

Website of Inonda LTD, property management in Nicosia and Cyprus. Available at https://www.inonda.site; the domain and hosting configuration must be verified independently.

## How updates go live

The published site is served at https://www.inonda.site. Verify the active deployment target before making hosting changes.
Do not assume a change is live until the published website has been checked.
You never need to touch GoDaddy DNS for updates.

## Folder layout

| Path | What it is |
|------|------------|
| `public/` | The website itself, one folder per language: `el`, `en`, `ru`, `uk`, `he`, `ro` |
| `public/assets/` | Stylesheet, script, logo and images |
| `public/sitemap.xml`, `robots.txt`, `llms.txt` | Search engine and AI crawler files |
| `settings/config.toml` | Web server settings (404 page, headers, old-URL redirects) |
| `Staticfile` | Legacy static server entrypoint for serving `public/`; retain until the active runtime is verified |

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

Company footer social profiles are in tools/social-links.json. Facebook and Instagram use the owner’s previously supplied company URLs. TikTok uses the confirmed company profile @inonda26; YouTube uses @InondaLTD. Preserve these exact company channels. Keep the configuration synchronized across all three repositories. LinkedIn is excluded by the owner.

Shared asset changes require incrementing VERSION in tools/inonda_network.py before regenerating. Versioned assets remain cached for performance. See the hosting note below for the static HTML cache behaviour.

### Current static hosting cache behaviour

Previous live checks found that the static runtime ignored the legacy settings/config.toml overrides and returned Cache-Control: max-age=86400 for HTML. Verify current headers independently. Refresh the page after a deployment; use a hard refresh if a browser retains an earlier page. Changing that TOML file alone does not change the live headers. The original management-site CSS/JS and shared assets now use versioned URLs to avoid stale layouts. The estimator uses its own no-store Python host.
