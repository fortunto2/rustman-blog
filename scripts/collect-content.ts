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

// The contract lives in one file, shared with the pre-commit gate (scripts/wiki_frontmatter.py).
// Here only what decides routing and listing is enforced: a page that breaks it is not published.
const SCHEMA = JSON.parse(readFileSync(join(WIKI_DIR, '_frontmatter.json'), 'utf-8')) as {
  retired: Record<string, string>;
  enums: Record<string, string[]>;
  booleans: string[];
};

function violations(fm: Record<string, unknown>, raw: string): string[] {
  const errs: string[] = [];
  for (const [key, why] of Object.entries(SCHEMA.retired)) {
    if (fm[key] !== undefined) errs.push(`${key}: ${why}`);
  }
  const head = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  for (const key of SCHEMA.booleans) {
    // parseFrontmatter strips quotes, so `feed: "true"` would pass here and fail in promo (a string there).
    const m = head.match(new RegExp(`^${key}:\\s*(.*?)\\s*(#.*)?$`, 'm'));
    if (m && !['true', 'false'].includes(m[1])) errs.push(`${key}: must be a bare true/false, got ${m[1]}`);
  }
  for (const [key, allowed] of Object.entries(SCHEMA.enums)) {
    if (fm[key] !== undefined && !allowed.includes(String(fm[key]))) errs.push(`${key}: ${fm[key]} not in ${allowed.join('|')}`);
  }
  return errs;
}

type Page = { file: string; from: string; raw: string; section: string };

function main() {
  if (!existsSync(WIKI_DIR)) {
    console.error(`Wiki directory not found: ${WIKI_DIR}`);
    process.exit(1);
  }

  // Read and check everything first, write nothing until all of it passes. The old order
  // (clear, then route file by file) left half the content behind when one page failed,
  // and `pnpm build` then shipped that half with exit 0 (2026-11-01).
  const pages: Page[] = [];
  const errors: string[] = [];
  let skipped = 0;
  let total = 0;
  const sources: { dir: string; label: string; files: string[] }[] = [
    { dir: WIKI_DIR, label: 'wiki', files: readdirSync(WIKI_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_') && f !== 'index.md') },
    ...RAW_DIRS.map(d => join(KB_DIR, d)).filter(existsSync).map(dir => ({
      dir, label: dir.split('/').pop()!, files: readdirSync(dir).filter(f => f.endsWith('.md')),
    })),
  ];
  for (const { dir, label, files } of sources) {
    for (const file of files) {
      total++;
      const raw = readFileSync(join(dir, file), 'utf-8');
      const fm = parseFrontmatter(raw);
      if (!fm.publish) {
        skipped++;
        continue;
      }
      for (const e of violations(fm, raw)) errors.push(`${label}/${file}: ${e}`);
      pages.push({ file, from: label, raw, section: fm.type === 'project' ? 'projects' : 'wiki' });
    }
  }
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    console.error(`\n${errors.length} violation(s); nothing was written. Contract: wiki/_frontmatter.json`);
    process.exit(1);
  }

  // posts/, creative/, articles/, notes/ are sections that no longer exist; clear them too.
  for (const dir of ['wiki', 'projects', 'posts', 'creative', 'articles', 'notes']) {
    const path = join(CONTENT_DIR, dir);
    if (existsSync(path)) rmSync(path, { recursive: true });
  }
  for (const dir of ['wiki', 'projects']) mkdirSync(join(CONTENT_DIR, dir), { recursive: true });

  for (const { file, from, raw, section } of pages) {
    // wiki/_facts.yaml markers keep a number tied to its source in the wiki; a reader
    // of the site (HTML, markdown negotiation, llms-full.txt) gets the bare number
    const clean = raw.replace(/<!--\/?fact(:[a-z0-9_.]+)?-->/g, '');
    writeFileSync(join(CONTENT_DIR, section, file), clean);
    console.log(`  ${section}/${file}${from === 'wiki' ? '' : ` (from ${from}/)`}`);
  }
  console.log(`\nCollected: ${pages.length} | Skipped: ${skipped} | Total: ${total}`);
}

// Also collect stacks
import { collectStacks } from './collect-stacks.ts';
const stackCount = collectStacks();
if (stackCount > 0) console.log(`Stacks: ${stackCount} collected`);

main();
