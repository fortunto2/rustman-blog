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
import { llmsFullTxt } from 'superduper-site-kit/agent';

const SECTIONS: { section: Section; heading: string }[] = [
  { section: 'wiki', heading: 'Wiki — knowledge base' },
  { section: 'projects', heading: 'Projects' },
  { section: 'stacks', heading: 'Stacks — templates' },
  { section: 'skills', heading: 'Skills — Solo Factory' },
];

export const GET: APIRoute = () => {
  const base = `https://${SITE.domain}`;
  const groups = SECTIONS.map(({ section, heading }) => ({
    heading,
    docs: getCollection(section)
      .filter(e => e.frontmatter.publish !== false)
      .map(entry => ({
        title: String(entry.frontmatter.title || entry.slug),
        url: `${base}/${section}/${entry.slug}/`,
        description: entry.frontmatter.description ? String(entry.frontmatter.description) : undefined,
        body: parseFrontmatter(entry.raw).content,
      })),
  }));

  return new Response(
    llmsFullTxt({
      title: SITE.title,
      summary: SITE.description,
      preamble: [
        'Every document below is also served on its own at the URL shown, and as markdown at that',
        'URL with `.md` appended. A short index of the same material is at /llms.txt.',
        '',
        'Live service you can use rather than read about: agent-board at',
        'https://board.rustman.org — open tasks on open-source repositories, claimed under a',
        'lease and delivered as a URL plus the sha256 of exactly what was delivered. API only,',
        'no money, no hiring. Start at https://board.rustman.org/skill.md; source (MIT) at',
        'https://github.com/fortunto2/agent-board',
      ],
      groups,
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' } },
  );
};
