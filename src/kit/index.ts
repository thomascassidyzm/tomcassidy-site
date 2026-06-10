/**
 * The Reason-Ability kit — single barrel for the pure-TS core.
 *
 * This folder is the future @reasonable/kit package, extracted in place
 * (WEBAPP-MERIT-AND-KIT.md, migration STEP 1): everything inside imports only
 * from inside, so the boundary is real before anything is published.
 *
 * Svelte components are deliberately NOT re-exported here (a .ts barrel can't
 * carry .svelte types cleanly) — import them by path:
 *   import ProgramWheel from '@/kit/ProgramWheel.svelte';
 *   import SubDiagram from '@/kit/primitives/SubDiagram.svelte';
 */

export type {
  Program,
  Domain,
  FocusPoint,
  Coach,
  Pigment,
} from './types';

export {
  pt,
  arc,
  annularSector,
  buildWheel,
  sliceForWeek,
  DEFAULT_DIMS,
  type WheelDims,
  type WheelSlice,
  type WheelDomainArc,
  type WheelLayout,
} from './wheel-geometry';

export { validateProgram, assertValidProgram } from './validate';
