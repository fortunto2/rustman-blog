import type { APIRoute } from 'astro';
import { SITE } from '../lib/config';
import { getAllContent } from '../lib/content';

export const GET: APIRoute = () => {
  const all = getAllContent().slice(0, 30);

  const items = all.map(entry => {
    const link = `https://${SITE.domain}/${entry.section}/${entry.slug}`;
    const date = entry.frontmatter.created || entry.frontmatter.date || '2026-01-01';
    return `
    <item>
      <title>${escapeXml(entry.frontmatter.title || entry.slug)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(date).toUTCString()}</pubDate>
      <description>${escapeXml(entry.frontmatter.description || '')}</description>
      <category>${entry.section}</category>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.title}</title>
    <link>https://${SITE.domain}</link>
    <description>${SITE.description}</description>
    <language>${SITE.lang}</language>
    <atom:link href="https://${SITE.domain}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
