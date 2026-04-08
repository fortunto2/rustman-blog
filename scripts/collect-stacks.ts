/**
 * Collect stack templates from solopreneur and wrap them as markdown for rendering.
 * Usage: runs as part of pnpm collect
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const STACKS_DIR = join(import.meta.dirname, '..', '..', '1-methodology', 'stacks');
const OUT_DIR = join(import.meta.dirname, '..', 'src', 'content', 'stacks');

export function collectStacks() {
  if (!existsSync(STACKS_DIR)) return 0;

  if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(STACKS_DIR).filter(f => f.endsWith('.yaml'));
  let count = 0;

  for (const file of files) {
    const yaml = readFileSync(join(STACKS_DIR, file), 'utf-8');
    const name = yaml.match(/^name:\s*(.+)/m)?.[1]?.trim() || file.replace('.yaml', '');
    const platform = yaml.match(/^platform:\s*(.+)/m)?.[1]?.trim() || '';
    const lang = yaml.match(/^language:\s*(.+)/m)?.[1]?.trim() || '';
    const slug = file.replace('.yaml', '');

    const md = `---
type: stack
title: "${name}"
description: "${name} stack template — ${platform} ${lang}. Copy and use."
created: 2026-02-11
tags: [stack, ${platform}, ${lang}, template]
publish: true
source_path: "1-methodology/stacks/${file}"
---

# ${name}

**Platform:** ${platform} | **Language:** ${lang}

\`\`\`yaml
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
