import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * "essays" content collection — the hub's prose pipeline.
 *
 * KEY DIVERGENCE from the sibling sites (distinction-physics /
 * configuration-economics), which hand-code their content as TypeScript
 * blocks. The hub is long-form prose, so essays are authored as Markdown
 * files in src/content/essays/*.md and read via getCollection('essays').
 *
 * epistemicStatus is OPTIONAL — most hub writing is just writing. When
 * present it uses the shared four-value vocabulary and drives the
 * status marker in EssayLayout and the guide-panel context.
 */
const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    // `slug` is authored explicitly so URLs are stable even if the filename
    // changes. The routing layer prefers it over the file id.
    slug: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    topics: z.array(z.string()).default([]),
    epistemicStatus: z.enum(['established', 'derived', 'contested', 'open']).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    series: z.string().optional(),
  }),
});

export const collections = { essays };
