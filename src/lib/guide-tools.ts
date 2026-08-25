// Alexander's read-on-demand tool: the map lives in the prompt, the territory
// does not.
//
// PORT. The reference implementation is ~/distinction-physics/src/lib/guide-tools.ts;
// the third copy is ~/configuration-economics/src/lib/guide-tools.ts. Same file
// name, same tool name, same registry shape, same bounds — change the shape in
// the reference first, then port here.
//
// Why this exists
// ---------------
// Alexander used to be handed exactly one essay — the one the reader was on —
// and nothing else, so a reader who asked him to connect two pieces of Tom's
// writing got a refusal about text that was inside the same deployment. Now the
// prompt carries the CATALOGUE and every essay is one lookup away.
//
// DIVERGENCE from the two sibling copies, forced by the hub's content shape:
// essays live in an Astro content collection, and getCollection is async and
// only callable in a request context. So the registry is built per request and
// runGuideTool is async. Everything else — tool name, id-not-URL contract,
// bounds, unknown-key-returns-the-index behaviour — is identical.
//
// Resolution is entirely IN-PROCESS: the collection is in the serverless
// bundle, so a lookup is a function call, exactly as fresh as the rendered
// page. No HTTP hop, no public route.
//
// Safety: the model never supplies a URL or a path. It supplies a slug, and the
// registry IS the allowlist. Drafts are excluded from the registry, so
// unpublished writing stays unreadable. An unknown key returns the catalogue
// rather than an error, so Alexander recovers by looking again.

import { getCollection, type CollectionEntry } from 'astro:content';
import { STANDALONE_PAGES } from './essay-context';

type EssayEntry = CollectionEntry<'essays'>;

// ---------------------------------------------------------------------------
// Bounds. All three sites use the same numbers.
// ---------------------------------------------------------------------------

export const MAX_TOOL_ROUNDS = 3;
export const MAX_TOOL_CHARS_TOTAL = 40_000;
export const MAX_TOOL_CHARS_PER_RESULT = 20_000;

export function truncate(text: string, limit = MAX_TOOL_CHARS_PER_RESULT): string {
  if (text.length <= limit) return text;
  return (
    text.slice(0, limit) +
    `\n\n[…truncated at ${limit} characters. This resource is longer than the ` +
    `tool budget allows in one read; the text above is the opening of it, not ` +
    `the whole thing. Say so if you rely on a part that may have been cut.]`
  );
}

// ---------------------------------------------------------------------------
// The registry, generated from the essays collection.
// ---------------------------------------------------------------------------

function normaliseKey(raw: string): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/^\/+/, '')
    .replace(/^writing\//, '')
    .replace(/\.md$/, '')
    .replace(/\/+$/, '');
}

async function publishedEssays(): Promise<EssayEntry[]> {
  const essays = (await getCollection('essays')).filter((e: EssayEntry) => !e.data.draft);
  essays.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return essays;
}

function renderEssay(entry: EssayEntry): string {
  let out = `# ${entry.data.title}\n`;
  if (entry.data.epistemicStatus) out += `[epistemic status: ${entry.data.epistemicStatus}]\n`;
  if (entry.data.series) out += `*Series: ${entry.data.series}*\n`;
  out += `\n${entry.data.summary}\n\n`;
  out += `${entry.body ?? ''}\n`;
  return out;
}

/**
 * The MAP: the catalogue of Tom's published writing, by slug. Small,
 * structural, and generated from the collection — nobody has to remember to
 * edit it when an essay ships. This is the only content listing that belongs
 * in the system prompt.
 */
export async function buildSiteIndex(): Promise<string> {
  const essays = await publishedEssays();
  let out = `### Tom's writing — every one of these is readable with \`read_section\`\n\n`;
  for (const e of essays) {
    const status = e.data.epistemicStatus ? ` [${e.data.epistemicStatus}]` : '';
    const series = e.data.series ? ` *(${e.data.series})*` : '';
    out += `- \`${e.data.slug}\` — **${e.data.title}**${status}${series}: ${e.data.summary}\n`;
  }
  const standalone = Object.entries(STANDALONE_PAGES);
  if (standalone.length > 0) {
    out += `\n### Standalone pages (published, outside the writing catalogue)\n\n`;
    for (const [slug, page] of standalone) {
      out += `- \`${slug}\` — **${page.title}**\n`;
    }
  }
  return out;
}

async function buildShortIndex(): Promise<string> {
  const essays = await publishedEssays();
  const slugs = [
    ...essays.map((e) => e.data.slug),
    ...Object.keys(STANDALONE_PAGES),
  ];
  return `Available slugs: ${slugs.map((s) => `\`${s}\``).join(', ')}`;
}

// ---------------------------------------------------------------------------
// The tool.
// ---------------------------------------------------------------------------

export const READ_SECTION_TOOL = {
  name: 'read_section',
  description:
    'Read the full live text of any of Tom Cassidy\'s published essays. Use this ' +
    'BEFORE saying you do not have something — every slug in the catalogue in ' +
    'your system prompt is readable this way. Takes the essay\'s slug, e.g. ' +
    '"the-comprehensivist". If the slug is unknown you get the catalogue back, ' +
    'so you can look again.',
  input_schema: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string' as const,
        description: 'An essay slug, as listed in the catalogue in your system prompt.',
      },
    },
    required: ['id'],
  },
};

export const GUIDE_TOOLS = [READ_SECTION_TOOL];

export interface ToolRunResult {
  text: string;
  found: boolean;
}

/**
 * Resolve one tool call. Never throws, never takes a URL, never touches the
 * network: the slug is looked up in the registry or it is not found.
 */
export async function runGuideTool(name: string, input: unknown): Promise<ToolRunResult> {
  if (name !== READ_SECTION_TOOL.name) {
    return { text: `No such tool: ${name}. The only tool available is read_section.`, found: false };
  }

  const rawId = (input as { id?: unknown } | null)?.id;
  if (typeof rawId !== 'string' || rawId.trim() === '') {
    return { text: `read_section needs an \`id\`. ${await buildShortIndex()}`, found: false };
  }

  const key = normaliseKey(rawId);

  const standalone = Object.entries(STANDALONE_PAGES).find(([slug]) => normaliseKey(slug) === key);
  if (standalone) {
    // The source already opens with its own "# " title line.
    return { text: truncate(standalone[1].source), found: true };
  }

  const essays = await publishedEssays();
  const entry = essays.find((e) => normaliseKey(e.data.slug) === key);

  if (entry) {
    return { text: truncate(renderEssay(entry)), found: true };
  }

  return {
    text:
      `No essay with slug "${rawId}" is published on this site. That is a lookup ` +
      `miss, not a gap in the writing — check the list below and try the right ` +
      `slug. If the thing the reader asked about genuinely is not in this list, ` +
      `then Tom has not published it here, and you should say so plainly.\n\n` +
      (await buildShortIndex()),
    found: false,
  };
}

/**
 * The prompt block that tells Alexander the tool exists and how to use it.
 * Carries the generated catalogue, so the map is always current.
 */
export async function buildReadingInstructions(): Promise<string> {
  return `READING TOM'S WRITING ON DEMAND

You have a tool, \`read_section\`, that returns the full live text of any essay
in the catalogue below. The text is read from the same deployment that renders
the page, so it is always current.

**Use the tool before saying you do not have something.** Tom's work connects
across pieces, and connecting them is much of what you are for: if a reader asks
you to compare two essays, follow a thread from one to another, or check what he
actually said somewhere else, read it first and answer from the real text rather
than from the summary line.

The honest refusal still stands, and it matters: if something genuinely is not in
the catalogue below, Tom has not published it here, and you say so plainly rather
than inventing it. What you must never do is refuse over writing that IS here.

Reading is for grounding your own answer, not for reciting — the rule above
stands: build from the text, do not read it back.

You may read up to ${MAX_TOOL_ROUNDS} times per question, so read what you need
in one go where you can — the tool accepts one slug per call, but you may make
several calls in the same turn.

${await buildSiteIndex()}`;
}
