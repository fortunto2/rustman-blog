/**
 * A remote MCP server for this site, at POST /mcp.
 *
 * WHY THIS AND NOT WebMCP
 *
 * WebMCP is Chrome-only behind an origin trial, its API moved from `navigator` to `document`,
 * and `provideContext()` — the method every guide still tells you to call — was removed from
 * the spec in March 2026. A remote MCP server works today, in Claude and ChatGPT and anything
 * else that speaks the protocol, and it is not tied to one browser.
 *
 * WHAT IT EXPOSES
 *
 * Two tools, both backed by things the site already has rather than invented for a checklist:
 *   search — over an excerpt index built at build time (/search-index.json)
 *   read   — the markdown twin of any page, which exists for all 155 of them
 *
 * TRANSPORT
 *
 * Streamable HTTP, stateless, answering `application/json`. The spec allows a plain JSON
 * response to a request instead of opening an SSE stream, and with no session state there is
 * nothing a stream would carry. Notifications get 202 with no body, as required.
 *
 * Protocol version is echoed from the client when it is one we know, because a client that
 * negotiated 2025-06-18 must not be answered in a later dialect. Absent header defaults to
 * 2025-03-26, which is what the spec says to assume.
 */

const SUPPORTED_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];
const LATEST = SUPPORTED_VERSIONS[0];
const SERVER = { name: "rustman.org", title: "rustman — build in public", version: "1.0.0" };

type Doc = {
  section: string;
  slug: string;
  url: string;
  markdown: string;
  title: string;
  description: string;
  tags: string[];
  excerpt: string;
};

type JsonRpc = { jsonrpc: string; id?: unknown; method?: string; params?: Record<string, unknown> };

const TOOLS = [
  {
    name: "search",
    title: "Search rustman.org",
    description:
      "Full-text search across the wiki, projects, stacks, posts and Solo Factory skills on " +
      "rustman.org. Returns titles, descriptions and excerpts with the URL of each match. Use " +
      "`read` afterwards to get a whole document.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Words to look for. Matched against title, description, tags and body." },
        section: {
          type: "string",
          enum: ["wiki", "projects", "stacks", "posts", "skills"],
          description: "Optional: restrict to one section.",
        },
        limit: { type: "integer", minimum: 1, maximum: 25, description: "How many results (default 8)." },
      },
      required: ["query"],
    },
  },
  {
    name: "read",
    title: "Read a page as markdown",
    description:
      "Fetch a full page from rustman.org as markdown rather than HTML. Accepts either a URL " +
      "returned by `search` or a bare path such as /wiki/some-slug.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "A rustman.org page URL or path." },
      },
      required: ["url"],
    },
  },
];

const json = (body: unknown, status = 200, version = LATEST): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "MCP-Protocol-Version": version,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type, mcp-protocol-version, mcp-session-id",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });

const rpcError = (id: unknown, code: number, message: string, version = LATEST): Response =>
  json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, 200, version);

/** Text content is what every client renders; structured output is optional and not all read it. */
const toolText = (id: unknown, text: string, version: string, isError = false): Response =>
  json({ jsonrpc: "2.0", id, result: { content: [{ type: "text", text }], isError } }, 200, version);

function scoreDoc(doc: Doc, terms: string[]): number {
  const title = doc.title.toLowerCase();
  const description = doc.description.toLowerCase();
  const tags = doc.tags.join(" ").toLowerCase();
  const body = doc.excerpt.toLowerCase();

  let score = 0;
  for (const term of terms) {
    // Weighted by where the word appears: a title match is a much stronger signal than a
    // mention halfway down the body, and a tag was chosen deliberately by the author.
    if (title.includes(term)) score += 10;
    if (tags.includes(term)) score += 6;
    if (description.includes(term)) score += 4;
    if (body.includes(term)) score += 1;
  }
  // Every term present beats one term present many times.
  const matched = terms.filter(
    t => title.includes(t) || tags.includes(t) || description.includes(t) || body.includes(t),
  ).length;
  return matched === terms.length ? score * 2 : score;
}

async function loadIndex(env: { ASSETS: Fetcher }, origin: string): Promise<Doc[]> {
  const response = await env.ASSETS.fetch(new Request(`${origin}/search-index.json`));
  if (!response.ok) return [];
  const body = (await response.json()) as { documents?: Doc[] };
  return body.documents ?? [];
}

export const onRequest: PagesFunction<{ ASSETS: Fetcher }> = async ({ request, env }) => {
  if (request.method === "OPTIONS") return json({}, 204);

  // A GET here would be the SSE stream a stateful server opens. This one has no session state,
  // so there is nothing to stream and saying so is better than a silent empty stream.
  if (request.method !== "POST") {
    return json({ error: "This MCP endpoint is POST-only; it is stateless and opens no stream." }, 405);
  }

  const asked = request.headers.get("mcp-protocol-version");
  const version = asked === null ? "2025-03-26" : asked;
  if (!SUPPORTED_VERSIONS.includes(version)) {
    return json({ error: `Unsupported MCP-Protocol-Version: ${version}` }, 400);
  }

  let message: JsonRpc;
  try {
    message = (await request.json()) as JsonRpc;
  } catch {
    return rpcError(null, -32700, "Parse error", version);
  }

  const { id, method, params } = message;

  // Notifications and responses carry no id and expect no answer.
  if (id === undefined) return new Response(null, { status: 202 });

  const origin = new URL(request.url).origin;

  switch (method) {
    case "initialize":
      return json(
        {
          jsonrpc: "2.0",
          id,
          result: {
            // Echo the client's version when we support it, rather than always answering with
            // the newest — a client that asked for an older dialect must get that dialect.
            protocolVersion: SUPPORTED_VERSIONS.includes(String(params?.protocolVersion))
              ? String(params?.protocolVersion)
              : LATEST,
            capabilities: { tools: { listChanged: false } },
            serverInfo: SERVER,
            instructions:
              "Notes, projects and Solo Factory skills of a solo founder building with AI. " +
              "Search first, then read the pages that look relevant. Everything here is public " +
              "and may be quoted with a link back.",
          },
        },
        200,
        version,
      );

    case "ping":
      return json({ jsonrpc: "2.0", id, result: {} }, 200, version);

    case "tools/list":
      return json({ jsonrpc: "2.0", id, result: { tools: TOOLS } }, 200, version);

    case "tools/call": {
      const name = String(params?.name ?? "");
      const args = (params?.arguments ?? {}) as Record<string, unknown>;

      if (name === "search") {
        const query = String(args.query ?? "").trim();
        if (query === "") return toolText(id, "Give me something to search for.", version, true);

        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const limit = Math.min(Math.max(Number(args.limit ?? 8) || 8, 1), 25);
        const section = args.section === undefined ? null : String(args.section);

        const docs = await loadIndex(env, origin);
        const hits = docs
          .filter(doc => section === null || doc.section === section)
          .map(doc => ({ doc, score: scoreDoc(doc, terms) }))
          .filter(hit => hit.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);

        if (hits.length === 0) {
          return toolText(
            id,
            `Nothing matched "${query}"${section ? ` in ${section}` : ""}. ` +
              `The site has ${docs.length} documents; try a broader word.`,
            version,
          );
        }

        const text = hits
          .map(({ doc }) =>
            [
              `## ${doc.title}`,
              `${doc.url}  ·  markdown: ${doc.markdown}  ·  section: ${doc.section}`,
              doc.description && `\n${doc.description}`,
              doc.tags.length > 0 && `tags: ${doc.tags.join(", ")}`,
              `\n${doc.excerpt}…`,
            ]
              .filter(Boolean)
              .join("\n"),
          )
          .join("\n\n---\n\n");

        return toolText(id, `${hits.length} of ${docs.length} documents matched "${query}".\n\n${text}`, version);
      }

      if (name === "read") {
        const raw = String(args.url ?? "").trim();
        if (raw === "") return toolText(id, "Give me a URL or a path to read.", version, true);

        let path: string;
        try {
          path = raw.startsWith("http") ? new URL(raw).pathname : raw;
        } catch {
          return toolText(id, `Not a URL I can read: ${raw}`, version, true);
        }
        // The twin is the canonical machine-readable form; ask for it directly.
        const target = path.endsWith(".md") ? path : `${path.replace(/\/+$/, "")}.md`;

        const response = await env.ASSETS.fetch(new Request(`${origin}${target}`));
        if (!response.ok) {
          return toolText(
            id,
            `No markdown version of ${path}. Only wiki, posts, projects, stacks and skills ` +
              `pages have one; the whole corpus is at ${origin}/llms-full.txt.`,
            version,
            true,
          );
        }
        return toolText(id, await response.text(), version);
      }

      return rpcError(id, -32602, `Unknown tool: ${name}`, version);
    }

    default:
      return rpcError(id, -32601, `Method not found: ${String(method)}`, version);
  }
};
