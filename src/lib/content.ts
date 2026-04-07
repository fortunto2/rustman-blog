import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { parseFrontmatter, type Frontmatter } from './md';

export interface ContentEntry {
  slug: string;
  frontmatter: Frontmatter;
  raw: string;
}

const CONTENT_DIR = join(process.cwd(), 'src', 'content');

export function getCollection(type: 'articles' | 'projects' | 'notes'): ContentEntry[] {
  const dir = join(CONTENT_DIR, type);
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(file => {
        const raw = readFileSync(join(dir, file), 'utf-8');
        const { frontmatter } = parseFrontmatter(raw);
        return {
          slug: file.replace('.md', ''),
          frontmatter,
          raw,
        };
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

export function getAllPosts(): (ContentEntry & { type: string })[] {
  const articles = getCollection('articles').map(e => ({ ...e, type: 'articles' }));
  const projects = getCollection('projects').map(e => ({ ...e, type: 'projects' }));
  const notes = getCollection('notes').map(e => ({ ...e, type: 'notes' }));
  return [...articles, ...projects, ...notes].sort((a, b) => {
    const dateA = a.frontmatter.created || a.frontmatter.date || '';
    const dateB = b.frontmatter.created || b.frontmatter.date || '';
    return dateB.localeCompare(dateA);
  });
}
