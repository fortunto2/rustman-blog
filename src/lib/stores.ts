/**
 * Build-time lookups against the places a project is actually distributed from.
 *
 * Everything the structured data says about price, version or availability comes from here,
 * never from prose: the App Store listing for apps, the package registry for libraries, the
 * public repository for tools. A lookup that fails returns null and the caller states nothing,
 * because a missing Offer is honest and an invented one is not.
 *
 * Results are memoised per build: the App Store card and the JSON-LD on the same page, and the
 * projects index, all ask for the same listing.
 */

const TIMEOUT_MS = 15000; // the npm registry takes 5-6 s from here on a normal day
const UA = 'rustman.org build (https://rustman.org)';

const cache = new Map<string, Promise<unknown>>();

function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) cache.set(key, load().catch(() => null));
  return cache.get(key) as Promise<T>;
}

async function getJson(url: string): Promise<any | null> {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  return res.ok ? res.json() : null;
}

export interface AppStoreListing {
  name: string;
  developer: string;
  icon: string;
  rating: number;
  ratingCount: number;
  /** As the store prints it, e.g. "Free". */
  formattedPrice: string;
  price: number;
  currency: string;
  genre: string;
  version: string;
  minimumOsVersion: string;
  screenshots: string[];
  url: string;
}

/** The iTunes lookup API: the listing as the store publishes it, for one country. */
export function appStoreLookup(appId: string, country = 'us'): Promise<AppStoreListing | null> {
  return once(`appstore:${country}:${appId}`, async () => {
    const data = await getJson(`https://itunes.apple.com/lookup?id=${appId}&country=${country}`);
    const d = data?.resultCount > 0 ? data.results[0] : null;
    if (!d) return null;
    return {
      name: d.trackName,
      developer: d.artistName,
      icon: d.artworkUrl512,
      rating: d.averageUserRating || 0,
      ratingCount: d.userRatingCount || 0,
      formattedPrice: d.formattedPrice,
      price: typeof d.price === 'number' ? d.price : NaN,
      currency: d.currency || '',
      genre: d.primaryGenreName || '',
      version: d.version || '',
      minimumOsVersion: d.minimumOsVersion || '',
      screenshots: d.screenshotUrls || [],
      url: d.trackViewUrl?.replace('?uo=4', '') || '',
    };
  });
}

export type Registry = 'crate' | 'npm' | 'pypi';

export interface Package {
  registry: Registry;
  name: string;
  version: string;
  /** The package's public page, which is where an agent would go to get it. */
  url: string;
}

/** Latest published version from crates.io, npm or PyPI; null if the package is not there. */
export function registryLookup(registry: Registry, name: string): Promise<Package | null> {
  return once(`${registry}:${name}`, async () => {
    if (registry === 'crate') {
      const d = await getJson(`https://crates.io/api/v1/crates/${encodeURIComponent(name)}`);
      const version = d?.crate?.max_stable_version || d?.crate?.newest_version;
      return version ? { registry, name, version, url: `https://crates.io/crates/${name}` } : null;
    }
    if (registry === 'npm') {
      const d = await getJson(`https://registry.npmjs.org/${encodeURIComponent(name)}/latest`);
      return d?.version ? { registry, name, version: d.version, url: `https://www.npmjs.com/package/${name}` } : null;
    }
    const d = await getJson(`https://pypi.org/pypi/${encodeURIComponent(name)}/json`);
    return d?.info?.version ? { registry, name, version: d.info.version, url: `https://pypi.org/project/${name}/` } : null;
  });
}

/**
 * Whether a GitHub repository can be read without an account. A private repository answers
 * 404 to an anonymous request, so a 200 here is the evidence that the code costs nothing to get.
 */
export function githubIsPublic(repo: string): Promise<boolean> {
  return once(`github:${repo}`, async () => {
    const res = await fetch(`https://github.com/${repo}`, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return res.ok;
  }).then(Boolean);
}
