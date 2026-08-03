/**
 * A markdown twin for every page: /wiki/foo also exists at /wiki/foo.md.
 *
 * An agent asked to read this site otherwise downloads a page of layout, navigation and
 * Tailwind classes to reach a few hundred words. The twin is the source it was written from —
 * no parsing, no guessing which div holds the article, and a fraction of the tokens.
 *
 * The frontmatter is rewritten rather than passed through: the source carries build-time keys
 * that mean nothing to a reader, and it lacks the one thing a reader needs, which is the
 * canonical URL of the page this came from.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type Section } from './content';
import { parseFrontmatter } from './md';
import { SITE } from './config';

/** Keys worth keeping in the twin. Everything else is machinery for the templates. */
const PUBLIC_KEYS = ['title', 'description', 'created', 'date', 'updated', 'tags', 'source_url'];

export function twinRoutes(section: Section): { getStaticPaths: GetStaticPaths; GET: APIRoute } {
  const getStaticPaths: GetStaticPaths = () =>
    getCollection(section).map(entry => ({
      params: { slug: entry.slug },
      props: { entry },
    }));

  const GET: APIRoute = ({ props }) => {
    const { entry } = props as { entry: ReturnType<typeof getCollection>[number] };
    const { content } = parseFrontmatter(entry.raw);
    const fm = entry.frontmatter as Record<string, unknown>;

    const lines: string[] = ['---'];
    lines.push(`url: https://${SITE.domain}/${section}/${entry.slug}`);
    for (const key of PUBLIC_KEYS) {
      const value = fm[key];
      if (value === undefined || value === null || value === '') continue;
      lines.push(`${key}: ${Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}`);
    }
    lines.push('---', '');

    return new Response(`${lines.join('\n')}\n${content.trim()}\n`, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  };

  return { getStaticPaths, GET };
}
