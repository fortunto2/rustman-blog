/**
 * Collect stack templates from solopreneur and wrap them as markdown for rendering.
 * Usage: runs as part of pnpm collect
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const STACKS_DIR = join(import.meta.dirname, '..', '..', '1-methodology', 'stacks');
const OUT_DIR = join(import.meta.dirname, '..', 'src', 'content', 'stacks');

function extractTags(yaml: string, file: string): string[] {
  const tags: string[] = [];
  const get = (key: string) => yaml.match(new RegExp(`^${key}:\\s*(.+)`, 'm'))?.[1]?.trim();

  const platform = get('platform');
  const lang = get('language');
  const framework = get('framework');
  const extends_ = get('extends');

  if (platform) tags.push(...platform.split(/\s*\|\s*|\s*\+\s*/).map(s => s.trim()));
  if (lang) tags.push(lang.replace(/[0-9.]+$/, '')); // python3.13 → python
  if (framework) {
    for (const fw of framework.split(/\s*\|\s*/)) {
      tags.push(fw.replace(/@.*/, '').replace(/\s*\(.*\)/, '').trim()); // nextjs@16.1 → nextjs
    }
  }
  if (extends_) tags.push(extends_.replace('.yaml', ''));

  return [...new Set(tags.filter(t => t && t !== 'none'))];
}

interface Lib {
  name: string;
  url: string;
  stack: string[];
  install: string;
  license: string;
  notes: string;
}

function parseLibraries(yaml: string): Map<string, Lib[]> {
  const categories = new Map<string, Lib[]>();
  // Split into category blocks
  const blocks = yaml.split(/^(?=\w+:\s*$)/m).filter(b => b.trim());

  for (const block of blocks) {
    const catMatch = block.match(/^(\w+):\s*$/m);
    if (!catMatch) continue;
    const category = catMatch[1];
    const libs: Lib[] = [];

    // Split into individual library entries (split removes "- name: " prefix)
    const entries = block.split(/^\s{2}- name:\s*/m).slice(1);
    for (const entry of entries) {
      const firstLine = entry.split('\n')[0].trim();
      const rest = entry.slice(entry.indexOf('\n'));
      const get = (key: string) => {
        const m = rest.match(new RegExp(`^\\s*${key}:\\s*(.+)`, 'm'));
        return m?.[1]?.trim().replace(/^["']|["']$/g, '') || '';
      };
      const stackMatch = rest.match(/stack:\s*\[([^\]]*)\]/);
      const stack = stackMatch ? stackMatch[1].split(',').map(s => s.trim()) : [];

      // Notes can be multiline (> block or plain)
      let notes = '';
      const notesMatch = rest.match(/notes:\s*>?\s*\n([\s\S]*?)(?=\n\s{2}\w|\n\w|$)/);
      if (notesMatch) {
        notes = notesMatch[1].replace(/^\s{6}/gm, '').trim();
      } else {
        notes = get('notes');
      }

      libs.push({
        name: firstLine,
        url: get('url'),
        stack,
        install: get('install'),
        license: get('license'),
        notes,
      });
    }
    if (libs.length) categories.set(category, libs);
  }
  return categories;
}

function formatCategory(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function collectLibraries(yaml: string): string {
  const categories = parseLibraries(yaml);
  const catNames = [...categories.keys()];

  let sections = '';
  for (const [cat, libs] of categories) {
    sections += `## ${formatCategory(cat)}\n\n`;
    sections += '| Library | Stack | Install | License |\n';
    sections += '|---------|-------|---------|--------|\n';
    for (const lib of libs) {
      const nameCell = lib.url ? `[${lib.name}](${lib.url})` : lib.name;
      const stackCell = lib.stack.join(', ');
      const installCell = lib.install ? `\`${lib.install}\`` : '—';
      sections += `| ${nameCell} | ${stackCell} | ${installCell} | ${lib.license} |\n`;
    }
    // Add notes as compact list below table
    const withNotes = libs.filter(l => l.notes);
    if (withNotes.length) {
      sections += '\n';
      for (const lib of withNotes) {
        sections += `**${lib.name}:** ${lib.notes}\n\n`;
      }
    }
    sections += '\n';
  }

  return `---
type: stack
title: "Libraries — curated libs by category"
description: "Curated library reference — data pipelines, federation, actors, event sourcing, voice, OpenAI, canvas."
created: 2026-02-11
tags: [libraries, reference, rust, typescript, python]
publish: true
source_path: "1-methodology/stacks/libraries.yaml"
---

# Libraries

Curated libs for specific product types. Not part of default stacks — pick what fits your product.

**Categories:** ${catNames.map(formatCategory).join(' · ')}

${sections}`;
}

export function collectStacks() {
  if (!existsSync(STACKS_DIR)) return 0;

  if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(STACKS_DIR).filter(f => f.endsWith('.yaml'));
  let count = 0;

  for (const file of files) {
    const yaml = readFileSync(join(STACKS_DIR, file), 'utf-8');
    const slug = file.replace('.yaml', '');

    // libraries.yaml has a different format — handle separately
    if (file === 'libraries.yaml') {
      writeFileSync(join(OUT_DIR, `${slug}.md`), collectLibraries(yaml));
      count++;
      continue;
    }

    const name = yaml.match(/^name:\s*(.+)/m)?.[1]?.trim() || slug;
    const tags = extractTags(yaml, file);
    const platform = yaml.match(/^platform:\s*(.+)/m)?.[1]?.trim() || '';
    const lang = yaml.match(/^language:\s*(.+)/m)?.[1]?.trim() || '';
    const subtitle = [platform, lang].filter(Boolean).join(' | ');

    const md = `---
type: stack
title: "${name}"
description: "${name} stack template${subtitle ? ` — ${subtitle}` : ''}. Copy and use."
created: 2026-02-11
tags: [stack, ${tags.join(', ')}]
publish: true
source_path: "1-methodology/stacks/${file}"
---

# ${name}

${subtitle ? `**Platform:** ${subtitle}\n\n` : ''}\`\`\`yaml
${yaml}\`\`\`
`;
    writeFileSync(join(OUT_DIR, `${slug}.md`), md);
    count++;
  }
  return count;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const n = collectStacks();
  console.log(`Stacks: ${n} collected`);
}
