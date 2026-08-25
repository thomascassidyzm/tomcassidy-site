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
// Exported so guide-tools.ts can register these in the read_section registry
// from the same list, and so search-index.ts can put them in the /writing
// search — one home, no second copy to keep in step.
//
// The card fields (summary/date/label/…) exist because these pages are now
// findable through the /writing search box: a search hit has to render as a
// card, and a card needs a summary, a date and an honest label saying what
// kind of thing it is. They stay OUT of the browse listing — the block that
// holds them appears only when a query matches inside it.
export interface StandalonePage {
  title: string;
  source: string;
  /** One-line description, shown on the search-result card. */
  summary: string;
  /** ISO date, as printed on the page itself. */
  date: string;
  /** Plain-register kind marker, e.g. "Pre-brief — forming". */
  label: string;
  /** Where the page actually lives. NOT under /writing/. */
  href: string;
  epistemicStatus?: 'established' | 'derived' | 'contested' | 'open';
  topics?: string[];
  /** Explicit opt-out of the search index. Default: indexed. */
  indexed?: boolean;
}

export const STANDALONE_PAGES: Record<string, StandalonePage> = {
  'community-regeneration': {
    title: 'Community Regeneration as Applied Configuration Economics',
    source: communityRegeneration,
    summary:
      'Using Configuration Economics as a practical framework for participating in the regeneration of multiple local communities internationally.',
    date: '2026-08-24',
    label: 'Pre-brief — forming',
    href: '/community-regeneration',
    epistemicStatus: 'open',
    topics: ['configuration-economics', 'community-regeneration'],
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
