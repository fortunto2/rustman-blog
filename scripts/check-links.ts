/**
 * Check for broken wikilinks — links to pages that aren't published.
 * Usage: pnpm links
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const WIKI_DIR = join(import.meta.dirname, '..', '..', 'wiki');

const files = readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'index.md');

// Collect published slugs
const published = new Set<string>();
for (const file of files) {
  const text = readFileSync(join(WIKI_DIR, file), 'utf-8');
  if (text.includes('publish: true')) {
    published.add(file.replace('.md', ''));
  }
}

// Find broken links in published pages
let broken = 0;
for (const file of files) {
  const text = readFileSync(join(WIKI_DIR, file), 'utf-8');
  if (!text.includes('publish: true')) continue;

  const links = [...text.matchAll(/\[\[([^\]|]+)/g)].map(m => m[1].toLowerCase().trim().replace(/\s+/g, '-'));

  for (const slug of links) {
    if (!published.has(slug)) {
      console.log(`  ${file} → [[${slug}]] (not published)`);
      broken++;
    }
  }
}

if (broken === 0) {
  console.log('No broken wikilinks');
} else {
  console.log(`\n${broken} broken link(s)`);
  process.exit(1);
}
