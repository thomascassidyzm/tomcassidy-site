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

type ModelTier = 'haiku' | 'sonnet' | 'opus';

// Default tier is haiku (cheapest). Pin model IDs to match the sibling sites'
// convention; update when newer snapshots ship.
const MODEL_BY_TIER: Record<ModelTier, string> = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-7',
};

interface GuideRequest {
  message: string;
  history?: ChatMessage[];
  context?: GuideContext;
  tier?: ModelTier;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: GuideRequest = await request.json();
    const { message, history = [], context = {}, tier } = body;

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
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

    const selectedTier: ModelTier = tier && tier in MODEL_BY_TIER ? tier : 'haiku';
    const selectedModel = MODEL_BY_TIER[selectedTier];

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
        model: selectedModel,
        max_tokens: 2048,
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
    const assistantMessage =
      data.content?.[0]?.text || 'I was unable to generate a response.';
    const { text: messageWithTokens, math: mathBlocks } = extractAndRenderMath(assistantMessage);

    return new Response(
      JSON.stringify({
        // Display version (math replaced with XXMATH<n>XX tokens).
        message: messageWithTokens,
        math: mathBlocks,
        // Raw version (LaTeX intact) — the client stores this in history so
        // subsequent turns send real LaTeX, not placeholder tokens.
        rawMessage: assistantMessage,
        tier: selectedTier,
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
