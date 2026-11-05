/**
 * MCP Server Card: how an agent discovers the server at /mcp without being told about it.
 * Published because the server behind it is real; OAuth metadata stays absent because there is
 * nothing here to authenticate against. The content is in src/lib/agent-discovery.ts.
 */
import type { APIRoute } from 'astro';
import { json, mcpServerCard } from '../../../lib/agent-discovery';

export const GET: APIRoute = () => json(mcpServerCard());
