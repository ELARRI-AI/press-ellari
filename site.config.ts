import { siteConfig } from './lib/site-config'

const notionId = (value?: string | null) => value?.replace(/-/g, '')

const ids = {
  pressKit:
    notionId(process.env.NOTION_PAGE_PRESSKIT) ?? '297d755ae048810298e5c327291fb443',
  changelog:
    notionId(process.env.NOTION_PAGE_CHANGELOG) ?? '297d755ae04880029786fc961c90f1f6',
  methods:
    notionId(process.env.NOTION_PAGE_PRESS_METHODS ?? process.env.NOTION_PAGE_METHODS) ??
    '297d755ae048805596a6fcabf798bc81',
  policy:
    notionId(process.env.NOTION_PAGE_PRESS_POLICY ?? process.env.NOTION_PAGE_POLICY) ??
    '297d755ae0488080b963fb8f57096ea4',
  faq:
    notionId(process.env.NOTION_PAGE_PRESS_FAQ ?? process.env.NOTION_PAGE_FAQ) ??
    '297d755ae048803ebf68f613e62bac9b',
  scholar:
    notionId(process.env.NOTION_PAGE_SCHOLAR_BUNDLE ?? process.env.NOTION_PAGE_SCHOLAR) ??
    '297d755ae0488048bf23c5ac0f7c6039'
}

const pageUrlOverrides = {
  '/changelog': ids.changelog,
  '/methods': ids.methods,
  '/policy': ids.policy,
  '/faq': ids.faq,
  '/scholar': ids.scholar
}

export default siteConfig({
  // Press Kit root. Provide NOTION_PAGE_PRESSKIT env or fall back to default.
  rootNotionPageId: ids.pressKit,

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
