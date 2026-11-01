/**
 * A 1200x630 social card for every page in src/content/{wiki,projects}: title, description,
 * date, on the site's terminal look. Without one, a link in LinkedIn or Telegram showed the
 * avatar (pages had no og:image at all, 2026-11-01).
 *
 * Writes public/og/<section>/<slug>.png (gitignored; Astro copies it to dist). A card is redrawn
 * only when what it shows changed (hash in public/og/manifest.json): collect rewrites every page
 * on each run, so file times say nothing. Run by `pnpm collect`.
 * Font: JetBrains Mono (SIL OFL 1.1), vendored in scripts/fonts/.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const BLOG = join(import.meta.dirname, '..');
const CONTENT = join(BLOG, 'src', 'content');
const OUT = join(BLOG, 'public', 'og');
const FONTS = [
  { name: 'JetBrains Mono', data: readFileSync(join(import.meta.dirname, 'fonts/JetBrainsMono-Regular.ttf')), weight: 400 as const },
  { name: 'JetBrains Mono', data: readFileSync(join(import.meta.dirname, 'fonts/JetBrainsMono-Bold.ttf')), weight: 700 as const },
];

function field(head: string, key: string): string {
  const v = head.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim() ?? '';
  return v.replace(/^["']|["']$/g, '').replace(/\\"/g, '"');
}

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node =>
  ({ type, props: { style, children } });

function card(title: string, description: string, label: string): Node {
  const size = title.length > 90 ? 44 : title.length > 55 ? 52 : 62;
  return el('div', {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    padding: '64px 72px', background: '#0b0b0c', color: '#f4f4f5', fontFamily: 'JetBrains Mono',
  }, [
    el('div', { display: 'flex', fontSize: 30, color: '#a1a1aa' }, [
      el('span', { color: '#60a5fa', marginRight: 16 }, '>_'),
      el('span', {}, 'rustman.org'),
    ]),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el('div', { fontSize: size, fontWeight: 700, lineHeight: 1.15 }, clip(title, 120)),
      el('div', { fontSize: 26, color: '#a1a1aa', marginTop: 28, lineHeight: 1.4 }, clip(description, 170)),
    ]),
    el('div', { display: 'flex', fontSize: 24, color: '#71717a' }, label),
  ]);
}

async function main() {
  const manifestPath = join(OUT, 'manifest.json');
  const manifest: Record<string, string> = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf-8')) : {};
  let drawn = 0;
  let kept = 0;
  for (const section of ['wiki', 'projects']) {
    const dir = join(CONTENT, section);
    if (!existsSync(dir)) continue;
    mkdirSync(join(OUT, section), { recursive: true });
    for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const src = join(dir, file);
      const dest = join(OUT, section, file.replace(/\.md$/, '.png'));
      const head = readFileSync(src, 'utf-8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      const title = field(head, 'title') || file.replace(/\.md$/, '');
      const date = field(head, 'event_date') || field(head, 'created');
      const label = [section === 'projects' ? 'project' : 'wiki', date].filter(Boolean).join('  ·  ');
      const key = `${section}/${file}`;
      const hash = createHash('sha256').update(`v1|${title}|${field(head, 'description')}|${label}`).digest('hex').slice(0, 16);
      if (existsSync(dest) && manifest[key] === hash) {
        kept++;
        continue;
      }
      manifest[key] = hash;
      const svg = await satori(card(title, field(head, 'description'), label) as never, { width: 1200, height: 630, fonts: FONTS });
      writeFileSync(dest, new Resvg(svg).render().asPng());
      drawn++;
    }
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  console.log(`OG cards: ${drawn} drawn, ${kept} unchanged`);
}

await main();
