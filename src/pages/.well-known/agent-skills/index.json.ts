/**
 * Agent Skills Discovery index — https://github.com/cloudflare/agent-skills-discovery-rfc
 *
 * This one is published because the skills are real: thirty-odd Solo Factory skills already
 * live in src/content/skills, each with a name, a description of when to use it, and a link
 * to its source. An agent that finds this index can read a skill and follow the workflow.
 *
 * The rest of the well-known set is published where something real stands behind it: the MCP
 * server card and the API catalogue (the MCP server at /mcp is a callable API). OAuth metadata
 * is not: nothing here is protected, and an empty file would tell an agent something untrue.
 */
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { SITE } from '../../../lib/config';
import { publishedSkills } from '../../../lib/agent-discovery';

export const GET: APIRoute = () => {
  const base = `https://${SITE.domain}`;

  const skills = publishedSkills().map(s => ({
    name: s.name,
    type: 'skill',
    description: s.description,
    url: s.url,
    // Over the source, so the digest changes exactly when the skill does.
    sha256: createHash('sha256').update(s.raw).digest('hex'),
    ...(s.source ? { source: s.source } : {}),
  }));

  const body = {
    $schema: 'https://agentskills.io/schemas/discovery/v0.2.0.json',
    version: '0.2.0',
    publisher: { name: SITE.author.name, url: base },
    skills,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
