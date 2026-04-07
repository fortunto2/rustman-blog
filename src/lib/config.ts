export const SITE = {
  domain: 'rustman.org',
  name: 'rustman',
  title: 'rustman — build in public',
  description: 'Solo founder building products with AI. Principles, methodology, lessons learned.',
  lang: 'en',
  author: 'Rustam',

  navigation: [
    { href: '/wiki', label: 'Wiki' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
  ],

  social: {
    github: 'https://github.com/fortunto2',
    twitter: 'https://x.com/rustman',
  },
} as const;
