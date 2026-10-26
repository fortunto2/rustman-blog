/** /.well-known/ard.json — Agentic Resource Discovery manifest (current path). */
import type { APIRoute } from 'astro';
import { ardManifest, json } from '../../lib/agent-discovery';

export const GET: APIRoute = () => json(ardManifest());
