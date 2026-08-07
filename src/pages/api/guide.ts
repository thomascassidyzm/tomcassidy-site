import type { APIRoute } from 'astro';
import { buildPromptWithContext, type GuideContext } from '@/lib/guide-prompt';
import { extractAndRenderMath } from '@/lib/math';
import { getEssayMarkdown, getEssayOverview } from '@/lib/essay-context';

// SSR-only. This route is never prerendered, so NO Anthropic API call can
// happen at build time. The fetch to Anthropic only runs inside POST.
export const prerender = false;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Model selection is SERVER-SIDE ONLY. The caller never picks a model and
// never picks a tier: this constant is the complete set of models this
// endpoint can ever reach. There is no code path from any request body to any
// other model, and Opus is not reachable at all. A request that names a model
// or a tier is rejected outright (400) rather than silently downgraded, so the
// refusal is visible to whoever sent it.
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 2048;

interface GuideRequest {
  message: string;
  history?: ChatMessage[];
  context?: GuideContext;
}

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_TURNS = 20;
const MAX_BODY_BYTES = 50_000;

// Sliding-window rate limit, keyed on client IP. Module-level Map is fine for
// a single serverless instance; entries are pruned on every request so it
// can't grow unbounded.
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [key, timestamps] of requestLog) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, fresh);
    }
  }

  const timestamps = requestLog.get(ip) ?? [];
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    // Retry-After counts from the OLDEST request still in the window — that is
    // when a slot actually frees up, not a flat full window.
    const retryAfterSeconds = Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return { limited: false, retryAfterSeconds: 0 };
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return 'unknown';
}

// Same-origin check: reject cross-site callers while keeping the deployed
// site's own guide panel working. Origin is derived from the request's own URL
// rather than a hardcoded list, so it holds on every preview deployment too.
function isSameOrigin(request: Request): boolean {
  const originHeader = request.headers.get('origin');
  // Same-origin fetches from a browser normally carry Origin. Missing Origin
  // (e.g. curl, server-to-server) is not a browser cross-site request, so it
  // is not what this check is meant to block; let it through to the other
  // defenses (rate limit, size cap).
  if (!originHeader) return true;

  try {
    const origin = new URL(originHeader);
    const requestUrl = new URL(request.url);
    return origin.host === requestUrl.host;
  } catch {
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!isSameOrigin(request)) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const clientIp = getClientIp(request);
    const { limited, retryAfterSeconds } = isRateLimited(clientIp);
    if (limited) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSeconds),
        },
      });
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return new Response(JSON.stringify({ error: 'Request body too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body: GuideRequest = JSON.parse(rawBody);
    const { message, history = [], context = {} } = body;

    // A caller naming a model or a tier is refused, not quietly ignored. There
    // is no request shape that selects a model; this exists so the refusal is
    // legible rather than looking like the request worked as asked.
    if (body !== null && typeof body === 'object' && ('model' in body || 'tier' in body)) {
      return new Response(
        JSON.stringify({ error: 'Model selection is not caller-controlled' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (typeof message !== 'string' || message.length > MAX_MESSAGE_LENGTH) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!Array.isArray(history) || history.length > MAX_HISTORY_TURNS) {
      return new Response(JSON.stringify({ error: 'History too long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (
      history.some(
        (msg) => typeof msg?.content !== 'string' || msg.content.length > MAX_MESSAGE_LENGTH,
      )
    ) {
      return new Response(JSON.stringify({ error: 'History entry too long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Graceful state when no key is set. Alexander is BILLED — do not
      // configure a key or live-test casually (see .env.example).
      return new Response(JSON.stringify({ error: 'Guide not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Resolve the live essay text from the content collection. On non-essay
    // surfaces, fall back to a catalogue overview of all essays.
    const essayMarkdown = context.currentSlug
      ? await getEssayMarkdown(context.currentSlug)
      : await getEssayOverview();

    const systemPrompt = buildPromptWithContext(message, context, essayMarkdown);

    const messages = [
      ...history.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: 'user' as const, content: message },
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return new Response(JSON.stringify({ error: 'Guide unavailable' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    // Take the first TEXT block rather than content[0]: a thinking-capable
    // model can put a thinking block first.
    const textBlock = Array.isArray(data.content)
      ? data.content.find((block: { type?: string }) => block?.type === 'text')
      : undefined;
    const assistantMessage = textBlock?.text || 'I was unable to generate a response.';
    const { text: messageWithTokens, math: mathBlocks } = extractAndRenderMath(assistantMessage);

    return new Response(
      JSON.stringify({
        // Display version (math replaced with XXMATH<n>XX tokens).
        message: messageWithTokens,
        math: mathBlocks,
        // Raw version (LaTeX intact) — the client stores this in history so
        // subsequent turns send real LaTeX, not placeholder tokens.
        rawMessage: assistantMessage,
        context,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Guide API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
