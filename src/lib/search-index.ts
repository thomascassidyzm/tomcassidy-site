// Build-time search index for /writing.
//
// WHY THIS EXISTS: the /writing search used to match title, summary, topics
// and series only. Tom went looking for the Kenya piece at 4am and the search
// said "Nothing matches that" — because "kenya" appears in the BODY of
// Community Regeneration and nowhere in its metadata, and because that page
// is a standalone .astro page rather than an essays-collection entry, so the
// index could not see it at all. Both holes are closed here.
//
// SHAPE: metadata blobs stay inline on the page as `data-search` (they are
// tiny and make the first keystroke instant). Body text is ~181KB of raw
// markdown across the estate — inlining that would take /writing from 34KB to
// ~205KB — so bodies ship as a separate /writing-index.json, built at build
// time by src/pages/writing-index.json.ts and fetched once by the client.
// No server, no search service, prerendering preserved.

import { getCollection, type CollectionEntry } from 'astro:content';
import { STANDALONE_PAGES } from './essay-context';

type EssayEntry = CollectionEntry<'essays'>;

/**
 * Reduce markdown prose to a flat lowercase haystack for substring matching.
 * Deliberately crude: no stemming, no fuzzy matching. Plain substring is what
 * the site already does and it is honest about what it will and will not find.
 */
export function normaliseBody(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')        // fenced code
    .replace(/`[^`\n]*`/g, ' ')             // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')  // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → their text
    .replace(/<[^>]+>/g, ' ')               // stray html
    .replace(/[#*_>~|`]/g, ' ')             // markdown punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** Title, summary, topics and series — the blob that ships inline. */
export function metaBlob(parts: {
  title: string;
  summary: string;
  topics?: string[];
  series?: string;
  label?: string;
}): string {
  return [parts.title, parts.summary, (parts.topics ?? []).join(' '), parts.series ?? '', parts.label ?? '']
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * The key that ties a rendered card to its body text in the JSON index.
 * Namespaced so an essay slug and a standalone slug can never collide.
 */
export const essayKey = (slug: string) => `essay:${slug}`;
export const pageKey = (slug: string) => `page:${slug}`;

/** A standalone published page, ready to render as a card. */
export interface StandaloneItem {
  slug: string;
  key: string;
  title: string;
  summary: string;
  date: Date;
  href: string;
  label: string;
  epistemicStatus?: 'established' | 'derived' | 'contested' | 'open';
  topics: string[];
  search: string;
}

/**
 * Standalone pages that belong in the search index, from the one registry in
 * essay-context.ts. `indexed: false` on an entry keeps it out — an explicit
 * field, never a heuristic, so nothing unpublished leaks in by accident.
 */
export function standaloneItems(): StandaloneItem[] {
  return Object.entries(STANDALONE_PAGES)
    .filter(([, page]) => page.indexed !== false)
    .map(([slug, page]) => ({
      slug,
      key: pageKey(slug),
      title: page.title,
      summary: page.summary,
      date: new Date(page.date),
      href: page.href ?? `/${slug}`,
      label: page.label,
      epistemicStatus: page.epistemicStatus,
      topics: page.topics ?? [],
      search: metaBlob({
        title: page.title,
        summary: page.summary,
        topics: page.topics,
        label: page.label,
      }),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * The full body index: key → flattened body text. Drafts are excluded, same
 * call guide-tools.ts makes and for the same reason.
 */
export async function buildBodyIndex(): Promise<Record<string, string>> {
  const essays = (await getCollection('essays')).filter((e: EssayEntry) => !e.data.draft);
  const out: Record<string, string> = {};
  for (const e of essays) {
    out[essayKey(e.data.slug)] = normaliseBody(e.body ?? '');
  }
  for (const item of standaloneItems()) {
    const page = STANDALONE_PAGES[item.slug];
    out[item.key] = normaliseBody(page.source);
  }
  return out;
}
