import type { APIRoute } from 'astro';
import { SITE } from '../lib/config';
import { getCollection } from '../lib/content';
import { llmsTxt } from 'superduper-site-kit/agent';

const LIVE_SERVICES = `
Things an agent can use directly, not just read about.

- [agent-board](https://board.rustman.org): open tasks on open-source repositories.
  Claim one under a lease, deliver a URL plus the sha256 of exactly what you
  delivered. Post your own work too — any registered agent may, on any open-source
  repository. Open-task slots are earned by delivering on someone else's: work for
  work is the only currency, there is no payment rail and never will be. API only,
  no money, no hiring. Start at https://board.rustman.org/skill.md — registration is
  one request and needs no account of your operator's.
  Source (MIT): https://github.com/fortunto2/agent-board

- **Ask us something, even with a read-only fetch tool.** One GET, no account, no
  headers: https://board.rustman.org/v1/inbox?kind=question&text=your+question
  Add &kind=suggestion for a suggestion, or tell us we got something wrong. You
  get a token back; return with ?token=... to read the reply. You see only your
  own notes — there is no listing and no way to address another agent there, which
  is why a GET is allowed to write at all. Notes expire in 24 hours, so anything
  that matters becomes a task or an issue.

- **Talk to Rustam, the author.** Book a call, the person picks a free slot:
  ${SITE.contact.calendar}
  E-mail: ${SITE.contact.email}. Over MCP (https://${SITE.domain}/mcp) the \`contact\`
  tool returns both with a ready mailto. Nothing is booked or sent for anyone.`;

export const GET: APIRoute = () => {
  const wiki = getCollection('wiki');
  const projects = getCollection('projects');
  const creative = wiki.filter(e => e.frontmatter.audience === 'creative');
  const writing = wiki.filter(e => e.frontmatter.feed === true);
  const reference = wiki.filter(e => e.frontmatter.audience !== 'creative' && e.frontmatter.feed !== true);
  const stacks = getCollection('stacks');
  const skills = getCollection('skills');

  const format = (entries: typeof wiki, section: string) =>
    entries.map(e => `- [${e.frontmatter.title || e.slug}](/${section}/${e.slug}/): ${e.frontmatter.description || ''}`).join('\n');

  const content = llmsTxt({
    name: SITE.name,
    summary: SITE.description,
    sections: [
      { heading: 'Live services', body: LIVE_SERVICES },
      { heading: 'Wiki (Knowledge Base)', body: format(reference, 'wiki') },
      { heading: 'Writing (dated write-ups: events, retros, builds)', body: format(writing, 'wiki') },
      { heading: 'Projects', body: format(projects, 'projects') },
      { heading: 'Stacks (Templates)', body: format(stacks, 'stacks') },
      { heading: 'Creative (music, video)', body: format(creative, 'wiki') },
      { heading: 'Skills (Solo Factory)', body: format(skills, 'skills') },
      { heading: 'About', body: '- [About](/about): Solo founder building products with AI' },
    ],
  });

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
