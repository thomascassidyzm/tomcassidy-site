import type { APIRoute } from 'astro';
import { buildPromptWithContext, type GuideContext } from '@/lib/guide-prompt';
import { extractAndRenderMath } from '@/lib/math';
import { getEssayMarkdown } from '@/lib/essay-context';
import {
  GUIDE_TOOLS,
  runGuideTool,
  truncate,
  buildReadingInstructions,
  MAX_TOOL_ROUNDS,
  MAX_TOOL_CHARS_TOTAL,
  MAX_TOOL_CHARS_PER_RESULT,
} from '@/lib/guide-tools';

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
// This endpoint has a single tier, so there is one log and one budget. The
// (ip, log, max) shape matches distinction-physics and zenjin, where a tighter
// ESCALATED_RATE_LIMIT_MAX_REQUESTS spends from a second log as a SUB-limit of
// this one — never a bypass. If a deep tier is ever added here, it is one
// constant and one Map away rather than a rewrite.
const requestLog = new Map<string, number[]>();

function isRateLimited(
  ip: string,
  log: Map<string, number[]>,
  max: number,
): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [key, timestamps] of log) {
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      log.delete(key);
    } else {
      log.set(key, fresh);
    }
  }

  const timestamps = log.get(ip) ?? [];
  if (timestamps.length >= max) {
    // Retry-After counts from the OLDEST request still in the window — that is
    // when a slot actually frees up, not a flat full window.
    const retryAfterSeconds = Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSeconds: Math.max(retryAfterSeconds, 1) };
  }
  timestamps.push(now);
  log.set(ip, timestamps);
  return { limited: false, retryAfterSeconds: 0 };
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return 'unknown';
}

// The set of hostnames that count as "this site" for the same-origin check.
//
// `new URL(request.url).host` is NOT the public hostname behind Vercel's proxy —
// the serverless invocation sees an internal host, so comparing Origin against it
// rejected every real browser request with a 403 while curl (which sends no
// Origin) sailed through. The public hostname arrives in the forwarding headers
// instead. Neither `x-forwarded-host` nor `host` is reachable from page JS —
// browsers set Host themselves and refuse `x-forwarded-host` as a forbidden
// header, and Vercel's edge overwrites both — so trusting them here does not
// widen the guard: a genuine cross-site caller still fails on its own Origin.
function allowedHosts(request: Request): string[] {
  const hosts = [
    request.headers.get('x-forwarded-host'),
    request.headers.get('host'),
  ];
  try {
    hosts.push(new URL(request.url).host);
  } catch {
    // request.url unparseable; the forwarding headers still carry the answer.
  }
  return hosts.filter((h): h is string => Boolean(h)).map((h) => h.toLowerCase());
}

// Same-origin check: reject cross-site callers while keeping the deployed
// site's own guide panel working. Origin is derived from the request's own
// hostname rather than a hardcoded list, so it holds on every preview
// deployment too, and keeps working unchanged if a domain is added later.
function isSameOrigin(request: Request): boolean {
  const originHeader = request.headers.get('origin');
  // Same-origin fetches from a browser normally carry Origin. Missing Origin
  // (e.g. curl, server-to-server) is not a browser cross-site request, so it
  // is not what this check is meant to block; let it through to the other
  // defenses (rate limit, size cap).
  if (!originHeader) return true;

  try {
    const origin = new URL(originHeader);
    return allowedHosts(request).includes(origin.host.toLowerCase());
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
    const { limited, retryAfterSeconds } = isRateLimited(
      clientIp,
      requestLog,
      RATE_LIMIT_MAX_REQUESTS,
    );
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
    // surfaces, and where a slug resolves to nothing, nothing is shipped: the
    // generated catalogue in the reading instructions is always in the prompt,
    // so the guide already knows what this site contains, and anything the
    // conversation turns to is read on demand rather than pre-loaded.
    const essayMarkdown = context.currentSlug
      ? await getEssayMarkdown(context.currentSlug)
      : null;

    const readingInstructions = await buildReadingInstructions();
    const systemPrompt = buildPromptWithContext(
      message,
      context,
      essayMarkdown,
      readingInstructions,
    );

    const messages = [
      ...history.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: 'user' as const, content: message },
    ];

    // ---------------------------------------------------------------------
    // Bounded tool loop.
    //
    // Alexander carries the CATALOGUE of Tom's writing in his prompt and reads
    // the TEXT on demand through read_section, so publishing an essay and
    // updating the guide are the same act. The loop is a plain `while` around
    // the same non-streaming call the endpoint always made — no SSE plumbing.
    //
    // It is bounded twice over: at most MAX_TOOL_ROUNDS rounds, and at most
    // MAX_TOOL_CHARS_TOTAL characters of fetched content per user message.
    // When either bound is reached the final call is made with no `tools`
    // array at all, so the model cannot ask again and must answer in text.
    //
    // Tool rounds sit INSIDE one already-rate-limited request, so the per-IP
    // limit above is unchanged, and max_tokens caps each call's own output
    // rather than the transcript; tool results are input tokens. A question
    // that makes Alexander read does cost more than one that does not — worth
    // knowing on a BILLED endpoint, which is why the bounds are tight.
    //
    // Resolution is in-process (see guide-tools.ts) — no network hop, no path
    // or URL ever taken from the model, and drafts are not in the registry.
    // ---------------------------------------------------------------------
    const conversation: unknown[] = [...messages];
    const readIds: string[] = [];
    let toolRounds = 0;
    let toolCharsUsed = 0;
    let data: any;

    for (;;) {
      const toolsAllowed = toolRounds < MAX_TOOL_ROUNDS && toolCharsUsed < MAX_TOOL_CHARS_TOTAL;

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
          messages: conversation,
          ...(toolsAllowed ? { tools: GUIDE_TOOLS } : {}),
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

      data = await response.json();

      if (!toolsAllowed || data?.stop_reason !== 'tool_use') break;

      const blocks: any[] = Array.isArray(data.content) ? data.content : [];
      const toolUses = blocks.filter((b) => b?.type === 'tool_use');
      if (toolUses.length === 0) break;

      toolRounds += 1;
      // Push the assistant turn back VERBATIM — thinking blocks and their
      // signatures must survive intact on a thinking-capable model.
      conversation.push({ role: 'assistant', content: blocks });

      const toolResults = [];
      for (const tu of toolUses) {
        const remaining = MAX_TOOL_CHARS_TOTAL - toolCharsUsed;
        let text: string;
        if (remaining <= 0) {
          text =
            'Reading budget for this question is used up. Answer from what you ' +
            'have already read, and say plainly if that means you cannot fully ' +
            'answer.';
        } else {
          const result = await runGuideTool(tu.name, tu.input);
          text = truncate(result.text, Math.min(MAX_TOOL_CHARS_PER_RESULT, remaining));
          toolCharsUsed += text.length;
          if (result.found && typeof tu.input?.id === 'string') readIds.push(tu.input.id);
        }
        toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: text });
      }

      conversation.push({ role: 'user', content: toolResults });
    }

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
        // Which essays Alexander actually went and read to answer this.
        // Diagnostic, not display: it is how you tell "he read it" from
        // "he talked about it".
        reads: readIds,
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
