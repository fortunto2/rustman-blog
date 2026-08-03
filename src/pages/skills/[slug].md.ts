// Markdown twin of /skills/[slug] — see src/lib/markdown-twin.ts for why it exists.
import { twinRoutes } from '../../lib/markdown-twin';

export const { getStaticPaths, GET } = twinRoutes('skills');
