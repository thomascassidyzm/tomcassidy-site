/**
 * The programme registry — every Reason-Ability programme in one array.
 *
 * One place to enumerate the family, so anything that iterates programmes
 * (the Explore deep-content route's getStaticPaths, future indexes) reads from
 * here and cannot drift from the data files. Add a programme: write its data
 * file, import it, drop it in ALL_PROGRAMS.
 */
import type { Program } from '@/kit/types';

import { agileResults } from './agile-results';
import { conqueringLife } from './conquering-life';
import { greatTeaching } from './great-teaching';
import { reasonableEating } from './reasonable-eating';
import { reasonableLeadership } from './reasonable-leadership';
import { reasonableSuccess } from './reasonable-success';
import { reasonableTeaching } from './reasonable-teaching';
import { ultimate13x4 } from './ultimate-13x4';

export const ALL_PROGRAMS: Program[] = [
  agileResults,
  conqueringLife,
  greatTeaching,
  reasonableEating,
  reasonableLeadership,
  reasonableSuccess,
  reasonableTeaching,
  ultimate13x4,
];

/** Lookup by slug — used by the Explore route. */
export const programBySlug = (slug: string): Program | undefined =>
  ALL_PROGRAMS.find((p) => p.slug === slug);
