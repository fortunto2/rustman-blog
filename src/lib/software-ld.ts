/**
 * schema.org SoftwareApplication for a project page — the project stated in machine terms.
 *
 * Driven entirely by frontmatter plus the lookups in stores.ts. The rule for Offers:
 *
 *   app_store_id         → price, currency and version from the App Store listing itself
 *   crate / npm / pypi   → price 0, version from the registry (a published package is free to get)
 *   github, tool/library → price 0 when the repository answers an anonymous request
 *   price + offer_url    → stated by hand, for a product sold off-store (cite it in the page)
 *
 * Nothing else produces an Offer. A web product whose price we cannot source gets the
 * description and no Offer, rather than a guess. A public repository does not make an app or a
 * hosted product free, so the GitHub rule is limited to tools and libraries.
 *
 * Where there is an Offer the node is also typed Product, which is what a shopping or buying
 * agent looks for; schema.org allows a node to carry several types.
 */
import { SITE } from './config';
import { appStoreLookup, githubIsPublic, registryLookup, type Registry } from './stores';

type Fm = Record<string, unknown>;

const IN_STOCK = 'https://schema.org/InStock';

/** App Store genres onto the application categories schema.org and Google recognise. */
const GENRE_CATEGORY: Record<string, string> = {
  'Health & Fitness': 'HealthApplication',
  'Medical': 'HealthApplication',
  'Music': 'MultimediaApplication',
  'Photo & Video': 'MultimediaApplication',
  'Education': 'EducationalApplication',
  'Utilities': 'UtilitiesApplication',
  'Finance': 'FinanceApplication',
  'Developer Tools': 'DeveloperApplication',
  'Games': 'GameApplication',
  'Lifestyle': 'LifestyleApplication',
  'Business': 'BusinessApplication',
  'Productivity': 'BusinessApplication',
  'Travel': 'TravelApplication',
  'Entertainment': 'EntertainmentApplication',
  'Reference': 'ReferenceApplication',
  'Social Networking': 'SocialNetworkingApplication',
  'Graphics & Design': 'DesignApplication',
};

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

function offer(price: number, currency: string, url: string) {
  return {
    '@type': 'Offer',
    price: String(price),
    priceCurrency: currency,
    availability: IN_STOCK,
    url,
  };
}

export async function softwareApplicationLd(fm: Fm, pageUrl: string): Promise<Record<string, unknown> | null> {
  // Titles read "Name — tagline"; the product is the part before the dash.
  const name = str(fm.title).split(' — ')[0].trim();
  if (!name) return null;
  let alternateName = '';

  const projectType = str(fm.project_type);
  const offers: Record<string, unknown>[] = [];
  const sameAs: string[] = [];
  const os: string[] = [];
  let url = '';
  let version = '';
  let category = str(fm.app_category);
  let image = '';
  let rating: Record<string, unknown> | null = null;

  // ── App Store: the listing is the source of the price ──
  const appStoreId = str(fm.app_store_id);
  if (appStoreId) {
    const app = await appStoreLookup(appStoreId);
    if (app?.url) {
      url = app.url;
      if (app.name && app.name.toLowerCase() !== name.toLowerCase()) alternateName = app.name;
      version = app.version;
      image = app.icon;
      category ||= GENRE_CATEGORY[app.genre] || app.genre;
      os.push(app.minimumOsVersion ? `iOS ${app.minimumOsVersion}+` : 'iOS');
      sameAs.push(app.url);
      if (Number.isFinite(app.price) && app.currency) offers.push(offer(app.price, app.currency, app.url));
      if (app.ratingCount > 0) {
        rating = {
          '@type': 'AggregateRating',
          ratingValue: Math.round(app.rating * 10) / 10,
          ratingCount: app.ratingCount,
          bestRating: 5,
          worstRating: 1,
        };
      }
    }
  }

  const playStoreUrl = str(fm.play_store_url);
  if (playStoreUrl) {
    os.push('Android');
    sameAs.push(playStoreUrl);
  }

  // ── Package registries: a published package is free to download ──
  for (const registry of ['crate', 'npm', 'pypi'] as Registry[]) {
    const pkgName = str(fm[registry]);
    if (!pkgName) continue;
    const pkg = await registryLookup(registry, pkgName);
    if (!pkg) continue;
    offers.push(offer(0, 'USD', pkg.url));
    sameAs.push(pkg.url);
    version ||= pkg.version;
    url ||= pkg.url;
  }

  // ── Public source: free for tools and libraries only ──
  const repo = str(fm.github);
  if (repo) {
    const repoUrl = `https://github.com/${repo}`;
    const isPublic = await githubIsPublic(repo);
    if (isPublic) {
      sameAs.push(repoUrl);
      if (offers.length === 0 && (projectType === 'tool' || projectType === 'library')) {
        offers.push(offer(0, 'USD', repoUrl));
        url ||= repoUrl;
      }
    }
  }

  // ── Stated by hand, for something sold off-store ──
  const handPrice = Number(str(fm.price));
  const offerUrl = str(fm.offer_url);
  if (offers.length === 0 && str(fm.price) !== '' && Number.isFinite(handPrice) && offerUrl) {
    offers.push(offer(handPrice, str(fm.price_currency) || 'USD', offerUrl));
    url ||= offerUrl;
  }

  const baseType = appStoreId || playStoreUrl
    ? 'MobileApplication'
    : projectType === 'product' ? 'WebApplication' : 'SoftwareApplication';
  if (!category && (projectType === 'tool' || projectType === 'library')) category = 'DeveloperApplication';

  const free = offers.length > 0 && offers.every(o => o.price === '0');

  return {
    '@context': 'https://schema.org',
    '@type': offers.length > 0 ? [baseType, 'Product'] : baseType,
    '@id': `${pageUrl}#software`,
    name,
    ...(alternateName ? { alternateName } : {}),
    ...(str(fm.description) ? { description: str(fm.description) } : {}),
    url: url || pageUrl,
    mainEntityOfPage: pageUrl,
    ...(image ? { image } : {}),
    ...(category ? { applicationCategory: category } : {}),
    ...(os.length ? { operatingSystem: os.join(', ') } : {}),
    ...(version ? { softwareVersion: version } : {}),
    ...(sameAs.length ? { sameAs: [...new Set(sameAs)] } : {}),
    author: { '@type': 'Person', name: SITE.author.name, url: SITE.social.github },
    ...(rating ? { aggregateRating: rating } : {}),
    ...(offers.length === 1 ? { offers: offers[0] } : offers.length > 1 ? { offers } : {}),
    ...(free ? { isAccessibleForFree: true } : {}),
  };
}
