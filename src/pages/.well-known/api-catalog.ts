/**
 * /.well-known/api-catalog — RFC 9727. Extensionless, so Cloudflare would guess its type;
 * public/_headers sets application/linkset+json, which is what the RFC requires.
 */
import type { APIRoute } from 'astro';
import { apiCatalog, json } from '../../lib/agent-discovery';

export const GET: APIRoute = () =>
  json(apiCatalog(), 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"');
