/**
 * SuperDuperAI products are described once, in superduper-site-kit's registry. A project page here
 * keeps the story of building the product, but its name, one-liner, status, store link and the
 * link to its home come from the registry, so this site cannot drift from the product's own page
 * (it did: Live2play was "party games" here while the app is a reel camera, fixed 2 Nov 2026).
 *
 * A project matches a registry product by its App Store id, or by `source_url` being the
 * product's own site. The product's home carries its SoftwareApplication JSON-LD; a project page
 * here only refers to it by @id (superduperai-site docs/ecosystem.md, step 6).
 */
import { PERSON_ID } from 'superduper-site-kit/company';
import { getProducts, homeUrl, privacyUrl, supportUrl, type Product } from 'superduper-site-kit/registry';

export type { Product };
export { homeUrl, privacyUrl, supportUrl };

const appId = (p: Product) => p.links.app_store?.match(/id(\d+)/)?.[1];
const origin = (u: unknown) => {
  try { return typeof u === 'string' ? new URL(u).hostname.replace(/^www\./, '') : ''; } catch { return ''; }
};

export function productFor(fm: Record<string, unknown>): Product | undefined {
  const id = typeof fm.app_store_id === 'string' ? fm.app_store_id : '';
  const host = origin(fm.source_url);
  return getProducts().find(p =>
    (id && appId(p) === id) || (host && p.own_site && origin(p.own_site.url) === host));
}

/** JSON-LD for a project page about a registry product: the page is about the app, which lives at its home. */
export function projectLd(p: Product, pageUrl: string, title: string) {
  const home = homeUrl(p);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl,
    name: title,
    about: { '@id': `${home}#app`, name: p.name, url: home },
    author: { '@id': PERSON_ID },
  };
}
