import { existsSync } from 'fs';
import { join } from 'path';
import { SITE } from './config';

/** The page's social card from scripts/og-images.ts, or undefined so the layout falls back to the avatar. */
export function ogCard(section: 'wiki' | 'projects', slug: string): string | undefined {
  return existsSync(join(process.cwd(), 'public', 'og', section, `${slug}.png`))
    ? `https://${SITE.domain}/og/${section}/${slug}.png`
    : undefined;
}
