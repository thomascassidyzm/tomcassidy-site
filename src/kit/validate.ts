/**
 * validate.ts — build-time invariants for a Program data object.
 *
 * Plain TypeScript, zero dependencies (deliberately not zod: the kit core
 * stays framework- and library-free so it can be lifted into @reasonable/kit
 * untouched). Pages call assertValidProgram() in frontmatter; because every
 * programme page prerenders, a malformed data file fails the BUILD, not
 * production.
 */

import type { Program } from './types';

/** Returns a list of problems — empty when the program is well-formed. */
export function validateProgram(program: Program): string[] {
  const problems: string[] = [];
  const { domains, cycles, hub } = program;

  // Widen the tuple: these checks guard RUNTIME data that may not honour the types.
  const domainCount = (domains as readonly unknown[]).length;
  if (!program.slug) problems.push('program.slug is required');
  if (domainCount < 2 || domainCount > 4)
    problems.push(`expected 2, 3 or 4 domains, got ${domainCount}`);

  // Colour is meaning: a four-domain wheel uses each pigment exactly once;
  // a two-half wheel just needs its halves distinct.
  const pigments = domains.map((d) => d.pigment);
  if (new Set(pigments).size !== pigments.length)
    problems.push(`domain pigments must be distinct, got [${pigments.join(', ')}]`);

  for (const d of domains) {
    if (d.focuses.length !== cycles)
      problems.push(`domain ${d.name}: expected ${cycles} focuses (= cycles), got ${d.focuses.length}`);
    for (const f of d.focuses) {
      if (!f.name) problems.push(`domain ${d.name} week ${f.week}: focus needs a name`);
      if (!f.lines?.length) problems.push(`${f.name || `week ${f.week}`}: needs at least one mnemonic line`);
      if (!f.coach?.wisdom) problems.push(`${f.name || `week ${f.week}`}: needs coach.wisdom`);
    }
  }
  if (!hub.coach?.wisdom) problems.push('hub needs coach.wisdom');

  // A cycle-depth ladder, when present, must name every lap exactly once.
  if (program.cycleDepths && program.cycleDepths.length !== program.cycles)
    problems.push(
      `cycleDepths names ${program.cycleDepths.length} laps but cycles is ${program.cycles}`,
    );

  // The rotation must be a contiguous run of weeks with no duplicates —
  // counting the hub when it is itself a weekly stop (9×4 keystone week 1,
  // Leadership review week 13).
  const weeks = domains.flatMap((d) => d.focuses.map((f) => f.week));
  if (hub.inRotation) weeks.push(Number(hub.numeral ?? '0'));
  const expected = weeks.length;
  const unique = new Set(weeks);
  if (unique.size !== weeks.length) problems.push('duplicate week numerals in the rotation');
  for (let w = 1; w <= expected; w++) {
    if (!unique.has(w)) {
      problems.push(`weeks are not contiguous 1..${expected} (missing ${w})`);
      break;
    }
  }

  return problems;
}

/** Throws (failing the build) when a program data file breaks the contract. */
export function assertValidProgram(program: Program): void {
  const problems = validateProgram(program);
  if (problems.length) {
    throw new Error(
      `Program "${program.slug}" is malformed:\n  - ${problems.join('\n  - ')}`,
    );
  }
}
