/** /.well-known/agent-card.json — A2A-shaped card whose transport is the MCP server. */
import type { APIRoute } from 'astro';
import { agentCard, json } from '../../lib/agent-discovery';

export const GET: APIRoute = () => json(agentCard());
