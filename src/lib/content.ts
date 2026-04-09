import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { parseFrontmatter, type Frontmatter } from './md';

export type Section = 'wiki' | 'projects' | 'posts' | 'stacks' | 'skills';

export interface ContentEntry {
  slug: string;
  frontmatter: Frontmatter;
  raw: string;
}

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

export function getCollection(section: Section): ContentEntry[] {
  const dir = join(CONTENT_DIR, section);
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(file => {
        const raw = readFileSync(join(dir, file), 'utf-8');
        const { frontmatter } = parseFrontmatter(raw);
        return { slug: file.replace('.md', ''), frontmatter, raw };
      })
      .sort((a, b) => {
        const dateA = a.frontmatter.created || a.frontmatter.date || '';
        const dateB = b.frontmatter.created || b.frontmatter.date || '';
        return dateB.localeCompare(dateA);
      });
  } catch {
    return [];
  }
}

export function getAllContent(): (ContentEntry & { section: Section })[] {
  const wiki = getCollection('wiki').map(e => ({ ...e, section: 'wiki' as Section }));
  const projects = getCollection('projects').map(e => ({ ...e, section: 'projects' as Section }));
  const posts = getCollection('posts').map(e => ({ ...e, section: 'posts' as Section }));
  return [...wiki, ...projects, ...posts].sort((a, b) => {
    const dateA = a.frontmatter.created || a.frontmatter.date || '';
    const dateB = b.frontmatter.created || b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });
}

export function getAllTags(): Map<string, (ContentEntry & { section: Section })[]> {
  const stacks = getCollection('stacks').map(e => ({ ...e, section: 'stacks' as Section }));
  const skills = getCollection('skills').map(e => ({ ...e, section: 'skills' as Section }));
  const all = [...getAllContent(), ...stacks, ...skills];
  const tags = new Map<string, (ContentEntry & { section: Section })[]>();
  for (const entry of all) {
    const t = entry.frontmatter.tags;
    if (!t || typeof t === 'string') continue;
    for (const tag of t) {
      if (!tags.has(tag)) tags.set(tag, []);
      tags.get(tag)!.push(entry);
    }
  }
  return tags;
}
