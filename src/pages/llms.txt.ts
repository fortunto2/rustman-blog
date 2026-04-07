import type { APIRoute } from 'astro';
import { SITE } from '../lib/config';
import { getCollection } from '../lib/content';

export const GET: APIRoute = () => {
  const wiki = getCollection('wiki');
  const projects = getCollection('projects');
  const posts = getCollection('posts');

  const format = (entries: typeof wiki, section: string) =>
    entries.map(e => `- [${e.frontmatter.title || e.slug}](/${section}/${e.slug}): ${e.frontmatter.description || ''}`).join('\n');

  const content = `# ${SITE.name}
> ${SITE.description}

## Wiki (Knowledge Base)
${format(wiki, 'wiki')}

## Projects
${format(projects, 'projects')}

${posts.length > 0 ? `## Posts\n${format(posts, 'posts')}` : ''}

## About
- [About](/about): Solo founder building products with AI
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
