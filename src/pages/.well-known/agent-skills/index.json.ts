/**
 * Agent Skills Discovery index — https://github.com/cloudflare/agent-skills-discovery-rfc
 *
 * This one is published because the skills are real: thirty-odd Solo Factory skills already
 * live in src/content/skills, each with a name, a description of when to use it, and a link
 * to its source. An agent that finds this index can read a skill and follow the workflow.
 *
 * The other well-known files in that RFC family — API catalogue, OAuth metadata, MCP server
 * card — are deliberately NOT published here. This site has no API and no protected resource;
 * an empty catalogue would raise a checker's score and tell an agent something untrue.
 */
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { getCollection } from '../../../lib/content';
import { SITE } from '../../../lib/config';

export const GET: APIRoute = () => {
  const base = `https://${SITE.domain}`;

  const skills = getCollection('skills')
    .filter(entry => entry.frontmatter.publish !== false)
    .map(entry => ({
      name: String(entry.frontmatter.title || entry.slug).replace(/^\//, ''),
      type: 'skill',
      description: String(entry.frontmatter.description || ''),
      // The markdown twin, not the HTML page: this is meant to be read by a machine.
      url: `${base}/skills/${entry.slug}.md`,
      // Over the source, so the digest changes exactly when the skill does.
      sha256: createHash('sha256').update(entry.raw).digest('hex'),
      ...(entry.frontmatter.source_url ? { source: String(entry.frontmatter.source_url) } : {}),
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
