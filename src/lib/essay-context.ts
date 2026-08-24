// Render the live essay the reader is currently viewing into a markdown
// bundle for injection into the guide's system prompt.
//
// This is the hub's analogue of configuration-economics' section-renderer.ts.
// DIVERGENCE: CE reads from a hand-coded SECTIONS array; the hub reads from
// the Astro "essays" content collection. Edit the essay's .md file and the
// guide automatically reads the new text on the next request — no prompt
// curation needed.
//
// IMPORTANT: getCollection is async and only callable inside an Astro
// request/SSR context, so these helpers are async and are invoked from the
// /api/guide endpoint (which runs on POST only — never at build time).

import { getCollection, type CollectionEntry } from 'astro:content';
import communityRegeneration from '@/data/community-regeneration.md?raw';

type EssayEntry = CollectionEntry<'essays'>;

// Standalone pages: prose that lives in src/data and is rendered by its own
// .astro page rather than through the essays collection, deliberately, so it
// stays out of /writing and the series machinery. The guide still has to be
// able to read it — a reader on such a page asks about the page in front of
// them, and a guide that answers "I don't see which essay you mean" is worse
// than no guide. Keyed by the same `slug` the page hands to EssayLayout.
const STANDALONE_PAGES: Record<string, { title: string; source: string }> = {
  'community-regeneration': {
    title: 'Community Regeneration as Applied Configuration Economics',
    source: communityRegeneration,
  },
};

function statusLine(status?: string): string {
  return status ? `[epistemic status: ${status}]\n` : '';
}

/** Full markdown of a single essay, identified by its frontmatter `slug`. */
export async function getEssayMarkdown(slug: string): Promise<string | null> {
  const standalone = STANDALONE_PAGES[slug];
  if (standalone) {
    // The source already opens with its own "# " title line.
    return `${standalone.source}\n`;
  }

  const essays = await getCollection('essays');
  const entry = essays.find((e: EssayEntry) => e.data.slug === slug);
  if (!entry) return null;

  let out = `# ${entry.data.title}\n`;
  out += statusLine(entry.data.epistemicStatus);
  if (entry.data.series) out += `*Series: ${entry.data.series}*\n`;
  out += `\n${entry.data.summary}\n\n`;
  // entry.body is the raw markdown source of the essay.
  out += `${entry.body ?? ''}\n`;
  return out;
}

/** A compact catalogue of all (non-draft) essays for general-context turns. */
export async function getEssayOverview(): Promise<string> {
  const essays = (await getCollection('essays')).filter((e: EssayEntry) => !e.data.draft);
  essays.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  let out = `# Tom Cassidy — Writing (catalogue)\n\n`;
  for (const e of essays) {
    const status = e.data.epistemicStatus ? ` [${e.data.epistemicStatus}]` : '';
    out += `- **${e.data.title}**${status} — ${e.data.summary}\n`;
  }
  return out;
}
