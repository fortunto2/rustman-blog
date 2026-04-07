/**
 * Collect content from solopreneur wiki for blog publication.
 * Reads wiki/*.md, filters by `publish: true`, copies to src/content/{type}/.
 *
 * Usage: pnpm collect
 *
 * Content type mapping:
 *   - publish_as: article | project | note (explicit)
 *   - type: summary | concept → articles (default)
 *   - type: hub → skip (navigation pages, not content)
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join, basename } from 'path';

const WIKI_DIR = join(import.meta.dirname, '..', '..', '..', 'solopreneur', 'wiki');
const CONTENT_DIR = join(import.meta.dirname, '..', 'src', 'content');

function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm: Record<string, unknown> = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
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

function getContentType(fm: Record<string, unknown>): string | null {
  // Explicit publish_as takes priority
  if (fm.publish_as) return fm.publish_as as string;

  // Type-based mapping
  const type = fm.type as string;
  if (type === 'hub') return null; // Skip hub pages
  if (type === 'summary' || type === 'concept') return 'articles';

  return 'articles'; // default
}

function main() {
  if (!existsSync(WIKI_DIR)) {
    console.error(`Wiki directory not found: ${WIKI_DIR}`);
    process.exit(1);
  }

  // Clean content dirs
  for (const dir of ['articles', 'projects', 'notes']) {
    const path = join(CONTENT_DIR, dir);
    if (existsSync(path)) rmSync(path, { recursive: true });
    mkdirSync(path, { recursive: true });
  }

  const files = readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));
  let collected = 0;
  let skipped = 0;

  for (const file of files) {
    if (file === 'index.md') continue;

    const raw = readFileSync(join(WIKI_DIR, file), 'utf-8');
    const fm = parseFrontmatter(raw);

    if (!fm.publish) {
      skipped++;
      continue;
    }

    const contentType = getContentType(fm);
    if (!contentType) {
      skipped++;
      continue;
    }

    const dest = join(CONTENT_DIR, contentType === 'articles' ? 'articles' : contentType === 'projects' ? 'projects' : 'notes', file);
    writeFileSync(dest, raw);
    collected++;
    console.log(`  ${contentType}/${file}`);
  }

  console.log(`\nCollected: ${collected} | Skipped: ${skipped} | Total: ${files.length}`);
}

main();
