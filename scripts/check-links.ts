/**
 * Check for broken wikilinks — links to pages that aren't published.
 * Handles all publish_as routes (wiki, project, post).
 * Usage: pnpm links
 */

import { readFileSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';

const WIKI_DIR = join(import.meta.dirname, '..', '..', 'wiki');

const entries = readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'index.md');

// Resolve symlinks and read files
function readWikiFile(filename: string): string {
  const filepath = join(WIKI_DIR, filename);
  return readFileSync(filepath, 'utf-8');
}

// Collect all published slugs (regardless of publish_as route)
const published = new Set<string>();
for (const file of entries) {
  const text = readWikiFile(file);
  if (text.includes('publish: true')) {
    published.add(file.replace('.md', ''));
  }
}

// Find broken links in published pages
let broken = 0;
for (const file of entries) {
  const text = readWikiFile(file);
  if (!text.includes('publish: true')) continue;

  // Match [[slug]] and [[slug|label]], strip trailing backslashes from escaped brackets
  const links = [...text.matchAll(/\[\[([^\]|\\]+)/g)].map(m =>
    m[1].toLowerCase().trim().replace(/\s+/g, '-').replace(/\\$/, '')
  );

  for (const slug of links) {
    if (!slug || !published.has(slug)) {
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
