import type { Proposal } from './types';
import { dreamtravelstudy } from './dreamtravelstudy';

/** Every live proposal, keyed by URL slug. Add a new client's file and list it here. */
export const proposals: Record<string, Proposal> = {
  [dreamtravelstudy.slug]: dreamtravelstudy,
};
