import type { APIRoute } from 'astro';
import { SITE } from '../lib/config';
import { getAllPosts } from '../lib/content';

export const GET: APIRoute = () => {
  const posts = getAllPosts();

  const lines = posts.map(post => {
    const title = post.frontmatter.title || post.slug;
    const path = `/${post.type}/${post.slug}`;
    const desc = post.frontmatter.description || '';
    return `- [${title}](${path}): ${desc}`;
  }).join('\n');

  const content = `# ${SITE.name}
> ${SITE.description}

## Articles & Notes
${lines}

## About
- [About](/about): Solo founder building products with AI
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
