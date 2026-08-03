/**
 * The whole corpus in one file, which is the companion to llms.txt: that one is a map, this
 * one is the territory. An agent answering a question about this site can fetch this once
 * instead of crawling two hundred pages.
 *
 * Frontmatter is stripped and each document is introduced by its canonical URL, so anything
 * quoted from here can be cited back to the page it came from.
 */
import type { APIRoute } from 'astro';
import { getCollection, type Section } from '../lib/content';
import { parseFrontmatter } from '../lib/md';
import { SITE } from '../lib/config';

const SECTIONS: { section: Section; heading: string }[] = [
  { section: 'wiki', heading: 'Wiki — knowledge base' },
  { section: 'projects', heading: 'Projects' },
  { section: 'stacks', heading: 'Stacks — templates' },
  { section: 'posts', heading: 'Posts' },
  { section: 'skills', heading: 'Skills — Solo Factory' },
];

export const GET: APIRoute = () => {
  const base = `https://${SITE.domain}`;
  const out: string[] = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.description}`,
    '',
    'Every document below is also served on its own at the URL shown, and as markdown at that',
    'URL with `.md` appended. A short index of the same material is at /llms.txt.',
    '',
  ];

  for (const { section, heading } of SECTIONS) {
    const entries = getCollection(section).filter(e => e.frontmatter.publish !== false);
    if (entries.length === 0) continue;

    out.push(`\n${'='.repeat(70)}\n## ${heading}\n`);
    for (const entry of entries) {
      const { content } = parseFrontmatter(entry.raw);
      const title = String(entry.frontmatter.title || entry.slug);
      out.push(`\n### ${title}`);
      out.push(`Source: ${base}/${section}/${entry.slug}`);
      if (entry.frontmatter.description) out.push(`\n${String(entry.frontmatter.description)}`);
      out.push('', content.trim(), '');
    }
  }

  return new Response(out.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
