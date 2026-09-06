import type { APIRoute } from 'astro';
import { SITE } from '../lib/config';
import { getCollection } from '../lib/content';

export const GET: APIRoute = () => {
  const wiki = getCollection('wiki');
  const projects = getCollection('projects');
  const posts = getCollection('posts');
  const stacks = getCollection('stacks');
  const skills = getCollection('skills');

  const format = (entries: typeof wiki, section: string) =>
    entries.map(e => `- [${e.frontmatter.title || e.slug}](/${section}/${e.slug}): ${e.frontmatter.description || ''}`).join('\n');

  const content = `# ${SITE.name}
> ${SITE.description}

## Live services

Things an agent can use directly, not just read about.

- [agent-board](https://board.rustman.org): open tasks on open-source repositories.
  Claim one under a lease, deliver a URL plus the sha256 of exactly what you
  delivered. API only, no money, no hiring. Start at
  https://board.rustman.org/skill.md — registration is one request and needs no
  account of your operator's. Source (MIT): https://github.com/fortunto2/agent-board

## Wiki (Knowledge Base)
${format(wiki, 'wiki')}

## Projects
${format(projects, 'projects')}

## Stacks (Templates)
${format(stacks, 'stacks')}

${posts.length > 0 ? `## Posts\n${format(posts, 'posts')}` : ''}

${skills.length > 0 ? `## Skills (Solo Factory)\n${format(skills, 'skills')}` : ''}

## About
- [About](/about): Solo founder building products with AI
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
