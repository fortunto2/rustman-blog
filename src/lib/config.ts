export const SITE = {
  domain: 'rustman.org',
  name: 'rustman',
  title: 'rustman — build in public',
  description: 'Solo founder building products with AI. Principles, methodology, lessons learned.',
  lang: 'en',
  author: 'Rustam Salavatov',

  navigation: [
    { href: '/wiki', label: 'Wiki' },
    { href: '/projects', label: 'Projects' },
    { href: '/stacks', label: 'Stacks' },
    { href: '/about', label: 'About' },
  ],

  social: {
    github: 'https://github.com/fortunto2',
    linkedin: 'https://www.linkedin.com/in/rustam-salavatov/',
    telegram: 'https://t.me/life2film',
    youtube: 'https://www.youtube.com/@SuperDuperStartup',
    instagram: 'https://instagram.com/life2film',
  },
} as const;
