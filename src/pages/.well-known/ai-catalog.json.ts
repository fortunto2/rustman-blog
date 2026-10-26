/** /.well-known/ai-catalog.json — the ARD manifest at its predecessor path, identical to ard.json. */
import type { APIRoute } from 'astro';
import { ardManifest, json } from '../../lib/agent-discovery';

export const GET: APIRoute = () => json(ardManifest());
