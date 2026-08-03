/**
 * A small search index for the MCP server. Not for the site's own search — that is Pagefind,
 * whose index format is built to be fetched in slices by a browser and is awkward to query
 * from a Worker.
 *
 * Deliberately excerpted rather than complete: an agent's `search` call should be cheap and
 * return candidates, and `read` then fetches the one document it wants in full from its
 * markdown twin. Shipping all 870 KB of prose on every search would make the cheap call the
 * expensive one.
 */
import type { APIRoute } from 'astro';
import { getCollection, type Section } from '../lib/content';
import { parseFrontmatter } from '../lib/md';
import { SITE } from '../lib/config';

const SECTIONS: Section[] = ['wiki', 'projects', 'stacks', 'posts', 'skills'];

/** Enough to rank on and to show a snippet; the twin has the rest. */
const EXCERPT_CHARS = 600;

export const GET: APIRoute = () => {
  const base = `https://${SITE.domain}`;

  const documents = SECTIONS.flatMap(section =>
    getCollection(section)
      .filter(entry => entry.frontmatter.publish !== false)
      .map(entry => {
        const { content } = parseFrontmatter(entry.raw);
        const plain = content
          .replace(/```[\s\S]*?```/g, ' ')
          .replace(/[#*_>`\[\]()]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        return {
          section,
          slug: entry.slug,
          url: `${base}/${section}/${entry.slug}`,
          markdown: `${base}/${section}/${entry.slug}.md`,
          title: String(entry.frontmatter.title || entry.slug),
          description: String(entry.frontmatter.description || ''),
          tags: Array.isArray(entry.frontmatter.tags) ? entry.frontmatter.tags.map(String) : [],
          excerpt: plain.slice(0, EXCERPT_CHARS),
        };
      }),
  );

  return new Response(JSON.stringify({ site: base, count: documents.length, documents }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
