import { describe, it, expect } from 'vitest';
import {
  MODEL,
  selectTier,
  buildSystemBlocks,
  buildUserTurn,
} from './guide-request';

describe('buildSystemBlocks — the cacheable layering', () => {
  const globalPrompt = 'GLOBAL PEDAGOGY AND INDEX';
  const sectionContext = 'SECTION 4.0 TEXT';

  it('puts the global layer first and the section layer second', () => {
    const blocks = buildSystemBlocks({ globalPrompt, sectionContext });
    expect(blocks.map((b) => b.text)).toEqual([globalPrompt, sectionContext]);
  });

  it('sets a cache breakpoint on each layer, and uses the 5-minute default TTL', () => {
    const blocks = buildSystemBlocks({ globalPrompt, sectionContext });
    expect(blocks).toHaveLength(2);
    for (const block of blocks) {
      expect(block.cache_control).toEqual({ type: 'ephemeral' });
      // Explicitly NOT ttl: '1h' — that costs 2x on write rather than 1.25x.
      expect(block.cache_control).not.toHaveProperty('ttl');
    }
  });

  it('stays within the 4-breakpoint-per-request ceiling', () => {
    const blocks = buildSystemBlocks({ globalPrompt, sectionContext });
    expect(blocks.filter((b) => b.cache_control).length).toBeLessThanOrEqual(4);
  });

  // THE REGRESSION THIS FILE EXISTS FOR.
  //
  // The old buildPromptWithContext() concatenated the section onto the global
  // prompt to make one string. That is one cache entry keyed on the section, so
  // changing section re-wrote the pedagogy core every time. The global layer's
  // bytes must not move when the section does.
  it('keeps the global layer byte-identical across sections', () => {
    const onFourZero = buildSystemBlocks({ globalPrompt, sectionContext: 'SECTION 4.0 TEXT' });
    const onFourThirteen = buildSystemBlocks({ globalPrompt, sectionContext: 'SECTION 4.13 TEXT' });

    expect(onFourZero[0].text).toBe(onFourThirteen[0].text);
    expect(onFourZero[1].text).not.toBe(onFourThirteen[1].text);
  });

  it('omits the second breakpoint entirely when there is no section', () => {
    for (const empty of [undefined, null, '', '   ']) {
      const blocks = buildSystemBlocks({ globalPrompt, sectionContext: empty });
      expect(blocks).toHaveLength(1);
      expect(blocks[0].text).toBe(globalPrompt);
    }
  });
});

describe('buildUserTurn — tier instructions sit AFTER the last breakpoint', () => {
  it('leaves a base turn untouched', () => {
    const decision = selectTier({ message: 'explain this section in simple terms' });
    expect(buildUserTurn('hello', decision)).toBe('hello');
  });

  // The old endpoint appended DEPTH PASS to the system prompt, which changed
  // the cached prefix at exactly the moment the request got expensive.
  it('appends the depth pass to the user turn, never the system prompt', () => {
    const decision = selectTier({ message: 'go deeper', escalate: true });
    const turn = buildUserTurn('go deeper', decision);
    expect(turn.startsWith('go deeper')).toBe(true);
    expect(turn).toContain('DEPTH PASS');
  });

  it('appends a comparison instruction on an auto-escalated comparison', () => {
    const decision = selectTier({ message: 'compare with 4.13' });
    expect(buildUserTurn('compare with 4.13', decision)).toContain('actual comparison');
  });
});

describe('selectTier — the distinction-distance ladder', () => {
  it('serves a plain question on Sonnet 5 at low effort', () => {
    const d = selectTier({ message: 'explain this section in simple terms' });
    expect(d.model).toBe(MODEL);
    expect(d.model).toBe('claude-sonnet-5');
    expect(d.effort).toBe('low');
    expect(d.tier).toBe('base');
    expect(d.reason).toBe('none');
  });

  it('escalates on the explicit Deeper button', () => {
    const d = selectTier({ message: 'anything', escalate: true });
    expect(d.tier).toBe('deep');
    expect(d.effort).toBe('xhigh');
    expect(d.reason).toBe('explicit-deeper');
    expect(d.explicit).toBe(true);
  });

  it("treats anything other than boolean true as not-escalated", () => {
    for (const creative of ['true', 1, 'opus', {}, [], 'deep'] as unknown[]) {
      const d = selectTier({ message: 'hello', escalate: creative as boolean });
      expect(d.effort).toBe('low');
    }
  });

  // TOM'S SPECIMEN. This is the exact question that made Alexander apologise.
  it("escalates on the reader's own comparison question, with no button pressed", () => {
    const d = selectTier({
      message: "compare with 4.13's treatment - least-time learning",
      history: [{ role: 'user', content: 'what does this section say?' }],
    });
    expect(d.tier).toBe('deep');
    expect(d.effort).toBe('high');
    expect(d.reason).toBe('cross-section-comparison');
    expect(d.explicit).toBe(false);
  });

  it('escalates when two sections are named in one breath', () => {
    const d = selectTier({ message: 'how does §4.2 relate to §8.1?' });
    expect(d.reason).toBe('cross-section-comparison');
  });

  it('does not read a bare number as a section reference', () => {
    const d = selectTier({ message: 'is this different from what most people think?' });
    expect(d.effort).toBe('low');
  });

  it('escalates on repeated confusion, but not on first-time confusion', () => {
    const first = selectTier({ message: "i don't understand this" });
    expect(first.effort).toBe('low');

    const second = selectTier({
      message: "i still don't understand the action functional",
      history: [
        { role: 'user', content: "i don't understand the action functional" },
        { role: 'assistant', content: 'It is an integral over the trajectory...' },
      ],
    });
    expect(second.tier).toBe('deep');
    expect(second.reason).toBe('repeated-confusion');
  });

  it('escalates when the reader asks a near-identical question again', () => {
    const d = selectTier({
      message: 'what do you mean the trajectory minimises the energy integral',
      history: [
        { role: 'user', content: 'how does the trajectory minimise the energy integral' },
        { role: 'assistant', content: '...' },
      ],
    });
    expect(d.reason).toBe('repeated-confusion');
  });

  // DE-ESCALATION. Escalation is a property of the turn, not a latch.
  it('falls back to base on a simple follow-up after a deep turn', () => {
    const history = [
      { role: 'user' as const, content: "compare with 4.13's treatment" },
      { role: 'assistant' as const, content: 'A long comparison...' },
    ];
    const d = selectTier({ message: 'thanks — what does HISE stand for?', history });
    expect(d.tier).toBe('base');
    expect(d.effort).toBe('low');
    expect(d.reason).toBe('none');
  });

  it('declines auto-escalation quietly when the escalated budget is spent', () => {
    const d = selectTier({
      message: "compare with 4.13's treatment",
      escalatedBudgetSpent: true,
    });
    expect(d.tier).toBe('base');
    expect(d.effort).toBe('low');
  });

  it('still honours the explicit button when the budget flag is set — the caller 429s that case', () => {
    const d = selectTier({ message: 'deeper', escalate: true, escalatedBudgetSpent: true });
    expect(d.explicit).toBe(true);
  });

  it('gives every rung explicit effort and real max_tokens headroom', () => {
    const rungs = [
      selectTier({ message: 'plain' }),
      selectTier({ message: 'compare §4.2 with §8.1' }),
      selectTier({ message: 'x', escalate: true }),
    ];
    for (const d of rungs) {
      expect(['low', 'high', 'xhigh']).toContain(d.effort);
      expect(d.maxTokens).toBeGreaterThanOrEqual(2048);
      // Every rung on one model: a model switch would void the cache.
      expect(d.model).toBe(MODEL);
    }
    expect(rungs[0].maxTokens).toBeLessThan(rungs[2].maxTokens);
  });

  it('never reads a model, tier or effort from the caller', () => {
    const hostile = {
      message: 'hello',
      model: 'claude-opus-5',
      tier: 'deep',
      effort: 'max',
    } as unknown as Parameters<typeof selectTier>[0];
    const d = selectTier(hostile);
    expect(d.model).toBe('claude-sonnet-5');
    expect(d.effort).toBe('low');
  });

  it('survives a malformed history without throwing', () => {
    const d = selectTier({
      message: 'hello',
      history: [null, { role: 'user' }, 'nonsense'] as never,
    });
    expect(d.effort).toBe('low');
  });
});

describe('cross-site reference notations', () => {
  it('escalates on a slug reference set against something', () => {
    const d = selectTier({ message: 'how does this compare with `option-space-formalisation`?' });
    expect(d.reason).toBe('cross-section-comparison');
  });

  it('escalates on an unnamed but explicit other section', () => {
    const d = selectTier({ message: 'how does this differ from the earlier section?' });
    expect(d.reason).toBe('cross-section-comparison');
  });

  it('does not read ordinary hyphenated English as a site reference', () => {
    for (const m of [
      'is this a well-known result?',
      'that seems counter-intuitive to me',
      'give me a real-world example',
    ]) {
      expect(selectTier({ message: m }).effort).toBe('low');
    }
  });
});
