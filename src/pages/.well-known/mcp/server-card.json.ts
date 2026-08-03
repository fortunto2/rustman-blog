/**
 * MCP Server Card — how an agent discovers the server at /mcp without being told about it.
 *
 * Published because the server behind it is real. The neighbouring well-known files in the
 * same family — API catalogue, OAuth metadata — stay absent: this site has no API and nothing
 * to authenticate against, and publishing empty ones would raise a checker's score while
 * telling an agent something untrue.
 */
import type { APIRoute } from 'astro';
import { SITE } from '../../../lib/config';

export const GET: APIRoute = () => {
  const base = `https://${SITE.domain}`;

  const card = {
    $schema: 'https://modelcontextprotocol.io/schemas/2025-11-25/server-card.json',
    serverInfo: {
      name: SITE.domain,
      title: SITE.title,
      version: '1.0.0',
      description:
        'Search and read the notes, projects, stacks and Solo Factory skills published on ' +
        `${SITE.domain}. Everything is public and may be quoted with a link back.`,
      websiteUrl: base,
    },
    // Streamable HTTP, stateless: POST returns application/json and no stream is opened.
    remotes: [{ type: 'streamable-http', url: `${base}/mcp` }],
    capabilities: { tools: { listChanged: false } },
    // Listed here too so an agent can decide whether to connect before it does.
    tools: [
      { name: 'search', description: 'Full-text search across every page on the site.' },
      { name: 'read', description: 'Fetch a page as markdown rather than HTML.' },
    ],
    // No key, no account, nothing to rate-limit against a login.
    authentication: { type: 'none' },
  };

  return new Response(JSON.stringify(card, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
