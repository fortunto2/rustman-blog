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

export const CONSULTING = [
  {
    title: 'RAG & Knowledge Systems',
    description: '7 production patterns — from vector search to agentic RAG',
    href: '/wiki/rag-patterns',
  },
  {
    title: 'AI Agent Development',
    description: 'Multi-agent systems, harness engineering, reliable autonomous workflows',
    href: '/posts/harness-engineering',
  },
  {
    title: 'Fast MVP Development',
    description: '0→1 in days: validate, build, launch with AI-first stack',
    href: '/posts/launch-playbook',
  },
  {
    title: 'Team AI Training',
    description: 'Context engineering, prompt design, agent workflows for dev teams',
    href: '/wiki/context-engineering',
  },
] as const;

export const PROJECT_PRIORITY = {
  openSource: ['project-solograph', 'project-solo-factory', 'project-openai-oxide', 'project-rust-code', 'project-airq', 'project-you2idea', 'project-invoice-crm'],
  products: ['project-superduperai', 'project-superstoryboard'],
} as const;
