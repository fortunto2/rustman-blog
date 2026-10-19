/**
 * The tools a /creative note can end on. One registry, so an install line or a link is fixed in
 * one place and every note that names the tool in `tools:` picks it up.
 */
export interface Tool {
  name: string;
  what: string;
  /** One command or one plain step a non-programmer can copy. */
  install: string;
  links: { label: string; href: string }[];
  /** Site page with the technical story. */
  page?: string;
}

export const TOOLS: Record<string, Tool> = {
  'superduper-dsp': {
    name: 'SuperDuper DSP',
    what: '31 free plugins: synths, a kubyz, drums, a sampler, effects. CLAP, VST3 and AU for macOS and Windows.',
    install: 'Download the zip from the latest release, put the .clap files in ~/Library/Audio/Plug-Ins/CLAP/, rescan in your DAW.',
    links: [
      { label: 'Download', href: 'https://github.com/fortunto2/superduper-dsp/releases/latest' },
      { label: 'Music kit for Claude', href: '/downloads/music-kit.zip' },
      { label: 'Source', href: 'https://github.com/fortunto2/superduper-dsp' },
    ],
    page: '/projects/project-superduper-dsp',
  },
  'life2film-studio': {
    name: 'Life2Film Studio',
    what: 'Free desktop app that turns a day of footage into a film: analysis, beat-cut montage, subtitles, publishing. Apple Silicon.',
    install: 'brew install --cask fortunto2/tap/life2film-studio',
    links: [
      { label: 'Download', href: 'https://github.com/fortunto2/life2film-landing/releases/latest' },
      { label: 'life2film.com', href: 'https://life2film.com' },
    ],
    page: '/projects/project-life2film',
  },
  'life2film-engine': {
    name: 'life2film-engine',
    what: 'The analysis core as WebAssembly: beats, shot boundaries, frame quality. For building into your own code.',
    install: 'npm i life2film-engine',
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/life2film-engine' },
      { label: 'Try it in the browser', href: 'https://life2film.com/tools/' },
    ],
    page: '/projects/project-life2film',
  },
  kubizbeat: {
    name: 'KubizBeat',
    what: 'The Bashkir kubyz (jaw harp) as a phone instrument. The same sound engine is the Kubyz plugin.',
    install: 'Get it from the product page.',
    links: [{ label: 'Product page', href: 'https://superduperai.co/product/jaw-harp-synth' }],
    page: '/projects/project-kubizbeat',
  },
};

export function toolsFor(keys: unknown): Tool[] {
  if (!Array.isArray(keys)) return [];
  return keys.map(k => TOOLS[String(k)]).filter((t): t is Tool => Boolean(t));
}
