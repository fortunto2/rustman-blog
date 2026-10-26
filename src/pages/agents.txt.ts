/** /agents.txt — what an agent may request here. Same text as /.well-known/ai.txt. */
import type { APIRoute } from 'astro';
import { agentPolicyText, text } from '../lib/agent-discovery';

export const GET: APIRoute = () => text(agentPolicyText());
