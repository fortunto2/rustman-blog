export const SITE = {
  domain: 'rustman.org',
  name: 'rustman',
  title: 'rustman — build in public',
  description: 'Solo founder building products with AI. Principles, methodology, lessons learned.',
  lang: 'en',

  author: {
    name: 'Rustam Salavatov',
    avatar: '/avatar.jpg',
    tagline: 'Solo founder building products with AI. Shipping fast, learning in public.',
    shortBio: 'Solo founder · AI engineer · CTO',
  },

  contact: {
    email: 'info@superduperai.co',
    calendar: 'https://calendar.app.google/n4GorZYpiAucGjAE6',
  },

  navigation: [
    { href: '/course', label: 'Course' },
    { href: '/posts', label: 'Posts' },
    { href: '/wiki', label: 'Wiki' },
    { href: '/projects', label: 'Projects' },
    { href: '/skills', label: 'Skills' },
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

export const HERO_CARDS = [
  {
    title: 'Course: AI Solopreneur',
    description: '7 modules from mindset to shipping. For solo founders and teams adopting AI agents',
    href: '/course',
  },
  {
    title: 'Solo Factory',
    description: '30 executable skills for Claude Code. Research → validate → build → deploy → launch',
    href: '/projects/project-solo-factory',
  },
  {
    title: 'Open Source',
    description: 'Rust crates, MCP servers, CLI tools. Code intelligence, invoicing, air quality',
    href: '/projects',
  },
  {
    title: 'AI Consulting',
    description: 'RAG systems, multi-agent pipelines, MVP development. Team training on agent workflows',
    href: '/about',
  },
] as const;

export const PROJECT_PRIORITY = {
  openSource: ['project-solograph', 'project-solo-factory', 'project-openai-oxide', 'project-rust-code', 'project-airq', 'project-you2idea', 'project-invoice-crm'],
  products: ['project-superduperai', 'project-superstoryboard'],
} as const;
