/**
 * Markdown for agents, done without leaving the static site. The build emits a markdown twin
 * beside every page (/wiki/foo.md next to /wiki/foo); this makes the twin answer the ordinary URL
 * when the caller sends `Accept: text/markdown`. The logic is superduper-site-kit/agent-edge, shared
 * with the other sites; this file is only the site's mapping.
 *
 * 302 to the twin rather than proxying: a second next() is single-use and returned a stale 404 for
 * every index page, and a fetch back into the same zone proved unreliable. The home page has no
 * markdown source; its honest markdown form is llms.txt.
 *
 * The slug may contain no dot (see sectionTwins): that is what keeps /wiki/foo.md from being
 * redirected to /wiki/foo.md.md, which looped fifty hops before anything complained.
 */
import { markdownNegotiation } from "superduper-site-kit/agent-edge";
import { sectionTwins } from "superduper-site-kit/agent";

export const onRequest = markdownNegotiation({
  mode: "redirect",
  home: "/llms.txt",
  twinPath: sectionTwins(["wiki", "posts", "projects", "creative", "stacks", "skills"]),
});
