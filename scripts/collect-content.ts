/**
 * Collect content from solopreneur wiki + raw sources for blog publication.
 * Reads wiki/*.md and raw source dirs, filters by `publish: true`, routes to correct section.
 *
 * Usage: pnpm collect
 *
 * Routing: one kind of page, one URL space. `type: project` → src/content/projects/ (a product,
 * with its own schema.org data); every other page → src/content/wiki/. Where a page is LISTED
 * is a view, not a route: `feed: true` puts it on the homepage and in the feed,
 * `audience: creative` on /creative/. Neither changes its URL, so a page never moves.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync, realpathSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = join(import.meta.dirname, '..', '..');
const WIKI_DIR = join(ROOT_DIR, 'wiki');
// ~/startups/wiki is a symlink into solopreneur/; the raw dirs sit next to the real wiki, not next to the link.
// Where the wiki is absent (a clean CI checkout) there is nothing to resolve; main() reports it.
const KB_DIR = existsSync(WIKI_DIR) ? join(realpathSync(WIKI_DIR), '..') : ROOT_DIR;
const CONTENT_DIR = join(import.meta.dirname, '..', 'src', 'content');

// Raw source directories to scan for publish: true
const RAW_DIRS = [
  '0-principles',
  '1-methodology',
  '2-inspiration',
];

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val: string | boolean | string[] = line.slice(idx + 1).trim();

    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    }
    if (val === 'true') val = true;
    if (val === 'false') val = false;

    fm[key] = val;
  }
  return fm;
}

function getSection(fm: Record<string, unknown>, file: string): string {
  if (fm.publish_as !== undefined) {
    // AI-NOTE: publish_as was retired 2026-11-01 (type/feed/audience replace it); fail loudly, not route silently.
    throw new Error(`${file}: publish_as is retired, use type: project, feed: true or audience: creative`);
  }
  return fm.type === 'project' ? 'projects' : 'wiki';
}

function main() {
  if (!existsSync(WIKI_DIR)) {
    console.error(`Wiki directory not found: ${WIKI_DIR}`);
    process.exit(1);
  }

  // posts/, creative/, articles/, notes/ are sections that no longer exist; clear them too.
  for (const dir of ['wiki', 'projects', 'posts', 'creative', 'articles', 'notes']) {
    const path = join(CONTENT_DIR, dir);
    if (existsSync(path)) rmSync(path, { recursive: true });
  }
  for (const dir of ['wiki', 'projects']) mkdirSync(join(CONTENT_DIR, dir), { recursive: true });

  let collected = 0;
  let skipped = 0;
  let total = 0;

  // Collect from wiki/
  const wikiFiles = readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  for (const file of wikiFiles) {
    if (file === 'index.md') continue;
    total++;

    const raw = readFileSync(join(WIKI_DIR, file), 'utf-8');
    const fm = parseFrontmatter(raw);

    if (!fm.publish) {
      skipped++;
      continue;
    }

    const section = getSection(fm, file);
    const dest = join(CONTENT_DIR, section, file);
    writeFileSync(dest, raw);
    collected++;
    console.log(`  ${section}/${file}`);
  }

  // Collect from raw source directories
  for (const dir of RAW_DIRS) {
    const dirPath = join(KB_DIR, dir);
    if (!existsSync(dirPath)) continue;

    const files = readdirSync(dirPath).filter(f => f.endsWith('.md'));
    for (const file of files) {
      total++;
      const raw = readFileSync(join(dirPath, file), 'utf-8');
      const fm = parseFrontmatter(raw);

      if (!fm.publish) {
        skipped++;
        continue;
      }

      const section = getSection(fm, file);
      const dest = join(CONTENT_DIR, section, file);
      writeFileSync(dest, raw);
      collected++;
      console.log(`  ${section}/${file} (from ${dir}/)`);
    }
  }

  console.log(`\nCollected: ${collected} | Skipped: ${skipped} | Total: ${total}`);
}

// Also collect stacks
import { collectStacks } from './collect-stacks.ts';
const stackCount = collectStacks();
if (stackCount > 0) console.log(`Stacks: ${stackCount} collected`);

main();
