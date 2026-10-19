/**
 * Latest releases of the creative tools, read from GitHub at build time. Facts only (version,
 * date, link): the plugin releases carry no notes, and a human paragraph about a release is a
 * `kind: release` note, written on purpose. If GitHub is unreachable the block is just absent —
 * a build must never fail on it.
 */
export interface Release {
  tool: string;
  tag: string;
  name: string;
  date: string;
  url: string;
}

const SOURCES = [
  { tool: 'SuperDuper DSP', repo: 'fortunto2/superduper-dsp', tagPrefix: 'v' },
  { tool: 'Life2Film Studio', repo: 'fortunto2/life2film-landing', tagPrefix: 'desktop-v' },
];

export async function latestReleases(perTool = 3): Promise<Release[]> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const lists = await Promise.all(SOURCES.map(async src => {
    try {
      const res = await fetch(`https://api.github.com/repos/${src.repo}/releases?per_page=20`, { headers });
      if (!res.ok) return [];
      const data = (await res.json()) as {
        tag_name: string; name: string | null; published_at: string | null;
        html_url: string; draft: boolean; assets: unknown[];
      }[];
      return data
        // A release without files is a failed build, not something to download.
        .filter(r => !r.draft && r.published_at && r.tag_name.startsWith(src.tagPrefix) && r.assets.length > 0)
        .slice(0, perTool)
        .map(r => ({
          tool: src.tool,
          tag: r.tag_name,
          name: r.name || r.tag_name,
          date: r.published_at!.slice(0, 10),
          url: r.html_url,
        }));
    } catch {
      return [];
    }
  }));
  return lists.flat().sort((a, b) => b.date.localeCompare(a.date));
}
