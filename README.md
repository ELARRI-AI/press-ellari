# press-ellari

Press-safe Consequence Ecology site. Built with **Next.js + react-notion-x**, sourced from Notion (Press Kit, Changelog, Methods, Policy, Scholar Bundle).

- Root Notion page: Press Kit
- Pretty routes: `/changelog`, `/methods`, `/policy`, `/scholar`
- Guard rails: Public PII lint on PRs

## Dev

```bash
npm install
npm run dev
```

Config

Edit `site.config.ts` or set environment variables:

- `NOTION_PAGE_PRESSKIT` — Press Kit home (defaults to `297d755ae048810298e5c327291fb443`)
- `NOTION_PAGE_CHANGELOG` — `/changelog` (defaults to `297d755ae04880029786fc961c90f1f6`)
- `NOTION_PAGE_PRESS_METHODS` — `/methods` (`297d755ae048805596a6fcabf798bc81`)
- `NOTION_PAGE_PRESS_POLICY` — `/policy` (`297d755ae0488080b963fb8f57096ea4`)
- `NOTION_PAGE_PRESS_FAQ` — `/faq` (`297d755ae048803ebf68f613e62bac9b`)
- `NOTION_PAGE_SCHOLAR_BUNDLE` — `/scholar` (`297d755ae0488048bf23c5ac0f7c6039`)
- Values can include hyphens; the app strips them automatically

---

# Next (after commit)

- **Publish** the Notion pages you’ll expose (Press Kit root, Changelog view, Methods, Policy, Scholar).
- Import the repo in **Vercel → New Project** → **Deploy** → add domain `press.ellari.ai`.

Ping me when the repo is live and I’ll fill the remaining Notion IDs (methods/policy/scholar) and add a small op so your weekly press summary also appends a row in the **Press Changelog** database.
