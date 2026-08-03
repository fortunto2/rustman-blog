/**
 * Markdown for agents, done without leaving the static site.
 *
 * The build already emits a markdown twin beside every page — /wiki/foo.md next to /wiki/foo.
 * This middleware makes the twin answer the ordinary URL when the caller asks for markdown,
 * so an agent needs to know nothing about the `.md` convention: it sends
 * `Accept: text/markdown` and gets markdown, while a browser sending `Accept: text/html` gets
 * the page. One URL, two representations, which is what content negotiation is for.
 *
 * Cloudflare offers this as a paid feature. This is fifteen lines and no plan change.
 *
 * `Vary: Accept` is not optional here: without it a cache would hand one representation to the
 * other audience, and a visitor would be served raw markdown because an agent asked first.
 */

const MARKDOWN = "text/markdown";

/** Only when markdown is asked for explicitly. `*​/*` is what curl sends, and means "anything". */
function wantsMarkdown(accept: string | null): boolean {
  return accept !== null && accept.toLowerCase().includes(MARKDOWN);
}

/**
 * The sections whose pages are built from a markdown file and therefore have a twin. Anything
 * else — the home page, /about, the section indexes — is a template with no markdown source,
 * and redirecting those to a .md that was never generated would answer 404 for a page that
 * exists. Better to hand back the HTML.
 */
// The slug must contain no dot, which is what keeps /wiki/foo.md from matching and being
// redirected to /wiki/foo.md.md — an infinite loop, since curl and every agent resend the
// same Accept header while following. Fifty hops before anything complained.
const TWINNED = /^\/(wiki|posts|projects|stacks|skills)\/([^/.]+)\/?$/;

/** /wiki/foo and /wiki/foo/ → /wiki/foo.md. Everything else → null. */
function twinPath(pathname: string): string | null {
  const match = TWINNED.exec(pathname);
  return match === null ? null : `/${match[1]}/${match[2]}.md`;
}

export const onRequest: PagesFunction = async (context) => {
  const { request, next } = context;
  const url = new URL(request.url);

  // HEAD must answer with the same headers GET would, or a client that probes with HEAD is
  // told the page is HTML and never asks for the markdown that is there.
  const readOnly = request.method === "GET" || request.method === "HEAD";
  const path = readOnly && wantsMarkdown(request.headers.get("accept"))
    ? twinPath(url.pathname)
    : null;

  if (path === null) {
    const original = await next();
    const response = new Response(original.body, original);
    response.headers.append("Vary", "Accept");
    return response;
  }

  // A 302 to the twin rather than proxying it. Proxying needs either a second next() — which
  // is single-use and returned a stale 404 for every index page — or a fetch back into the
  // same zone, which proved unreliable. A redirect has neither failure mode, costs the agent
  // one hop, and leaves the twin cacheable on its own URL.
  //
  // If the twin does not exist the redirect lands on a 404, which is the honest answer for
  // "there is no markdown of this page"; the Link header still points at /llms-full.txt.
  return new Response(null, {
    status: 302,
    headers: {
      Location: path,
      Vary: "Accept",
      // Says which URL this is a representation of, so a citation points at the page.
      "Content-Location": url.pathname,
    },
  });
};
