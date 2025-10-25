import { siteConfig } from './lib/site-config'

const notionId = (value?: string | null, fallback?: string) =>
  value?.replace(/-/g, '') ?? fallback

const pageUrlOverridesEntries = [
  ['/changelog', notionId(process.env.NOTION_PAGE_CHANGELOG, '296d755ae04880b5a963c65fbd10afce')],
  ['/methods', notionId(process.env.NOTION_PAGE_METHODS)],
  ['/policy', notionId(process.env.NOTION_PAGE_POLICY)],
  ['/scholar', notionId(process.env.NOTION_PAGE_SCHOLAR)]
].filter(([, id]) => Boolean(id)) as Array<[string, string]>

const pageUrlOverrides =
  pageUrlOverridesEntries.length > 0
    ? Object.fromEntries(pageUrlOverridesEntries)
    : null

export default siteConfig({
  // Press Kit root. Provide NOTION_PAGE_PRESSKIT env or fall back to default.
  rootNotionPageId: notionId(process.env.NOTION_PAGE_PRESSKIT, '297d755ae048810298e5c327291fb443'),

  // Pretty URLs -> Notion page IDs (no hyphens)
  pageUrlOverrides,

  name: 'Consequence Ecology',
  domain: 'press.ellari.ai',
  author: 'ELARRI.AI',
  description:
    'Press-safe Consequence Ecology: methods, policy, changelog, and scholar bundle.',
  isPreviewImageSupportEnabled: true,
  isTweetEmbedSupportEnabled: false
})
