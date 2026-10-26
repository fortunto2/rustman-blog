/** /.well-known/ai.txt — the same policy as /agents.txt, at the other path agents probe. */
import type { APIRoute } from 'astro';
import { agentPolicyText, text } from '../../lib/agent-discovery';

export const GET: APIRoute = () => text(agentPolicyText());
