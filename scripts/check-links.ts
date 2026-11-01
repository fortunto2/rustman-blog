/**
 * Check wikilinks in published pages. A link to a page that does not exist fails. A link to a
 * page that exists but is not published (a held draft) is listed and passes: md.ts renders it
 * as plain text, so the reader never meets a 404.
 * Handles both routes (wiki, and projects for type: project).
 * Usage: pnpm links
 */

import { readFileSync, readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import { mapOutsideCode } from '../src/lib/md.ts';

const WIKI_DIR = join(import.meta.dirname, '..', '..', 'wiki');

const entries = readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'index.md');

// Resolve symlinks and read files
function readWikiFile(filename: string): string {
  const filepath = join(WIKI_DIR, filename);
  return readFileSync(filepath, 'utf-8');
}

// Collect all published slugs (whichever route they take)
// Frontmatter only: a page whose body quotes "publish: true" is not published.
const isPublished = (text: string) => /^publish:\s*true\s*$/m.test(text.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '');
const published = new Set<string>();
const existing = new Set(entries.map(f => f.replace('.md', '')));
for (const file of entries) {
  if (isPublished(readWikiFile(file))) published.add(file.replace('.md', ''));
}

// Find broken links in published pages
let broken = 0;
let held = 0;
for (const file of entries) {
  const text = readWikiFile(file);
  if (!isPublished(text)) continue;

  // Match [[slug]] and [[slug|label]], strip trailing backslashes from escaped brackets.
  // Only outside code, the same rule the renderer follows.
  const prose: string[] = [];
  mapOutsideCode(text, part => (prose.push(part), part));
  const links = [...prose.join('\n').matchAll(/\[\[([^\]|\\]+)/g)].map(m =>
    m[1].toLowerCase().trim().replace(/\s+/g, '-').replace(/\\$/, '')
  );

  for (const slug of links) {
    if (slug && published.has(slug)) continue;
    if (slug && existing.has(slug)) {
      console.log(`  ${file} → [[${slug}]] (not published yet: shown as text)`);
      held++;
    } else {
      console.log(`  ${file} → [[${slug}]] (NO SUCH PAGE)`);
      broken++;
    }
  }
}

if (broken === 0) {
  console.log(`No broken wikilinks${held ? ` (${held} to unpublished pages, shown as text)` : ''}`);
} else {
  console.log(`\n${broken} broken link(s)`);
  process.exit(1);
}
