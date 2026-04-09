/**
 * Collect skills from solo-factory and generate markdown pages.
 * Reads SKILL.md frontmatter (name, description) + extracts phase from routing.
 * Usage: runs as part of pnpm collect
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

const SKILLS_DIR = join(import.meta.dirname, '..', '..', 'solo-factory', 'skills');
const OUT_DIR = join(import.meta.dirname, '..', 'src', 'content', 'skills');

const PHASES: Record<string, string[]> = {
  analysis: ['research', 'swarm', 'validate', 'stream', 'sgr', 'you2idea-extract'],
  development: ['scaffold', 'setup', 'plan', 'build', 'deploy', 'review'],
  promotion: ['launch', 'landing-gen', 'content-gen', 'video-promo', 'community-outreach', 'reddit', 'github-outreach', 'seo-audit', 'metrics-track', 'legal', 'humanize'],
  utility: ['init', 'factory', 'pipeline', 'retro', 'audit', 'memory-audit', 'skill-audit', 'index-youtube'],
};

function getPhase(skillName: string): string {
  for (const [phase, skills] of Object.entries(PHASES)) {
    if (skills.includes(skillName)) return phase;
  }
  return 'utility';
}

function getOrder(skillName: string): number {
  for (const skills of Object.values(PHASES)) {
    const idx = skills.indexOf(skillName);
    if (idx !== -1) return idx + 1;
  }
  return 99;
}

function extractDescription(content: string): string {
  // Get description from frontmatter
  const match = content.match(/^description:\s*(.+)/m);
  if (!match) return '';
  let desc = match[1].trim();
  // Strip outer quotes
  desc = desc.replace(/^["']|["']$/g, '');
  // Clean: take after last comma-separated trigger phrase before "or need/or ..."
  // Pattern: Use when "x", "y", "z", or need something. Do NOT...
  const doNot = desc.indexOf('Do NOT');
  if (doNot > 0) desc = desc.slice(0, doNot).trim();
  // Remove "Use when" + all quoted trigger phrases
  desc = desc.replace(/^Use when\s+/, '');
  // Remove all "quoted phrases", patterns
  desc = desc.replace(/"[^"]*",?\s*/g, '');
  // Clean leftover "or " at start
  desc = desc.replace(/^or\s+/, '');
  // Remove trailing comma/period
  desc = desc.replace(/[,.]$/, '').trim();
  // Capitalize first letter
  if (desc) desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  return desc || 'Solo Factory skill';
}

function main() {
  if (!existsSync(SKILLS_DIR)) {
    console.log('  Skills: solo-factory not found, skipping');
    return;
  }

  // Clean output
  if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  let count = 0;
  for (const name of dirs) {
    const skillFile = join(SKILLS_DIR, name, 'SKILL.md');
    if (!existsSync(skillFile)) continue;

    const raw = readFileSync(skillFile, 'utf-8');
    const description = extractDescription(raw);
    const phase = getPhase(name);
    const order = getOrder(name);

    // Extract body after second ---
    const parts = raw.split('---');
    const body = parts.length >= 3 ? parts.slice(2).join('---').trim() : '';

    // Extract first paragraph as human-readable summary (before first ##)
    const firstSection = body.split(/^##/m)[0].trim();
    const summary = firstSection.replace(/^#[^\n]*\n+/, '').split('\n\n')[0].trim();

    const ghUrl = `https://github.com/fortunto2/solo-factory/tree/main/skills/${name}`;

    // Render as code block (like stacks) so agent instructions are readable
    const md = `---
title: "/${name}"
description: "${description.replace(/"/g, '\\"')}"
created: 2026-04-09
tags: [skill, ${phase}, solo-factory]
phase: "${phase}"
phase_order: ${order}
publish: true
source_url: "${ghUrl}"
---

${summary ? summary + '\n\n' : ''}\`\`\`\`markdown
${body}
\`\`\`\`
`;

    writeFileSync(join(OUT_DIR, `${name}.md`), md);
    count++;
  }

  console.log(`  Skills: ${count} collected`);
}

main();
