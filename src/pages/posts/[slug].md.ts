// Markdown twin of /posts/[slug] — see src/lib/markdown-twin.ts for why it exists.
import { twinRoutes } from '../../lib/markdown-twin';

export const { getStaticPaths, GET } = twinRoutes('posts');
