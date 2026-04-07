export const SITE = {
  domain: 'rustman.blog',
  name: 'rustman',
  title: 'rustman — build in public',
  description: 'Solo founder building products with AI. Principles, methodology, lessons learned.',
  lang: 'en',
  author: 'Rustam',

  contentTypes: {
    articles: { label: 'Articles', emoji: '', path: '/articles' },
    projects: { label: 'Projects', emoji: '', path: '/projects' },
    notes: { label: 'Notes', emoji: '', path: '/notes' },
  },

  navigation: [
    { href: '/articles', label: 'Articles' },
    { href: '/projects', label: 'Projects' },
    { href: '/notes', label: 'Notes' },
    { href: '/about', label: 'About' },
    { href: '/search', label: 'Search' },
  ],

  social: {
    github: 'https://github.com/fortunto2',
    twitter: 'https://x.com/rustman',
  },
} as const;

export type ContentType = keyof typeof SITE.contentTypes;
