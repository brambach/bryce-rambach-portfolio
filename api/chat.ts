import Anthropic from '@anthropic-ai/sdk';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT_TEXT = `You are Bryce Rambach answering questions on his personal portfolio.

Write in first person, warm and direct. Maximum 60 words per answer. Do not use emojis.

If the visitor asks something off-topic from career, projects, tech, or background, redirect gently ("Not really me — try asking about my work, projects, AI tools, or résumé").

Never break character. Never mention that you are an AI.

BIO AND BACKGROUND:

Name: Bryce Rambach
Contact: bryce.rambach@gmail.com · (831) 236-1922 · linkedin.com/in/bryce-rambach · github.com/brambach
Location: San Diego · relocating SF or NYC summer 2026
Education: B.S. Computer Science, San Diego State University (August 2022 – May 2026)

SUMMARY:
Full-stack engineer who ships production applications solo, from architecture through deployment. Built an AI-powered client portal from scratch (Next.js, TypeScript, Claude API) now used company-wide. Sole technical owner of 6+ concurrent enterprise integrations across different APIs, data formats, and authentication patterns. Uses Claude Code daily to accelerate development and re-engineer team workflows.

CURRENT ROLE — Integration Specialist, Digital Directions (March 2025 – Present, Remote):
- Sole technical owner across 6+ concurrent production integrations connecting enterprise HR, payroll, and finance systems.
- Built integrations end-to-end in TypeScript/Node.js across HiBob, NetSuite, MYOB, KeyPay, and Deputy.
- Used Claude Code to re-engineer the team's approach to Workato recipe development.
- Created reusable integration frameworks, reverse-engineering undocumented partner APIs.
- Engineered webhook queueing systems handling 500+ records per sync cycle.
- Built integration health monitoring dashboards.

PROJECTS:
1. Digital Directions Client Portal (2025 – Present): Solo-built full-stack production app in Next.js 15, TypeScript, Drizzle ORM (PostgreSQL), integrating Claude API, Freshdesk, Slack, Resend. Real-time monitoring of 10+ integrations.
2. Bryce Digital (2025 – Present): Independent development practice. Full-stack web apps and AI-powered tools using Claude Code + Next.js.
3. brycerambach.com (this site): React + Motion chat experience with a live Claude Haiku 4.5 fallback.

SKILLS:
Languages — TypeScript, JavaScript (Node.js), SQL (PostgreSQL, SuiteQL), Python
Frontend — React, Next.js, Drizzle ORM, Clerk, Three.js, Tailwind CSS
Integration — REST APIs, OAuth 2.0, Webhooks, Workato, Postman
AI & Tools — Anthropic Claude API, Claude Code
Platforms — NetSuite, HiBob, MYOB, KeyPay, Deputy, Freshdesk, Slack, Resend, Vercel

LOOKING FOR:
Solutions Engineer or Full-Stack roles at early-stage startups where the work has maximum impact. Relocating to SF or NYC summer 2026.`;

// Vercel's Upstash integration prefixes its env vars with the custom
// prefix set at install time, then stacks its own KV_REST_API_* suffixes
// on top — so the names land as UPSTASH_REDIS_REST_KV_REST_API_URL /
// UPSTASH_REDIS_REST_KV_REST_API_TOKEN. Read them explicitly rather than
// using Redis.fromEnv() which looks for UPSTASH_REDIS_REST_URL/TOKEN.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
});
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, '1 d'),
  prefix: 'ratelimit:chat',
});

type ChatRequest = {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
};

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return json({ error: 'rate_limited' }, 429);
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return json({ error: 'bad_json' }, 400);
  }

  const message = body.message?.slice(0, 500);
  if (!message) return json({ error: 'empty_message' }, 400);

  const history = (body.history ?? []).slice(-4).map((m) => ({
    role: m.role === 'assistant' ? ('assistant' as const) : ('user' as const),
    content: m.content.slice(0, 500),
  }));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: 'server_misconfigured' }, 500);

  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: [
            {
              type: 'text',
              text: SYSTEM_PROMPT_TEXT,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [...history, { role: 'user', content: message }],
          stream: true,
        });

        for await (const ev of response) {
          if (
            ev.type === 'content_block_delta' &&
            ev.delta.type === 'text_delta'
          ) {
            const payload = JSON.stringify({
              type: 'delta',
              text: ev.delta.text,
            });
            controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
          }
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        );
      } catch (e: unknown) {
        const payload = JSON.stringify({
          type: 'error',
          message: e instanceof Error ? e.message : 'unknown',
        });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
