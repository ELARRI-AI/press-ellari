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

Edit `site.config.ts`:

- `rootNotionPageId` (no hyphens) — Press Kit page
- `pageUrlOverrides` — map routes to Notion page IDs (no hyphens)

---

# Next (after commit)

- **Publish** the Notion pages you’ll expose (Press Kit root, Changelog view, Methods, Policy, Scholar).
- Import the repo in **Vercel → New Project** → **Deploy** → add domain `press.ellari.ai`.

Ping me when the repo is live and I’ll fill the remaining Notion IDs (methods/policy/scholar) and add a small op so your weekly press summary also appends a row in the **Press Changelog** database.
