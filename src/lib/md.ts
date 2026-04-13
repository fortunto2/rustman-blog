import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str: string, lang: string): string {
    // Mermaid diagrams — render client-side, not as code
    if (lang === 'mermaid') {
      return `<pre class="mermaid">${str}</pre>`;
    }
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch { /* fallback below */ }
    }
    return `<pre><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export interface Frontmatter {
  title?: string;
  description?: string;
  created?: string;
  date?: string;
  tags?: string[];
  type?: string;
  publish?: boolean;
  publish_as?: 'article' | 'project' | 'note';
  source_path?: string;
  source_url?: string | string[];
  cover?: string;
  status?: string;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  html: string;
  hasH1: boolean;
}

export function parseFrontmatter(raw: string): { frontmatter: Frontmatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, content: raw };

  const fm: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val: unknown = line.slice(idx + 1).trim();

    // Strip quotes
    if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    }

    // Parse arrays: [tag1, tag2]
    if (typeof val === 'string' && val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    }

    // Parse booleans
    if (val === 'true') val = true;
    if (val === 'false') val = false;

    fm[key] = val;
  }

  return { frontmatter: fm as Frontmatter, content: match[2] };
}

export function processWikilinks(content: string): string {
  return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, slug, label) => {
    const display = label || slug;
    const href = `/wiki/${slug.toLowerCase().replace(/\s+/g, '-')}`;
    return `[${display}](${href})`;
  });
}

export function renderMarkdown(raw: string): Post & { slug: string } {
  const { frontmatter, content } = parseFrontmatter(raw);
  const processed = processWikilinks(content);
  const html = md.render(processed);
  const hasH1 = /^\s*#\s+/.test(content.trim());

  return {
    slug: '',
    frontmatter,
    content: processed,
    html,
    hasH1,
  };
}
