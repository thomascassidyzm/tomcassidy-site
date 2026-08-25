import { describe, it, expect } from 'vitest';
import { buildSystemBlocks } from './guide-request';
import { buildGlobalPrompt, buildSectionContext, buildPromptWithContext } from './guide-prompt';

// The mechanism, pinned against the REAL prompt builder rather than fixtures.
const READING = '### Essays\n- `a-piece` — A Piece\n- `another` — Another\n';

describe('the old single-string shape vs the new layered shape', () => {
  const a = { mode: 'essay', currentTitle: 'A Piece' } as never;
  const b = { mode: 'essay', currentTitle: 'Another' } as never;

  it('proves the old shape offered no cache boundary at the global/page seam', () => {
    // OLD: one string, so one cache_control breakpoint, at its very end — the
    // entry is keyed on the whole string, page included, so moving between
    // essays leaves nothing to read back.
    expect(buildPromptWithContext('q', a, 'TEXT A', READING)).not.toBe(
      buildPromptWithContext('q', b, 'TEXT B', READING),
    );

    // NEW: two blocks, two breakpoints. The first is keyed on the global layer
    // alone and survives the move; only the second is rewritten.
    const newA = buildSystemBlocks({
      globalPrompt: buildGlobalPrompt(READING),
      sectionContext: buildSectionContext(a, 'TEXT A'),
    });
    const newB = buildSystemBlocks({
      globalPrompt: buildGlobalPrompt(READING),
      sectionContext: buildSectionContext(b, 'TEXT B'),
    });

    expect(newA[0].text).toBe(newB[0].text);
    expect(newA[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(newA[1].text).not.toBe(newB[1].text);
  });

  it('carries no per-request volatility into the cached global layer', () => {
    const global = buildGlobalPrompt(READING);
    // Silent invalidators: a timestamp, a uuid, a per-request id in the prefix.
    expect(global).not.toMatch(/\b20\d\d-\d\d-\d\dT\d\d:/);
    expect(global).not.toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
    // Byte-identical for identical input — it is a pure function of the catalogue.
    expect(buildGlobalPrompt(READING)).toBe(global);
    // Comfortably over Sonnet 5's 1024-token minimum cacheable prefix (~4 chars/token).
    expect(global.length).toBeGreaterThan(1024 * 4);
  });
});
