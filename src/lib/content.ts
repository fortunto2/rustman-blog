import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { parseFrontmatter, type Frontmatter } from './md';

export type Section = 'wiki' | 'projects' | 'posts' | 'stacks';

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
