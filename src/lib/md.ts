import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { existsSync } from 'fs';
import { join } from 'path';

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

// ```youtube blocks: one video per line, "<url or id> | caption". A shorts URL (or "short" after the
// id) renders 9:16. youtube-nocookie and lazy loading: no player, no cookies until scrolled to.
function renderYouTube(content: string): string {
  const esc = md.utils.escapeHtml;
  return content.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const [ref, caption = ''] = line.split('|').map(s => s.trim());
    const id = ref.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1]
      ?? ref.match(/^([\w-]{11})(?:\s|$)/)?.[1];
    if (!id) return '';
    const vertical = /\/shorts\/|\sshort$/.test(ref);
    const ratio = vertical ? 'aspect-ratio: 9 / 16; max-width: 360px;' : 'aspect-ratio: 16 / 9;';
    return `<figure class="yt-embed not-prose" style="margin: 1.5rem 0;">
<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(caption || 'Video')}" style="${ratio} width: 100%; border: 0; border-radius: 8px;" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
${caption ? `<figcaption style="font-size: 0.875rem; color: var(--color-muted); margin-top: 0.5rem;">${esc(caption)}</figcaption>` : ''}
</figure>`;
  }).join('\n') + '\n';
}

// ```ab blocks: one line per take, "A: url | label". Rendered as a player that keeps one playhead
// across takes, so a switch compares the same moment — the only A/B that tells you anything.
const defaultFence = md.renderer.rules.fence!;
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  if (token.info.trim() === 'youtube') return renderYouTube(token.content);
  if (token.info.trim() !== 'ab') return defaultFence(tokens, idx, options, env, self);
  const takes = token.content.split('\n')
    .map(line => line.match(/^\s*([^:\s]+)\s*:\s*(\S+)\s*(?:\|\s*(.+))?$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map(([, key, src, label]) => ({ key, src, label: (label ?? '').trim() }));
  const esc = md.utils.escapeHtml;
  const buttons = takes.map((t, i) =>
    `<button type="button" class="ab-take" data-i="${i}" aria-pressed="${i === 0}"><b>${esc(t.key)}</b> ${esc(t.label)}</button>`).join('');
  const audios = takes.map(t => `<audio preload="metadata" src="${esc(t.src)}"></audio>`).join('');
  return `<div class="ab-player not-prose" data-ab>
<div class="ab-takes">${buttons}</div>
<div class="ab-transport"><button type="button" class="ab-play" aria-label="Play">▶</button><input class="ab-seek" type="range" min="0" max="1000" value="0" aria-label="Position"><span class="ab-time">0:00</span></div>
${audios}</div>\n`;
};

export interface Frontmatter {
  title?: string;
  description?: string;
  created?: string;
  date?: string;
  tags?: string[];
  type?: string;
  publish?: boolean;
  publish_as?: 'article' | 'project' | 'note' | 'post' | 'creative';
  kind?: 'guide' | 'recipe' | 'note' | 'release';
  tools?: string[];
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

// A wikilink names a page, not a section: collect-content routes it by publish_as,
// so look up where it actually landed. Unknown slugs keep the old /wiki/ guess.
const LINK_SECTIONS = ['wiki', 'projects', 'posts', 'creative'];

function sectionOf(slug: string): string {
  const dir = join(process.cwd(), 'src', 'content');
  return LINK_SECTIONS.find(s => existsSync(join(dir, s, `${slug}.md`))) ?? 'wiki';
}

export function processWikilinks(content: string): string {
  return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, slug, label) => {
    const display = label || slug;
    const s = slug.toLowerCase().replace(/\s+/g, '-');
    return `[${display}](/${sectionOf(s)}/${s})`;
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
