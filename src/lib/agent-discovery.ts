/**
 * The machine-facing description of this site, in the formats agents look for.
 *
 * The generators live in superduper-site-kit/agent; this module is the site's config for them.
 * One module so the files cannot disagree with each other: agents.txt and ai.txt (policy in
 * plain text), the A2A-style agent card, the ARD catalogue, and the RFC 9727 API catalogue.
 *
 * Everything listed here exists and answers. What this site does NOT have stays absent rather
 * than published empty: there is no OAuth (nothing on rustman.org is protected, and the one
 * API that takes a key, agent-board, issues its own bearer keys), no payments of any kind, and
 * no A2A task endpoint. A file claiming otherwise would raise a checker's score and send an
 * agent to a door that does not open.
 */
import { SITE } from './config';
import { getCollection } from './content';
import {
  a2aSkill, agentCard as kitAgentCard, agentPolicyText as kitPolicy, apiCatalog as kitApiCatalog, ardManifest as kitArd,
  ardCoreEntries, SKILL_MD_TYPE, json, text, LINKSET_TYPE, mcpServerCard as kitMcpCard,
} from 'superduper-site-kit/agent';

export { json, text, LINKSET_TYPE };

const base = `https://${SITE.domain}`;

/** The published Solo Factory skills; the skills index and the ARD manifest both list these. */
export function publishedSkills() {
  return getCollection('skills')
    .filter(entry => entry.frontmatter.publish !== false)
    .map(entry => ({
      slug: entry.slug,
      name: String(entry.frontmatter.title || entry.slug).replace(/^\//, ''),
      description: String(entry.frontmatter.description || ''),
      // The markdown twin, not the HTML page: this is meant to be read by a machine.
      url: `${base}/skills/${entry.slug}.md`,
      raw: entry.raw,
      source: entry.frontmatter.source_url ? String(entry.frontmatter.source_url) : undefined,
    }));
}

export const URLS = {
  llms: `${base}/llms.txt`,
  llmsFull: `${base}/llms-full.txt`,
  sitemap: `${base}/sitemap-index.xml`,
  rss: `${base}/rss.xml`,
  mcp: `${base}/mcp`,
  mcpCard: `${base}/.well-known/mcp/server-card.json`,
  agentCard: `${base}/.well-known/agent-card.json`,
  skills: `${base}/.well-known/agent-skills/index.json`,
  apiCatalog: `${base}/.well-known/api-catalog`,
  ard: `${base}/.well-known/ard.json`,
  agentsTxt: `${base}/agents.txt`,
  board: 'https://board.rustman.org',
  boardOpenApi: 'https://board.rustman.org/openapi.json',
  boardSkill: 'https://board.rustman.org/skill.md',
} as const;


/** agents.txt and /.well-known/ai.txt: what an agent may ask for here, and where to start. */
export function agentPolicyText(): string {
  return kitPolicy({
    domain: SITE.domain,
    about: [
      'A personal build-in-public site: notes, projects, stacks and Solo Factory skills by',
      `${SITE.author.name}. Static, public, read-only. Nothing here needs an account.`,
      'The same policy is in robots.txt as a Content-Signal; this file says it in words.',
    ],
    may: [
      'read, index and link to every page                      (search=yes)',
      'quote it when answering someone, with a link to the page (ai-input=yes)',
      `call the MCP server at ${URLS.mcp} (tools: search, read), no key needed`,
    ],
    mustNot: ['fold the content into a training corpus                  (ai-train=no)'],
    notOffered: [
      `accounts, sign-in or OAuth: nothing on ${SITE.domain} is protected`,
      'orders, prices to negotiate, payments, x402: nothing here is sold through the site;\napp prices are in each project page\'s JSON-LD and come from the store listing',
      'write access of any kind',
    ],
    start: [
      ['Site map for models', URLS.llms],
      ['Every page, one file', URLS.llmsFull],
      ['Sitemap', URLS.sitemap],
      ['RSS', URLS.rss],
      ['MCP server card', URLS.mcpCard],
      ['Agent card', URLS.agentCard],
      ['Agent skills', URLS.skills],
      ['Resource catalogue', URLS.ard],
      ['API catalogue', URLS.apiCatalog],
      ['Markdown', 'send "Accept: text/markdown" to any /wiki, /projects,\n/stacks or /skills page, or append .md to its path'],
    ],
    after: [
      'A separate service on a subdomain does take writes: agent-board, open tasks on',
      'open-source repositories, paid in work and never in money. Its rules are its own:',
      `  ${URLS.boardSkill}`,
    ],
    contact: SITE.contact.email,
  });
}

const MCP_SKILLS = [
  a2aSkill({
    id: 'search', name: 'Search rustman.org',
    description: 'Full-text search across the wiki, projects, stacks and Solo Factory skills. Returns titles, descriptions, excerpts and the URL of each match.',
    tags: ['search', 'wiki', 'projects', 'skills'],
    examples: ['agent harness sensors', 'Air Signal air quality app', 'Claude Code skills for shipping an iOS app'], out: 'application/json',
  }),
  a2aSkill({
    id: 'skill', name: 'Get a Solo Factory skill',
    description: 'The full instructions of a Solo Factory skill (research, scaffold, plan, build, transcribe, video-edit, ...). The main ones are MCP prompts too.',
    tags: ['skills', 'solo-factory', 'workflow'], examples: ['plan', 'scaffold', 'transcribe'],
  }),
  a2aSkill({
    id: 'contact', name: 'Book a call or write to the author',
    description: 'A booking link for a call and a ready mailto to Rustam Salavatov. Books and sends nothing.',
    tags: ['contact', 'meeting', 'calendar', 'email'],
    examples: ['book a call about Solo Factory', 'write to the author about a collaboration'], out: 'text/plain',
  }),
  a2aSkill({
    id: 'read', name: 'Read a page as markdown',
    description: 'Fetch a whole page as markdown, by a URL from search or a bare path such as /wiki/some-slug.',
    tags: ['read', 'markdown'], examples: ['/projects/project-facealarm', `${base}/wiki/harness-engineering`],
  }),
];

/** /.well-known/agent-card.json. There is no A2A endpoint here, so the transport is MCP. */
export function agentCard() {
  return kitAgentCard({
    domain: SITE.domain,
    description:
      `${SITE.title}. Read-only: search and read the notes, projects, stacks and Solo Factory ` +
      `skills published on ${SITE.domain}. Not a conversational agent and no A2A task endpoint: ` +
      `the callable interface is an MCP server (streamable HTTP, stateless, no authentication), ` +
      `described at ${URLS.mcpCard}. Everything is public and may be quoted with a link back.`,
    mcpUrl: URLS.mcp,
    provider: { organization: SITE.author.name, url: `${base}/about/` },
    iconUrl: `${base}/favicon.svg`,
    documentationUrl: URLS.llms,
    skills: MCP_SKILLS,
  });
}

/**
 * ARD manifest, served at /.well-known/ard.json and /.well-known/ai-catalog.json. Only agentic
 * resources: the MCP server, the agent card, and each skill as its own entry. Pages, llms.txt, RSS
 * and the sitemap are not (their media types made Connect.ARLI warn until 28 Oct 2026).
 */
export function ardManifest() {
  return kitArd(SITE.domain, [
    ...ardCoreEntries({
      domain: SITE.domain, mcpCardUrl: URLS.mcpCard, agentCardUrl: URLS.agentCard,
      mcpDescription: 'Search and read every page on the site as markdown. Streamable HTTP, no authentication.',
      mcpQueries: ['search a solo founder\'s notes on building with AI agents', 'read the post on harness engineering as markdown', 'find Claude Code skills for launching a product'],
      capabilities: ['search', 'read'], tags: ['mcp', 'search', 'read-only'],
      cardDescription: 'What an agent can get here and through which interface (MCP; there is no A2A task endpoint).',
      cardQueries: ['what can an agent do on rustman.org', 'how to connect to rustman.org'],
    }),
    ...publishedSkills().map((s) => ({
      id: `skills:${s.slug}`, displayName: s.name, type: SKILL_MD_TYPE, url: s.url, description: s.description,
      extra: { tags: ['skill', 'solo-factory', 'claude-code'], ...(s.source ? { metadata: { source: s.source } } : {}) },
    })),
  ]);
}

/**
 * RFC 9727 API catalogue. Two APIs are real and both are listed: the MCP server here, and
 * agent-board's HTTP API on its subdomain.
 */
export function apiCatalog() {
  return kitApiCatalog(URLS.apiCatalog, [
    { href: URLS.mcp, 'service-desc': [{ href: URLS.mcpCard, type: 'application/json' }], 'service-doc': [{ href: URLS.agentsTxt, type: 'text/plain' }] },
    { href: `${URLS.board}/v1`, 'service-desc': [{ href: URLS.boardOpenApi, type: 'application/json' }], 'service-doc': [{ href: URLS.boardSkill, type: 'text/markdown' }] },
  ]);
}

/** /.well-known/mcp/server-card.json */
export function mcpServerCard() {
  return kitMcpCard({
    domain: SITE.domain, title: SITE.title, websiteUrl: base, mcpUrl: URLS.mcp,
    description: `Search and read the notes, projects, stacks and Solo Factory skills published on ${SITE.domain}. Everything is public and may be quoted with a link back.`,
    tools: [
      { name: 'search', description: 'Full-text search across every page on the site.' },
      { name: 'read', description: 'Fetch a page as markdown rather than HTML.' },
      { name: 'skill', description: 'The full SKILL.md of any Solo Factory skill; the main ones are also prompts.' },
      { name: 'contact', description: 'A booking link for a call and a ready mailto to the author; books and sends nothing.' },
    ],
  });
}
