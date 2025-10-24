import { siteConfig } from './lib/site-config'

export default siteConfig({
  // Press Kit root (no hyphens)
  rootNotionPageId: '295d755ae04880ce98e0ded4e642e0b7',

  // Pretty URLs -> Notion page IDs (no hyphens)
  pageUrlOverrides: {
    '/changelog': '296d755ae04880b5a963c65fbd10afce', // Press Changelog view page
    '/methods': 'TODO_METHODS_PAGE_ID_NO_HYPHENS',
    '/policy': 'TODO_PRESS_POLICY_PAGE_ID_NO_HYPHENS',
    '/scholar': 'TODO_SCHOLAR_BUNDLE_PAGE_ID_NO_HYPHENS'
  },

  name: 'Consequence Ecology',
  domain: 'press.ellari.ai',
  author: 'ELARRI.AI',
  description:
    'Press-safe Consequence Ecology: methods, policy, changelog, and scholar bundle.',
  isPreviewImageSupportEnabled: true,
  isTweetEmbedEnabled: false
})
