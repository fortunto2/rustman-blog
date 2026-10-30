import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync, existsSync } from 'node:fs';

/**
 * lastmod for each content page: `updated` from its frontmatter, else `created` or `date` — the
 * same rule as dateModified in the page's JSON-LD (src/lib/md.ts modifiedDate). Pages without a
 * date get no lastmod rather than the build date, which would claim a change that did not happen.
 * visayes.app follows the same convention with its specification check dates.
 */
const SECTIONS = ['wiki', 'posts', 'projects', 'creative', 'skills', 'stacks'];
const modified = new Map();
for (const section of SECTIONS) {
  const dir = `./src/content/${section}`;
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const fm = readFileSync(`${dir}/${file}`, 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
    const field = (k) => fm.match(new RegExp(`^${k}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})`, 'm'))?.[1];
    const date = field('updated') || field('created') || field('date');
    if (date) modified.set(`https://rustman.org/${section}/${file.replace(/\.md$/, '')}/`, date);
  }
}

export default defineConfig({
  site: 'https://rustman.org',
  output: 'static',
  integrations: [
    sitemap({
      serialize(item) {
        const date = modified.get(item.url);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
