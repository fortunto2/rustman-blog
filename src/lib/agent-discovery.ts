/**
 * The machine-facing description of this site, in the formats agents look for.
 *
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

/** Same words as robots.txt; change both or neither. */
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=no';

/** agents.txt and /.well-known/ai.txt: what an agent may ask for here, and where to start. */
export function agentPolicyText(): string {
  return `# ${SITE.domain} — policy for automated agents
#
# A personal build-in-public site: notes, projects, stacks and Solo Factory skills by
# ${SITE.author.name}. Static, public, read-only. Nothing here needs an account.
# The same policy is in robots.txt as a Content-Signal; this file says it in words.

User-agent: *
Content-Signal: ${CONTENT_SIGNAL}
Allow: /

# You may
#   - read, index and link to every page                      (search=yes)
#   - quote it when answering someone, with a link to the page (ai-input=yes)
#   - call the MCP server at ${URLS.mcp} (tools: search, read), no key needed
#
# Please do not
#   - fold the content into a training corpus                  (ai-train=no)
#
# Not offered here, so do not look for it
#   - accounts, sign-in or OAuth: nothing on ${SITE.domain} is protected
#   - orders, prices to negotiate, payments, x402: nothing here is sold through the site;
#     app prices are in each project page's JSON-LD and come from the store listing
#   - write access of any kind
#
# Start here
#   Site map for models   ${URLS.llms}
#   Every page, one file  ${URLS.llmsFull}
#   Sitemap               ${URLS.sitemap}
#   RSS                   ${URLS.rss}
#   MCP server card       ${URLS.mcpCard}
#   Agent card            ${URLS.agentCard}
#   Agent skills          ${URLS.skills}
#   Resource catalogue    ${URLS.ard}
#   API catalogue         ${URLS.apiCatalog}
#   Markdown              send "Accept: text/markdown" to any /wiki, /projects, /posts,
#                         /stacks or /skills page, or append .md to its path
#
# A separate service on a subdomain does take writes: agent-board, open tasks on
# open-source repositories, paid in work and never in money. Its rules are its own:
#   ${URLS.boardSkill}
#
# Contact: ${SITE.contact.email}
`;
}

const MCP_SKILLS = [
  {
    id: 'search',
    name: 'Search rustman.org',
    description:
      'Full-text search across the wiki, projects, stacks, posts and Solo Factory skills. ' +
      'Returns titles, descriptions, excerpts and the URL of each match.',
    tags: ['search', 'wiki', 'projects', 'posts', 'skills'],
    examples: ['agent harness sensors', 'Air Signal air quality app', 'Claude Code skills for shipping an iOS app'],
    inputModes: ['application/json'],
    outputModes: ['application/json'],
  },
  {
    id: 'skill',
    name: 'Get a Solo Factory skill',
    description: 'The full instructions of a Solo Factory skill (research, scaffold, plan, build, transcribe, video-edit, ...). The main ones are MCP prompts too.',
    tags: ['skills', 'solo-factory', 'workflow'],
    examples: ['plan', 'scaffold', 'transcribe'],
    inputModes: ['application/json'],
    outputModes: ['text/markdown'],
  },
  {
    id: 'contact',
    name: 'Book a call or write to the author',
    description: 'A booking link for a call and a ready mailto to Rustam Salavatov. Books and sends nothing.',
    tags: ['contact', 'meeting', 'calendar', 'email'],
    examples: ['book a call about Solo Factory', 'write to the author about a collaboration'],
    inputModes: ['application/json'],
    outputModes: ['text/plain'],
  },
  {
    id: 'read',
    name: 'Read a page as markdown',
    description: 'Fetch a whole page as markdown, by a URL from search or a bare path such as /wiki/some-slug.',
    tags: ['read', 'markdown'],
    examples: ['/projects/project-facealarm', `${base}/posts/harness-engineering`],
    inputModes: ['application/json'],
    outputModes: ['text/markdown'],
  },
];

/**
 * /.well-known/agent-card.json, in the A2A AgentCard shape. There is no A2A endpoint here, so
 * the card does not pretend: its transport is MCP, and an A2A-only client reading it can see
 * that it has nothing to send a task to.
 */
export function agentCard() {
  return {
    protocolVersion: '0.3.0',
    name: SITE.domain,
    description:
      `${SITE.title}. Read-only: search and read the notes, projects, stacks and Solo Factory ` +
      `skills published on ${SITE.domain}. Not a conversational agent and no A2A task endpoint: ` +
      `the callable interface is an MCP server (streamable HTTP, stateless, no authentication), ` +
      `described at ${URLS.mcpCard}. Everything is public and may be quoted with a link back.`,
    url: URLS.mcp,
    preferredTransport: 'MCP',
    version: '1.0.0',
    provider: { organization: SITE.author.name, url: `${base}/about/` },
    iconUrl: `${base}/favicon.svg`,
    documentationUrl: URLS.llms,
    capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
    defaultInputModes: ['application/json'],
    defaultOutputModes: ['application/json', 'text/markdown'],
    skills: MCP_SKILLS,
    supportsAuthenticatedExtendedCard: false,
  };
}

/** ARD's media type for an Agent Skill written in markdown (spec v0.91 §3.3). */
const SKILL_MD_TYPE = 'text/markdown; profile="urn:air:agent-skills"';

/**
 * Agentic Resource Discovery manifest (https://agenticresourcediscovery.org/spec/, v0.91).
 * Served at /.well-known/ard.json, the current path, and at /.well-known/ai-catalog.json,
 * the predecessor path that older consumers and checkers still ask for.
 *
 * Only agentic resources go in: the MCP server, the agent card, and each skill as its own
 * entry, so a registry can match one skill to a query. Pages, llms.txt, RSS and the sitemap
 * are not agentic resources; agents.txt and the Link headers point at those instead. Their
 * media types (text/html, application/rss+xml) are also unknown to ARD parsers, which made
 * Connect.ARLI warn on this file until 28 Oct 2026.
 */
export function ardManifest() {
  const entry = (
    id: string,
    displayName: string,
    type: string,
    url: string,
    description: string,
    representativeQueries: string[],
    extra: Record<string, unknown> = {},
  ) => ({
    '@context': 'https://agenticresourcediscovery.org/context/v1',
    identifier: `urn:air:${SITE.domain}:${id}`,
    displayName,
    type,
    url,
    description,
    // SHOULD, not MUST: omitted rather than invented when there is no real query to give.
    ...(representativeQueries.length ? { representativeQueries } : {}),
    ...extra,
  });

  return {
    entries: [
      entry('mcp', `${SITE.domain} MCP server`, 'application/mcp-server-card+json', URLS.mcpCard,
        'Search and read every page on the site as markdown. Streamable HTTP, no authentication.',
        ['search a solo founder\'s notes on building with AI agents', 'read the post on harness engineering as markdown', 'find Claude Code skills for launching a product'],
        { capabilities: ['search', 'read'], tags: ['mcp', 'search', 'read-only'] }),
      entry('agent-card', `${SITE.domain} agent card`, 'application/agent-card+json', URLS.agentCard,
        'What an agent can get here and through which interface (MCP; there is no A2A task endpoint).',
        ['what can an agent do on rustman.org', 'how to connect to rustman.org'],
        { capabilities: ['search', 'read'] }),
      ...publishedSkills().map(s =>
        entry(`skills:${s.slug}`, s.name, SKILL_MD_TYPE, s.url, s.description, [],
          { tags: ['skill', 'solo-factory', 'claude-code'], ...(s.source ? { metadata: { source: s.source } } : {}) })),
    ],
  };
}

/**
 * RFC 9727 API catalogue, as an RFC 9264 linkset. Two APIs are real and both are listed:
 * the MCP server here, and agent-board's HTTP API on its subdomain.
 */
export function apiCatalog() {
  return {
    linkset: [
      {
        anchor: URLS.apiCatalog,
        item: [{ href: URLS.mcp }, { href: `${URLS.board}/v1` }],
      },
      {
        anchor: URLS.mcp,
        'service-desc': [{ href: URLS.mcpCard, type: 'application/json' }],
        'service-doc': [{ href: URLS.agentsTxt, type: 'text/plain' }],
      },
      {
        anchor: `${URLS.board}/v1`,
        'service-desc': [{ href: URLS.boardOpenApi, type: 'application/json' }],
        'service-doc': [{ href: URLS.boardSkill, type: 'text/markdown' }],
      },
    ],
  };
}

export const json = (body: unknown, type = 'application/json; charset=utf-8') =>
  new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' },
  });

export const text = (body: string) =>
  new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
